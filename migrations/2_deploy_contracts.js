const LinniaHub = artifacts.require("./LinniaHub.sol")
const LinniaUsers = artifacts.require("./LinniaUsers.sol")
const LinniaRecords = artifacts.require("./LinniaRecords.sol")
const LinniaPermissions = artifacts.require("./LinniaPermissions.sol")
const DataPayments = artifacts.require("./DataPayments.sol")
const config = require('../config.js');

module.exports = (deployer, network, accounts) => {
  const adminAddress = accounts[0];
  let hubInstance, dataInstance;
  deployer.deploy(DataPayments);

  let payoutGroups = config.payoutGroups;

  // deploy the hub
  deployer.deploy(LinniaHub).then(() => {
    return LinniaHub.deployed()
  }).then((_hubInstace) => {
    hubInstance = _hubInstace
    // deploy Users
    return deployer.deploy(LinniaUsers, hubInstance.address)
  }).then(() => {
    // deploy Records
    return deployer.deploy(LinniaRecords, hubInstance.address)
  }).then(() => {
    // deploy Permissions
    return deployer.deploy(LinniaPermissions, hubInstance.address)
  }).then(() => {
    // set all the addresses in the hub
    return deployer.deploy(DataPayments)
  }).then((_dataInstance) => {
    dataInstance = _dataInstance;
    // set all the addresses in the hub
    return hubInstance.setUsersContract(LinniaUsers.address)
  }).then(() => {
    return hubInstance.setRecordsContract(LinniaRecords.address)
  }).then(() => {
    return hubInstance.setPermissionsContract(LinniaPermissions.address)
  }).then(() => {
    return dataInstance.registerAsBuyer({from: accounts[0]})
  }).then(() => {
    return dataInstance.registerAsBuyer({from: accounts[1]})
  }).then(() => {
    return dataInstance.registerAsBuyer({from: accounts[2]})
  }).then(() => {
    return dataInstance.setPayoutGroup(payoutGroups[0].users, payoutGroups[0].weights, {from: accounts[0]})
  }).then(() => {
    return dataInstance.setPayoutGroup(payoutGroups[0].users, payoutGroups[0].weights, {from: accounts[1]})
  }).then(() => {
    return dataInstance.setPayoutGroup(payoutGroups[0].users, payoutGroups[0].weights, {from: accounts[2]})
  })
  
  ;
}
