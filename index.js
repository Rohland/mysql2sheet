require('dotenv').config();
const yargs = require('yargs/yargs');
const {uploadDataToGoogleSheets} = require("./sheet-uploader");
const {hideBin} = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const {getConfig} = require('./config-provider');
const {executeQueries} = require('./query-service');

const configPath = argv.path;
if (!configPath) {
    console.error(`error: param --path is required\n`);
    process.exit(-1);
}

(async () => {
    try {
        const config = await getConfig(configPath);
        const dataToUpload = await executeQueries(config.rules);
        await uploadDataToGoogleSheets(config.rules);
    }
    catch (err) {
        console.error(`unexpected error executing mysql2sheets`, err);
        process.exit(-1);
    }
})();
