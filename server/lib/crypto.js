/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const jwcrypto = require("jwcrypto"),
      fs = require("fs"),
      assert = require("assert"),
      cert = jwcrypto.cert,
      config = require('./configuration');

// load desired algorithms
require("jwcrypto/lib/algs/rs");
require("jwcrypto/lib/algs/ds");

// TODO move these to a shared constants/config file eventually
// and share it with scripts/gen_keys.js
var configDir = fs.realpathSync(config.get('config_path'));
var pubKeyFile = configDir + "/public-key.json";
var secretKeyFile = configDir + "/secret-key.json";

// Load Pub/Private keys from the filesystem, exit loudly if you can't read them
var missingFileErr = null;
if (!fs.existsSync(pubKeyFile)) missingFileErr = "Public Key file ["+ pubKeyFile + "] does not exist";
if (!fs.existsSync(secretKeyFile)) missingFileErr =  "Secret Key file ["+secretKeyFile+"] does not exist";
if (missingFileErr) {
  console.error('ERROR:', missingFileErr);
  console.log("\n---> run scripts/gen_keys.js to fix this\n");
  console.log();
  process.exit(1);
}

var _privKey = jwcrypto.loadSecretKey(fs.readFileSync(secretKeyFile));
exports.pubKey = fs.readFileSync(pubKeyFile);

exports.cert_key = function(pubkey, email, duration_s, cb) {
  var pubKey = jwcrypto.loadPublicKey(pubkey);

  var expiration = new Date();
  var iat = new Date();

  expiration.setTime(new Date().valueOf() + (duration_s * 1000));

  // Set issuedAt to 10 seconds ago. Pads for verifier clock skew
  iat.setTime(iat.valueOf() - (10 * 1000));

  cert.sign(
    {publicKey: pubKey, principal: {email: email}},
    {issuer: config.get('issuer'), issuedAt: iat, expiresAt: expiration},
    null,
    _privKey,
    cb);
};
