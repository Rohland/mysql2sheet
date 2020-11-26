const Knex = require('knex');
const connections = {};

function getConnection(
    settings,
    name) {
    if (!settings.mysql) {
        throw new Error(`expected mysql to be defined on settings object but wasn't`);
    }
    const config = settings.mysql[name];
    if (config.host
        && config.user
        && config.password
        && config.port) {
        return config;
    }
    throw new Error(`One or more mysql settings are missing for connection named '${name}'`);
}

function getKnexConnection(
    name,
    settings){
    const cachedConnection = connections[name];
    if (cachedConnection) {
        return cachedConnection;
    }
    const config = getConnection(
        settings,
        name);
    const knex = Knex({
        client: "mysql",
        asyncStackTraces: process.env.NODE_ENV !== "production",
        connection: {
            ...config,
            multipleStatements: true
        }
    });
    connections[name] = knex;
    return knex;
}

async function executeTask(
    task,
    settings) {
    const conn = getKnexConnection(
        task.connection,
        settings);
    const schema = task.schema;
    const sql = `use ${schema}; ${task.sql}`;
    const data = await conn.raw(sql);
    const resultSets = data[0];
    const lastResultSet = resultSets.length - 1;
    const rows = data[0][lastResultSet];
    task.result = await Promise.all(rows.map(x => task.mapData(x)));
}

async function executeTasks(config) {
    try {
        await Promise.all(config.tasks.map(task => executeTask(
            task,
            config.settings)));
    }
    finally { 
        for(let key in connections) {
            await connections[key].destroy();
        }
    }
}

module.exports = {
    executeTasks: executeTasks
}
