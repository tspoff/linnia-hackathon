var HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777'
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_NODE);
      },
      network_id: 3
    },
  }
}
