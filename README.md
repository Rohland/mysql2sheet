## MySql2Sheet

Does what it says on the tin. Takes data in your MySql database and uploads it to a Google Sheet. 

Multiple MySql servers? No problem. Multiple sheets? No problem.

### Usage

#### npx

```shell script
npx mysql2sheet --path=./your_config.js
```

#### Local

```shell script
npm install mysql2sheet
mysql2sheet --path=./your_config.js 
```

### Path

In the example above, the path parameter refers to a path to a file containing the tasks to execute.


#### Task Definition

Your task definition file defines one or more tasks to execute. Each task has the following fields:

* name - the name of the task
* connection - the name of the mysql connection to use
* schema - the schema to execute your query against
* sql - the sql query to execute and retrieve results
* mapData - function to map sql results to what needs to be uploaded to your sheet, note that the last result in your
 sql query is mapped here - go wild :)
* type - result type, either scalar (single value) or table 
* googleCredential - the name of the Google Credential to use
* googleSheetId - the sheet identifier to use (you can get this from the Sheet URL) 
* googleSheetRange - where to map the MySql query results to, example `YOUR_SHEET_NAME!A1:A2`
* clearRange - boolean (defaults to false) - if true, clears the `googleSheetRange` before uplaoding data

##### Example Task Definition

```javascript
const tasks = [
    {
        name: "Total Hours",
        connection: "prodtime",
        schema: "projects",
        sql: `select sum(time) as hours from timeentries`,
        mapData: (x) => [x.hours],
        type: 'scalar',
        googleCredential: "gcred",
        googleSheetId: "grab-sheet-id-from-sheet-url",
        googleSheetRange: "Stats!B2:B2",
    },
    {
        name: "Project Times",
        connection: "prodtime",
        schema: "projects",
        sql: `select name, sum(time) as hours from timeentries group by name`,
        mapData: (x) => [x.name, x.hours],
        type: 'table',
        clearRange: true,
        googleCredential: "gcred",
        googleSheetId: "grab-sheet-id-from-sheet-url",
        googleSheetRange: "Stats!E2:F",
    }
];

module.exports = {
    tasks: tasks
    settings: {
        mysql: {
            prodtime: {
                host: "localhost",
                user: "root",
                port: "3306",
                // for secrets, rely on environment variables (see Settings)
            }
        },
        google: {
            gcred: {
                "type": "service_account",
                // ...
                // for secrets, rely on environment variables for each key, or rather set an env var with the credential 
                // json, see Settings below
            }
        }
    }
};

```


## Settings

The configuration settings for MySql + Google Sheets API are pulled from the environment, using conventions. Environment
variables are also loaded from any local `.env` file relative to location application is launched from.

With a named MySql connection, it will look for:

- host: `{name}_mysql_host`
- user: `{name}_mysql_user`
- password: `{name}_mysql_password`
- port: `{name}_mysql_port`

With a named Google Sheet credential, it will expect an environment variable called `{name}_google` which contains the credential JSON. Alternatively, set individual keys using `{name}_google_{property}`. 

To set up your Google Credentials, see https://www.npmjs.com/package/googleapis#service-account-credentials
Note: Make sure you share the sheet (with Editor rights) with the email address noted in the `client_email` param of the service account JSON.

