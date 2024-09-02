// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Poster {

	event NewRoot(bytes32 indexed prevBlockHash);

	function post() external {
		emit NewRoot(blockhash(block.number - 1));
	}

}
