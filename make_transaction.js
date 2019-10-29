//jshint esversion:8

//Make a transaction using Stellar

//Account 1
const secretSeed1 = 'SCZMQW234GD3NVOSAOBYLS4QNBJWSDDJ6B376YOH6G7UFP6UUXP6BVTO';
const publicKey1 = 'GAGSHA2IRXXLUVV3YVQHMG2LSCQKGDUZWLUF73EF7IAK6O4EGOP3XDP5';

//Account 2
const secretSeed2 = 'SAKSNG65444RMNGS33MHYRWJ5ZTCAOMKIXANM6G3IGNMLCEPHIRTZVMO';
const publicKey2 = 'GDUH6NGLOWAD7DM6HI6FQUBYMGUZ2SHMP25OLEHNUT5WVGXOCUMBN4X7';

const StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
// Write secret seed of the origin account
var sourceKeys = StellarSdk.Keypair
  .fromSecret(secretSeed1);
// Write the public key of the destination account
var destinationId = publicKey2;
// Transaction will hold a built transaction we can resubmit if the result is unknown.
var transaction;

// 1. Check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server.loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSdk.NotFoundError, function(error) {
    throw new Error('The destination account does not exist!');
  })
  // If there was no error, load up-to-date information on your account.
  .then(function() {
    // 2. Load data for the account you are sending from.
    return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function(sourceAccount) {
    //3. Start building a transaction.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
      //4. Add the payment operation to the account. the amount is a string rather than a number.
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        // Because Stellar allows transaction in many currencies, you must
        // specify the asset type. The special "native" asset represents Lumens.
        asset: StellarSdk.Asset.native(),
        amount: "20"
      }))
      // 5. A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text('Test Transaction 3'))
      // Wait a maximum of three minutes for the transaction
      .setTimeout(180)
      .build();
    // 6. Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // 7. And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function(result) {
    console.log('Success! Results:', result);
  })
  .catch(function(error) {
    console.error('Something went wrong!', error);
    // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // already built transaction:
    // server.submitTransaction(transaction);
  });
