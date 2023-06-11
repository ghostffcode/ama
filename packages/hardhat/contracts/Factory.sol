//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import "./Implementation.sol";

contract Factory {
    address public implementationAddress;

    constructor(uint256 initialNum) {
        Implementation implementation = new Implementation();
        implementation.initialize(initialNum);
        implementationAddress = address(implementation);
    }

    function createProxy(uint256 initialNum) public returns (address) {
        bytes memory data = abi.encodeWithSignature(
            "initialize(uint256)",
            initialNum
        );
        address clone = Clones.cloneDeterministic(
            implementationAddress,
            keccak256(data)
        );
        (bool success, ) = clone.call(data);
        require(success, "Factory: Initialization failed");
        return clone;
    }
}
