const {google} = require('googleapis');

const authTokens = {};

function getGoogleAuth(name) {
    const cachedAuthToken = authTokens[name];
    if (cachedAuthToken) {
        return cachedAuthToken;
    }
    const credentialJson = process.env[`google_credential_${name}`];
    if (!credentialJson) {
        throw new Error(`could not find google credential with name '${name}`);
    }
    const credential = JSON.parse(credentialJson);
    const auth = new google.auth.JWT(
        credential.client_email,
        null,
        credential.private_key,
        [
            "https://www.googleapis.com/auth/spreadsheets"
        ],
        null
    );
    authTokens[name] = auth;
    return auth;
}

function getResultType(rule) {
    const resultType = rule.type;
    if (!resultType) {
        throw new Error(`no result type was set for rule with name '${rule.name}'`);
    }
    const type = resultType.trim().toLocaleLowerCase();
    if (
        type === 'scalar'
        || type === 'table') {
        return type;
    }
    throw new Error(`unknown result type '${type}' for rule with name '${rule.name}'`);
}

function getResultValues(rule) {
    const type = getResultType(rule);
    const result = {
        values: rule.result
    }
    if (type === 'scalar') {
        return result;
    } else if (type === 'table') {
        result.majorDimension = "ROWS";
        return result;
    }
    throw new Error(`unknown result type '${type}' for rule with name '${rule.name}'`);
}

async function clearRange(
    rule,
    sheets) {
    return new Promise((resolve, reject) => {
        const payload = {
            spreadsheetId: rule.googleSheetId,
            range: rule.googleSheetRange,
        };
        sheets.spreadsheets.values.clear(
            payload,
            (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
    });
}

async function uploadDataForRule(rule) {
    const auth = getGoogleAuth(rule.googleCredential);
    const sheets = google.sheets({
        version: 'v4',
        auth: auth
    });
    console.log(`sheets: uploading for rule ${rule.name}`);
    if (rule.clearRange) {
        await clearRange(
            rule,
            sheets);
    }
    const resource = getResultValues(rule);
    return new Promise((resolve, reject) => {
        const payload = {
            spreadsheetId: rule.googleSheetId,
            valueInputOption: "USER_ENTERED",
            range: rule.googleSheetRange,
            resource: resource
        };
        sheets.spreadsheets.values.update(
            payload,
            (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
    });
}

async function uploadDataToGoogleSheets(rules) {
    await Promise.all(rules.map(x => uploadDataForRule(x)));
}

module.exports = {
    uploadDataToGoogleSheets: uploadDataToGoogleSheets
}
