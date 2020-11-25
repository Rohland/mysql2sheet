const rules = [
    {
        name: "Codeo Billing Time",
        connection: "local",
        schema: "busd",
        sql: `
            select id from topics limit 1
        `,
        mapData: (x) => [x.id],
        type: 'scalar',
        clearRange: null,
        googleCredential: "codeostats",
        googleSheetId: "1O58NA9rqCNBnYeM4l7VyrLoZZmsjwFUzG_tjiwtaNqM",
        googleSheetRange: "TimeTracking!B2:B2",
    },
    {
        name: "Codeo Projects",
        connection: "local",
        schema: "reportio",
        sql: `select distinct name, version from windows limit 5`,
        mapData: (x) => [x.name, x.version],
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
