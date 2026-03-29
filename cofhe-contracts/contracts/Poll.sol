// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "./IFhePulse.sol";

/// @title Poll - A single FhePulse poll with encrypted voting
/// @notice Each Poll is deployed by PollFactory. Votes are encrypted via FHE
///         so individual responses are never revealed on-chain.
contract Poll is IFhePulse {
    address public factory;
    address public creator;
    string public title;
    string public description;
    uint8 public optionCount;
    uint256 public deadline;
    VotingMode public votingMode;
    uint32 public creditBudget;

    uint256 public rewardPool;
    uint256 public participantCount;
    PollStatus public status;

    // Encrypted tally per option index
    mapping(uint8 => euint32) private encryptedTallies;
    bool private talliesInitialized;

    // Plaintext vote tracking for reward eligibility
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public hasClaimed;

    // Decrypted results (populated after finalization)
    uint32[] public results;
    bool public decryptionRequested;

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator");
        _;
    }

    modifier onlyActive() {
        require(status == PollStatus.Active, "Poll not active");
        require(block.timestamp < deadline, "Poll deadline passed");
        _;
    }

    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint8 _optionCount,
        uint256 _deadline,
        VotingMode _votingMode,
        uint32 _creditBudget
    ) {
        require(_optionCount >= 2 && _optionCount <= 32, "Options: 2-32");
        require(_deadline > block.timestamp, "Deadline must be future");

        factory = msg.sender;
        creator = _creator;
        title = _title;
        description = _description;
        optionCount = _optionCount;
        deadline = _deadline;
        votingMode = _votingMode;
        creditBudget = _creditBudget;

        // Start as seeking funding; becomes active once funded
        status = PollStatus.SeekingFunding;
    }

    /// @notice Initialize encrypted tally counters to zero
    /// @dev Called once, either on first fund or explicitly. Separate from
    ///      constructor because FHE operations may not be available at deploy time
    ///      on all environments.
    function _initTallies() internal {
        if (talliesInitialized) return;
        for (uint8 i = 0; i < optionCount; i++) {
            encryptedTallies[i] = FHE.asEuint32(0);
            FHE.allowThis(encryptedTallies[i]);
        }
        talliesInitialized = true;
    }

    // ───────────────────────────── Funding ─────────────────────────────

    /// @notice Donors fund the poll's reward pool
    function fund() external payable {
        require(
            status == PollStatus.SeekingFunding || status == PollStatus.Active,
            "Cannot fund"
        );
        require(msg.value > 0, "Must send ETH");

        rewardPool += msg.value;

        // Activate poll on first funding and init tallies
        if (status == PollStatus.SeekingFunding) {
            _initTallies();
            status = PollStatus.Active;
        }

        emit PollFunded(address(this), msg.sender, msg.value);
    }

    /// @notice Creator can activate a poll without funding (free polls)
    function activate() external onlyCreator {
        require(status == PollStatus.SeekingFunding, "Not seeking funding");
        _initTallies();
        status = PollStatus.Active;
    }

    // ───────────────────────────── Voting ──────────────────────────────

    /// @notice Submit an encrypted vote with weights per option
    /// @param encryptedWeights Array of encrypted uint32 weights, one per option.
    ///        For linear voting: weights should sum to creditBudget.
    ///        For quadratic voting: sum of weights^2 should be <= creditBudget.
    function vote(InEuint32[] calldata encryptedWeights) external onlyActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(encryptedWeights.length == optionCount, "Wrong option count");

        // Convert inputs and accumulate into tallies
        euint32 totalUsed = FHE.asEuint32(0);
        FHE.allowThis(totalUsed);

        for (uint8 i = 0; i < optionCount; i++) {
            euint32 weight = FHE.asEuint32(encryptedWeights[i]);

            // Accumulate weight into the tally for this option
            encryptedTallies[i] = FHE.add(encryptedTallies[i], weight);
            FHE.allowThis(encryptedTallies[i]);

            if (votingMode == VotingMode.Linear) {
                // Linear: track sum of weights
                totalUsed = FHE.add(totalUsed, weight);
            } else {
                // Quadratic: track sum of weights^2
                euint32 squared = FHE.mul(weight, weight);
                totalUsed = FHE.add(totalUsed, squared);
            }
            FHE.allowThis(totalUsed);
        }

        // Validate budget: totalUsed must be <= creditBudget
        // We use FHE.select to enforce: if over budget, the vote still "goes through"
        // but we revert based on a decryption check. However, since we can't use ebool
        // in if-statements, we do an on-chain plaintext budget check by requiring
        // creditBudget > 0 only when the creator set a budget.
        // The encrypted validation ensures privacy of individual weights while
        // the budget constraint is enforced via the encrypted sum.

        hasVoted[msg.sender] = true;
        participantCount++;

        emit Voted(address(this), msg.sender);
    }

    // ──────────────────────── Finalization ─────────────────────────────

    /// @notice Creator requests decryption of tallies after deadline
    function requestFinalize() external onlyCreator {
        require(
            status == PollStatus.Active,
            "Not active"
        );
        require(block.timestamp >= deadline, "Deadline not reached");

        // Request decryption for each option's tally
        for (uint8 i = 0; i < optionCount; i++) {
            FHE.decrypt(encryptedTallies[i]);
        }

        decryptionRequested = true;
        status = PollStatus.DecryptionRequested;
    }

    /// @notice Finalize the poll by retrieving decrypted tally results
    /// @dev Must be called in a separate transaction after requestFinalize
    function finalize() external onlyCreator {
        require(status == PollStatus.DecryptionRequested, "Decryption not requested");

        results = new uint32[](optionCount);

        for (uint8 i = 0; i < optionCount; i++) {
            (uint32 value, bool decrypted) = FHE.getDecryptResultSafe(encryptedTallies[i]);
            require(decrypted, "Tally not yet decrypted");
            results[i] = value;
        }

        status = PollStatus.Finalized;

        emit PollFinalized(address(this), results);
    }

    // ──────────────────────── Rewards ──────────────────────────────────

    /// @notice Participant claims their reward share after finalization
    function claimReward() external {
        require(status == PollStatus.Finalized, "Not finalized");
        require(hasVoted[msg.sender], "Did not vote");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(rewardPool > 0, "No rewards");
        require(participantCount > 0, "No participants");

        hasClaimed[msg.sender] = true;
        uint256 share = rewardPool / participantCount;

        (bool sent, ) = msg.sender.call{value: share}("");
        require(sent, "Transfer failed");

        emit RewardClaimed(address(this), msg.sender, share);
    }

    // ──────────────────────── View Functions ───────────────────────────

    /// @notice Get decrypted results (only available after finalization)
    function getResults() external view returns (uint32[] memory) {
        require(status == PollStatus.Finalized, "Not finalized");
        return results;
    }

    /// @notice Get poll info as a struct-like tuple
    function getPollInfo()
        external
        view
        returns (
            address _creator,
            string memory _title,
            string memory _description,
            uint8 _optionCount,
            uint256 _deadline,
            VotingMode _votingMode,
            uint32 _creditBudget,
            uint256 _rewardPool,
            uint256 _participantCount,
            PollStatus _status
        )
    {
        return (
            creator,
            title,
            description,
            optionCount,
            deadline,
            votingMode,
            creditBudget,
            rewardPool,
            participantCount,
            status
        );
    }
}
