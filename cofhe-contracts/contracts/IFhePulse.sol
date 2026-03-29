// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/// @title IFhePulse - Shared types and events for FhePulse
interface IFhePulse {
    enum VotingMode {
        Linear,
        Quadratic
    }

    enum PollStatus {
        SeekingFunding,
        Active,
        DecryptionRequested,
        Finalized
    }

    struct PollParams {
        string title;
        string description;
        uint8 optionCount;
        uint256 deadline;
        VotingMode votingMode;
        uint32 creditBudget;
    }

    event PollCreated(
        uint256 indexed pollId,
        address indexed pollAddress,
        address indexed creator,
        string title,
        uint8 optionCount,
        VotingMode votingMode,
        uint256 deadline
    );

    event PollFunded(
        address indexed poll,
        address indexed donor,
        uint256 amount
    );

    event Voted(
        address indexed poll,
        address indexed participant
    );

    event PollFinalized(
        address indexed poll,
        uint32[] results
    );

    event RewardClaimed(
        address indexed poll,
        address indexed participant,
        uint256 amount
    );
}
