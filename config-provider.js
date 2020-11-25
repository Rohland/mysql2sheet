const fs = require('fs');
const resolve = require('path').resolve;

async function getConfig(configFilePath) {
    console.info(`loading config and tasks from: '${ resolve(configFilePath) }'`);
    const config = require(configFilePath);
    return config;
}

module.exports = {
    getConfig: getConfig
};
