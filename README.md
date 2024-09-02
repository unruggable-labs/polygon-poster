# polygon-poster

Trustless Polygon PoS Poster Bot for [unruggable/**evmgateway**](https://github.com/unruggable-labs/evmgateway-v2/tree/main/v2)

## Setup

1. `bun i`
1. setup [`.env`]('./.env.example)

## Operation

* `bun index.ts`
* Every 10 minutes, calls [`post()`](https://polygonscan.com/address/0x591663413423Dcf7c7806930E642951E0dDdf10B#writeContract#F1) if there is a checkpoint without a poster
