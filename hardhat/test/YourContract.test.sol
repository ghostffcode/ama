// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import "../contracts/YourContract.sol";

contract YourContractTest is Test {
    YourContract myContract;

    function setUp() public {
        myContract = new YourContract();
    }

    function testsetPurpose() public {
        string memory text = "Hello someone!!";

        myContract.setPurpose(text);

        assertEq(bytes(text), bytes(myContract.purpose()));
    }
}
