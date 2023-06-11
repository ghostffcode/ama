//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Implementation is Initializable {
    uint256 public num;

    // constructor() {
    //     _disableInitializers();
    // }

    function initialize(uint256 _num) public initializer {
        num = _num;
    }

    function setNum(uint256 _num) public {
        num = _num;
    }

    function getNum() public view returns (uint256) {
        return num;
    }
}
