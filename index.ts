import { PolygonPoSRollup } from '@unruggable/evmgateway';
import { ethers } from 'ethers';

const config = PolygonPoSRollup.mainnetConfig;

// public rpcs (this barely makes any calls)
const provider1 = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth', config.chain1, {staticNetwork: true});
const provider2 = new ethers.JsonRpcProvider('https://polygon-rpc.com/', config.chain2, {staticNetwork: true});

const wallet = new ethers.Wallet(process.env.PKEY!, provider2);

const poster = new ethers.Contract(config.poster.address, [
	'function post()',
	'event NewRoot(bytes32 indexed prevBlockHash)',
], wallet);

const rootChain = new ethers.Contract(config.RootChain, [
	'function getLastChildBlock() view returns (uint256)',
], provider1);

function extractPrevBlockHash(log: ethers.Log) {
	return log.topics[1];
}

async function post() {
	console.log(new Date(), 'Posting...');
	const tx = await poster.post();
	console.log(new Date(),  `https://polygonscan.io/tx/${tx.hash}`);
	const receipt = await tx.wait();
	const prevBlockHash = extractPrevBlockHash(receipt.logs[0]);
	const block = await provider2.getBlock(prevBlockHash);
	console.log(new Date(), `https://polygonscan.io/block/${block.number}`);
}

async function shouldPost() {
	const logs = await poster.queryFilter(poster.filters.NewRoot());
	if (!logs.length) return true;
	const log = logs[logs.length - 1];
	const prevBlockHash = extractPrevBlockHash(log);
	const block = await provider2.getBlock(prevBlockHash);
	if (!block) throw new Error('no block');
	const latest = Number(await rootChain.getLastChildBlock());
	return latest > block.number;
}

console.log(`Account: ${wallet.address}`);
console.log(`Balance: ${ethers.formatEther(await provider2.getBalance(wallet.address))}`);
console.log(`Poster: ${poster.target}`);

while (true) {
	try {
		if (await shouldPost()) {
			await post();
		} else {
			console.log(new Date(), `Waiting to post...`);
		}
	} catch (err) {
		console.log(new Date(), err);
	}
	await new Promise(f => setTimeout(f, 10 * 60000));
}
