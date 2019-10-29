//jshint esversion:8

const StellarSdk = require("stellar-sdk");
const fetch = require('node-fetch');
const pair = StellarSdk.Keypair.random();

//Create an account

(async function main() {
  try {
    // 1. Ask friendbot to create an account for you.
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);

    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    // 2. Get account details and check it's balance.
    // the JS SDK uses promises for most actions, such as retrieving an account
    const account = await server.loadAccount(pair.publicKey());
    console.log("Secret seed: " + pair.secret());
    console.log("Balances for account: " + pair.publicKey());
    account.balances.forEach(function(balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });

  } catch (e) {
    console.error("ERROR!", e);
  }
})();

// This are the two accounts that will be used to make and receive payments:

// Account 1
// Secret seed: SCZMQW234GD3NVOSAOBYLS4QNBJWSDDJ6B376YOH6G7UFP6UUXP6BVTO
// Public Key: GAGSHA2IRXXLUVV3YVQHMG2LSCQKGDUZWLUF73EF7IAK6O4EGOP3XDP5
//
// Account 2
// Secret seed: SAKSNG65444RMNGS33MHYRWJ5ZTCAOMKIXANM6G3IGNMLCEPHIRTZVMO
// Public Key: GDUH6NGLOWAD7DM6HI6FQUBYMGUZ2SHMP25OLEHNUT5WVGXOCUMBN4X7
