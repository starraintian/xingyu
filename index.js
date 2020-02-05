const https         = require('https');
const fs            = require('fs');
const express       = require('express');
const path          = require('path');

const ENABLE_HTTPS = 'enable-https';
const KEY_PATH = 'key-path';
const CERT_PATH = 'cert-path';
const CERT_PASS_PHRASE = 'cert-pass-phrase';
const SERVER_PORT = 'server-port';

var argv = require('minimist')(process.argv.slice(2));
console.log('application arguments:');
console.dir(argv);
console.log();

const app = express();

var port = 3334;
if (argv[SERVER_PORT]) {
    port = argv[SERVER_PORT];
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'cuterobotguide/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/cuterobotguide/build/index.html'));
});


if (argv[ENABLE_HTTPS]) {
    if (argv[CERT_PASS_PHRASE] == undefined) {
        console.warn('no pass phrase input. use --cert-pass-phrase to set password of cert');
    }

    if (argv[KEY_PATH] == undefined) {
        console.error('use --key-path to set path of key');
        process.exit(1);
    }

    if (argv[CERT_PATH] == undefined) {
        console.error('use --cert-path to set path of cert');
        process.exit(1);
    }

    var options = {
        key: fs.readFileSync(argv[KEY_PATH]),
        cert: fs.readFileSync(argv[CERT_PATH]),
        passphrase: argv[CERT_PASS_PHRASE],
        requestCert: false,
        rejectUnauthorized: false
    };

    var server = https.createServer(options, app);

    server.listen(port, function(){
        console.log("Working on port %d, through HTTPS protocol", port);
    });

} else {
    app.listen(port, function () {
        console.log("Working on port %d, through HTTP protocol", port);
    });
}
