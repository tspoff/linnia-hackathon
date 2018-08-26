const Web3 = require("Web3");
const datapayments_artifiact = require('../build/contracts/DataPayments.json');
const HDWalletProvider = require("truffle-hdwallet-provider");
const Linnia = require('@linniaprotocol/linnia-js');
const IPFS = require('ipfs-api');
const keys = require('./keys.js');
const linnia = require('../linnia').linnia;
const ipfs = require('../linnia').ipfs;

var ethers = require('ethers');
var Wallet = ethers.Wallet;
var utils = ethers.utils;
var providers = ethers.providers;
var Contract = ethers.Contract;

const DATA_CONTRACT_ADDRESS = '0xcafb73033fda042d1d8fbc0f2b993c2197acb6f4';
var DATA_CONTRACT_ABI = datapayments_artifiact.abi;

//Get web3
let web3 = new Web3(new HDWalletProvider(keys.MNEMONIC, keys.INFURA_NODE));
//Get contract w/ definition
// var dataInstance = dataContract.at(DATA_CONTRACT_ADDRESS);
// console.log(dataContract.address);

var wallet = Wallet.fromMnemonic(keys.MNEMONIC);
// console.log("wallet address", wallet.address);
var provider = ethers.providers.getDefaultProvider('ropsten');
var contract = new ethers.Contract(DATA_CONTRACT_ADDRESS, DATA_CONTRACT_ABI, provider);
console.log(contract);

/** retrieves contract events
* @param {Object} contract  - contract to get events from
* @param {string} eventName - Name of the event to get logs from
* @param {Array} extraTopics - Array of extra filtering options , in the exact order as the ABI specifies for the event (indexed event args)
* @param {number} fromBlock - block to start lookup from
* @param (number) toBlock - last block to end lookup at
* @returns logs - Parsed event logs
*/
const _getEvents = async (contract, eventName, wallet, extraTopics = null, fromBlock = 0, toBlock = 'latest') => {
    try {
      
      //Get event
      let event = contract.interface.events[eventName]
       if (extraTopics!== null) {
        event.topics[1] = keccak256(wallet.address)
        for (let i = 0; i < extraTopics.length; i++) {
          event.topics[i+1] = keccak256(extraTopics[i])
        }
      }
      let logs = await provider.getLogs({
        fromBlock,
        toBlock,
        address: contract.address,
        topics: event.topics
      })
      return logs.map(log => event.parse(log.topics, log.data))
    } catch (err) {
      throw new Error ("Something went wrong while retrieving event: " + err)
    }
  }

const getEvents = async () => {
    const events = await _getEvents(contract, 'Deposited', wallet, extraTopics = null, fromBlock = 5000, toBlock = 'latest');
    console.log(events);
    for (let event of events) {
        console.log(event.payee + " " + event.weiAmount.toNumber());
    }
}

const addRecord = async () => {
    const record = await linnia.getRecord('0x3ef7569f96be7330d42202c2c84f74669b95d0dd5cffc9173d76ecc95ef4c264');
    console.log(record);

}

//button press
addRecord();
// getEvents();