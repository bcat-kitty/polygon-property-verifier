// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PropertyVerifier
/// @notice Minimal on-chain registry of verified property address hashes.
///         Emits an event containing the SHA-256 hash of a property address
///         so external services (e.g. Polygonscan) can index the record.
contract PropertyVerifier {
    event PropertyVerified(
        bytes32 indexed propertyHash,
        address indexed verifier,
        uint256 timestamp
    );

    function verifyProperty(bytes32 propertyHash) external {
        require(propertyHash != bytes32(0), "PropertyVerifier: zero hash");
        emit PropertyVerified(propertyHash, msg.sender, block.timestamp);
    }
}
