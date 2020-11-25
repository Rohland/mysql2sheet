const fs = require('fs');
const resolve = require('path').resolve;

async function getConfig(configFilePath) {

    const absPath = resolve(configFilePath.replace(
        /^~\//,
        `${process.env.HOME}/`));
    console.info(`loading config and tasks from: '${ absPath }'`);
    const config = require(absPath);
    return config;
}

module.exports = {
    getConfig: getConfig
};
