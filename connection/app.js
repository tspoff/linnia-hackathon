const contract = require('truffle-contract');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');
const datapayments_artifact = require('../build/contracts/DataPayments.json');
var MetaCoin = contract(metacoin_artifact);
var DataPayments = contract(datapayments_artifact);

module.exports = {
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        //alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        //alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  register: async function(sender, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    DataPayments.setProvider(self.web3.currentProvider);

    var dataInstance = await DataPayments.deployed();

    try {
      const result = await dataInstance.registerAsBuyer({from: sender});
      callback(result.valueOf());
    }
    catch (e) {
        console.log(e);
        callback("Error 404");
    }
  },
  depositPayout: async function(sender, callback) {
    var self = this;

    DataPayments.setProvider(self.web3.currentProvider);

    var dataInstance = await DataPayments.deployed();

    try {
      const result = await dataInstance.depositPayout({from: sender});
      callback(result.valueOf());
    }
    catch (e) {
        console.log(e);
        callback("Error 404");
    }
  },
  setPayoutGroup: async function(users, weights, sender, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    DataPayments.setProvider(self.web3.currentProvider);

    var dataInstance = await DataPayments.deployed();

    try {
      const result = await dataInstance.setPayoutGroup(users, weights, {from: sender});
      callback(result.valueOf());
    }
    catch (e) {
        console.log(e);
        callback("Error 404");
    }
  },
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
