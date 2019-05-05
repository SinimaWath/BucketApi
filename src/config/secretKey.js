const fs = require('fs');

const keyLen = 32;

function generateJWTKey () {
    if (fs.existsSync(__dirname + '/secretKey.json')) {
        console.log('Key already exist, check ./config/secretKey');

        return;
    }
    let secretConfig = {};
    secretConfig.privateKey = generateString(keyLen);

    const JSONSecretKey = JSON.stringify(secretConfig, null, '  ');
    fs.writeFile(__dirname + '/secretKey.json', JSONSecretKey, (err) => console.error(err));
}

const generateString = (s = 0) => [...Array(Math.max((Math.ceil(s / 11) - 1), 0))]
    .reduce((str) => str.concat(Math.random().toString(36).substring(2, 13)), '')
    .concat(Math.random().toString(36).substring(2, Math.max((s % 11) || s, 0) + 2));

generateJWTKey();
