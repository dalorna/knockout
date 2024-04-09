const sql = require('mssql');

const config = {
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    server: "localhost",
    database: "Knockout",
    options: {
        trustServerCertificate: true
    }
};

const connectDb = async () => {
    try {
        await sql.connect(config);
        console.log('db connected')
    } catch (err) {
        console.error(err)
    }
}
module.exports = connectDb;