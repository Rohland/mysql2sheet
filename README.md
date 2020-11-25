## Mysql2Sheet

This node script allows one to configure one or more MySql queries which are mapped to specific ranges within one or 
more Google Sheets.

### Usage

```bash
$ npm start -- --path=./path_to_queries.js
```

### Path

In the example above, the path refers to a path to a file containing the rules to execute.


#### Example Ruleset

```javascript
const rules = [
    {
        name: "Total Hours",
        connection: "prodtime",
        schema: "time",
        sql: `
            select sum(time) as hours from timeentries
        `,
        mapData: (x) => [x.hours],
        type: 'scalar',
        clearRange: null,
        googleCredential: "codeostats",
        googleSheetId: "1O58NA9rqCNBnYeM4l7VyrLoZZmsjwFUzG_tjiwtaNqM",
        googleSheetRange: "TimeTracking!B2:B2",
    },
    {
        name: "Codeo Project Times",
        connection: "prodtime",
        schema: "time",
        sql: `select distinct name, sum(time) as hours from timeentries`,
        mapData: (x) => [x.name, x.hours],
        type: 'table',
        clearRange: true,
        googleCredential: "codeostats",
        googleSheetId: "1O58NA9rqCNBnYeM4l7VyrLoZZmsjwFUzG_tjiwtaNqM",
        googleSheetRange: "TimeTracking!E2:F",
    }
];

module.exports = {
    rules: rules
};

```

#### Connections and Settings

Note how in the above example, specific fields refer to configuration settings. See below for the list of fields associated to this:

* `connection` - this is the MySQL connection name
* `googleCredential` - this is the Google Sheet credential name

These values are picked from the environment variables. You can use a `.env` for this. 

##### Example configuration

```
google_credential_codeostats={"type":"service_account", .... }
mysql_prodtime_host=localhost
mysql_prodtime_user=root
mysql_prodtime_password=root
mysql_prodtime_port=3306

```

Note how the keys in the example ruleset are referenced in the setting keys above in a convention over 
configuration approach.
