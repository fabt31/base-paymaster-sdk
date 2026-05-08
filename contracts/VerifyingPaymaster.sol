// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/// @title VerifyingPaymaster - Sponsor gas with off-chain signature on Base
contract VerifyingPaymaster is BasePaymaster {
    using ECDSA for bytes32;

    address public verifyingSigner;
    mapping(address => uint256) public senderNonce;

    event GasSponsored(address indexed sender, uint256 gasCost);

    constructor(IEntryPoint _entryPoint, address _signer) BasePaymaster(_entryPoint) {
        verifyingSigner = _signer;
    }

    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal override returns (bytes memory context, uint256 validationData) {
        bytes calldata paymasterAndData = userOp.paymasterAndData;
        require(paymasterAndData.length >= 20 + 65, "Invalid paymaster data");

        bytes calldata signature = paymasterAndData[20:85];
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(
            keccak256(abi.encode(userOp.sender, senderNonce[userOp.sender], block.chainid, address(this)))
        );
        address recovered = hash.recover(signature);
        if (recovered != verifyingSigner) {
            return ("", 1); // validation failed
        }
        senderNonce[userOp.sender]++;
        return (abi.encode(userOp.sender, maxCost), 0);
    }

    function _postOp(PostOpMode, bytes calldata context, uint256 actualGasCost, uint256) internal override {
        (address sender,) = abi.decode(context, (address, uint256));
        emit GasSponsored(sender, actualGasCost);
    }

    function setSigner(address _signer) external onlyOwner {
        verifyingSigner = _signer;
    }
}
