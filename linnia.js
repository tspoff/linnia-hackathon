const Web3 = require('web3');
const Linnia = require('@linniaprotocol/linnia-js');
const IPFS = require('ipfs-api');
import logger from './logger';

// Ganache (local)
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Ropsten (testnet)
let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/' + process.env.ROPSTEN_API_KEY));

const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

// Not sure why, but hubAddress cannot be renamed without causing an error?!
const hubAddress = '0x177bf15e7e703f4980b7ef75a58dc4198f0f1172';
const linnia = new Linnia(web3, ipfs, { hubAddress });

// get the deployed contracts
//const { _, users, records, permissions } = await linnia.getContractInstances();

export { linnia, ipfs };
