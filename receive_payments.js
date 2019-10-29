//jshint esversion:8

//Check history of payments done

//Account 1
const secretSeed1 = 'SCZMQW234GD3NVOSAOBYLS4QNBJWSDDJ6B376YOH6G7UFP6UUXP6BVTO';
const publicKey1 = 'GAGSHA2IRXXLUVV3YVQHMG2LSCQKGDUZWLUF73EF7IAK6O4EGOP3XDP5';

//Account 2
const secretSeed2 = 'SAKSNG65444RMNGS33MHYRWJ5ZTCAOMKIXANM6G3IGNMLCEPHIRTZVMO';
const publicKey2 = 'GDUH6NGLOWAD7DM6HI6FQUBYMGUZ2SHMP25OLEHNUT5WVGXOCUMBN4X7';


const StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
var accountId = publicKey2;

// Create an API call to query payments involving the account.
var payments = server.payments().forAccount(accountId);

// If some payments have already been handled, start the results from the
// last seen payment. (See below in `handlePayment` where it gets saved.)
var lastToken = loadLastPagingToken();
if (lastToken) {
  payments.cursor(lastToken);
}

// `stream` will send each recorded payment, one by one, then keep the
// connection open and continue to send you new payments as they occur.
payments.stream({
  onmessage: function(payment) {
    // Record the paging token so we can start from here next time.
    savePagingToken(payment.paging_token);

    // The payments stream includes both sent and received payments. We only
    // want to process received payments here.
    if (payment.to !== accountId) {
      return;
    }

    // In Stellar’s API, Lumens are referred to as the “native” type. Other
    // asset types have more detailed information.
    var asset;
    if (payment.asset_type === 'native') {
      asset = 'lumens';
    } else {
      asset = payment.asset_code + ':' + payment.asset_issuer;
    }

    console.log(payment.amount + ' ' + asset + ' from ' + payment.from);
  },

  onerror: function(error) {
    console.error('Error in payment stream');
  }
});

function savePagingToken(token) {
  // In most cases, you should save this to a local database or file so that
  // you can load it next time you stream new payments.
}

function loadLastPagingToken() {
  // Get the last paging token from a local database or file
}
