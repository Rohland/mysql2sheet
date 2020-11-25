const {google} = require('googleapis');
const authTokens = {};

function getGoogleAuth(
    name,
    credentials) {
    const cachedAuthToken = authTokens[name];
    if (cachedAuthToken) {
        return cachedAuthToken;
    }
    const credential = credentials[name];
    if (!credential) {
        throw new Error(`could not find google credential with name '${name}`);
    }
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

function getResultType(task) {
    const resultType = task.type;
    if (!resultType) {
        throw new Error(`no result type was set for rule with name '${task.name}'`);
    }
    const type = resultType.trim().toLocaleLowerCase();
    if (
        type === 'scalar'
        || type === 'table') {
        return type;
    }
    throw new Error(`unknown result type '${type}' for rule with name '${task.name}'`);
}

function getResultValues(task) {
    const type = getResultType(task);
    const result = {
        values: task.result
    }
    if (type === 'scalar') {
        return result;
    } else if (type === 'table') {
        result.majorDimension = "ROWS";
        return result;
    }
    throw new Error(`unknown result type '${type}' for rule with name '${task.name}'`);
}

async function clearRange(
    task,
    sheets) {
    return new Promise((resolve, reject) => {
        const payload = {
            spreadsheetId: task.googleSheetId,
            range: task.googleSheetRange,
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

async function uploadDataForRule(
    task,
    credentials) {
    const auth = getGoogleAuth(
        task.googleCredential,
        credentials);
    const sheets = google.sheets({
        version: 'v4',
        auth: auth
    });
    console.log(`sheets: uploading for rule ${task.name}`);
    if (task.clearRange) {
        await clearRange(
            task,
            sheets);
    }
    const resource = getResultValues(task);
    return new Promise((resolve, reject) => {
        const payload = {
            spreadsheetId: task.googleSheetId,
            valueInputOption: "USER_ENTERED",
            range: task.googleSheetRange,
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

async function uploadDataToGoogleSheets(config) {
    await Promise.all(config.tasks.map(task => uploadDataForRule(
        task,
        config.settings.google)));
}

module.exports = {
    uploadDataToGoogleSheets: uploadDataToGoogleSheets
}
