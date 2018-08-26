const express = require('express');
const app = express();
require('dotenv').config()
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const Linnia = require('@linniaprotocol/linnia-js');
const linnia = require('./linnia').linnia;
const ipfs = require('./linnia').ipfs;

const BASE_ACCOUNT = '0x44f984f0ad7fbf5db3db5262179decacdfa34dcb';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

app.get('/register', (req, res) => {
  console.log("**** GET /register ****");
  let sender = BASE_ACCOUNT;

  truffle_connect.register(sender, (answer) => {
    res.send(answer);
  });
});

app.get('/initPayout', (req, res) => {
  console.log("**** GET /initPayout ****");
  let sender = BASE_ACCOUNT;

  truffle_connect.depositPayout(sender, (answer) => {
    res.send(answer);
  });
});

app.get('/records/:hash', async (req, res) => {
  console.log("**** GET /getRecords ****");
  const record = await linnia.getRecord(req.params.hash);
  // Some record information (more available)
  res.send({
      hash: record.dataHash,
      owner: record.owner,
      dataUri: record.dataUri
  });
});

app.get('/records/:hash/decrypt', async (req, res) => {
  console.log("**** Decrypt Hash ****");
  // Get the Linnia record from the record hash
  const record = await linnia.getRecord(req.params.hash);
  // Get the encrypted data as a hex string
  const encrypted = (await ipfs.cat(record.dataUri)).toString();
  // Use the encryption private key to decrypt and convert to string
  const decrypted = (await Linnia.util.decrypt(process.env.LINNIA_PRIVATE_KEY, encrypted)).toString();

  res.send(decrypted);
});

app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function(answer){
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});

app.post('/sendCoin', (req, res) => {
  console.log("**** GET /sendCoin ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
});

app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/' + process.env.INFURA_NODE));
  // truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);

});
