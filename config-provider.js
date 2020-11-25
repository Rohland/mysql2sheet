const fs = require('fs');

async function getConfig(configFilePath) {
    console.info(`loading config from: '${ configFilePath }'`);
    const config = require(configFilePath);
    return config;
}

module.exports = {
    getConfig: getConfig
};