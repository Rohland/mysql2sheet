const mysql = require('mysql');
const Knex = require('knex');
const connections = {};

function getConnection(name) {
    const key = x => `mysql_${name}_${x}`;
    const config =  {
        host: process.env[key("host")],
        user: process.env[key("user")],
        password: process.env[key("password")],
        port: process.env[key("port")],
        multipleStatements: true
    };
    if (config.host 
        && config.user
        && config.password
        && config.port) {
        return config;
    }
    throw new Error(`One or more configuration keys are missing for connection referenced '${name}'`);
}

function getKnexConnection(name){
    const cachedConnection = connections[name];
    if (cachedConnection) {
        return cachedConnection;
    }
    const config = getConnection(name);
    const knex = Knex({
        client: "mysql",
        asyncStackTraces: process.env.NODE_ENV !== "production",
        connection: {
            ...config,
        }
    });
    connections[name] = knex;
    return knex;
}

async function executeRuleQuery(rule) {
    const conn = getKnexConnection(rule.connection);
    const schema = rule.schema;
    const sql = rule.sql;
    const data = await conn.raw(`use ${schema}; ${sql}`);
    const rows = data[0][1];
    rule.result = rows.map(x => rule.mapData(x));
}

async function executeQueries(rules) {
    try {
        await Promise.all(rules.map(x => executeRuleQuery(x)));
    }
    finally { 
        for(let key in connections) {
            await connections[key].destroy();
        }
    }
}

module.exports = {
    executeQueryForRule: executeRuleQuery,
    executeQueries: executeQueries
}
