// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./Poll.sol";
import "./IFhePulse.sol";

/// @title PollFactory - Deploys and tracks FhePulse Poll instances
contract PollFactory is IFhePulse {
    address[] public polls;
    mapping(address => uint256[]) public creatorPolls;

    /// @notice Create a new poll
    /// @param params Poll creation parameters
    /// @return pollAddress The address of the newly deployed Poll contract
    function createPoll(PollParams calldata params)
        external
        returns (address pollAddress)
    {
        Poll poll = new Poll(
            msg.sender,
            params.title,
            params.description,
            params.optionCount,
            params.deadline,
            params.votingMode,
            params.creditBudget
        );

        pollAddress = address(poll);
        uint256 pollId = polls.length;
        polls.push(pollAddress);
        creatorPolls[msg.sender].push(pollId);

        emit PollCreated(
            pollId,
            pollAddress,
            msg.sender,
            params.title,
            params.optionCount,
            params.votingMode,
            params.deadline
        );
    }

    /// @notice Get a poll address by index
    function getPoll(uint256 pollId) external view returns (address) {
        require(pollId < polls.length, "Invalid poll ID");
        return polls[pollId];
    }

    /// @notice Get total number of polls created
    function getPollCount() external view returns (uint256) {
        return polls.length;
    }

    /// @notice Get all poll IDs created by a specific address
    function getCreatorPollIds(address creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorPolls[creator];
    }
}
