# polygon-poster

Trustless Polygon PoS Poster Bot for [unruggable/**evmgateway**](https://github.com/unruggable-labs/evmgateway-v2/tree/main/v2)

## Setup

1. `bun i`
1. setup [`.env`](./.env.example)

## Operation

* `bun index.ts`
* Every 10 minutes, calls [`post()`]() if there is a checkpoint without a poster

## Contract

* Deployment: [`0x591663413423Dcf7c7806930E642951E0dDdf10B`](https://polygonscan.com/address/0x591663413423Dcf7c7806930E642951E0dDdf10B#code)
* Gas per call: [`22544`](https://polygonscan.com/tx/0x14e7e23efccaf3831761a8fbcfbb58cbaad6bbd8795e47cff09ff6e0b9792fd4)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Poster {

	event NewRoot(bytes32 indexed prevBlockHash);

	function post() external {
		emit NewRoot(blockhash(block.number - 1));
	}

}
```