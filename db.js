async function connect() {
    if (global.connection)
        return global.connection.connect();
 
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
 
    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");
 
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();
 
    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}
 
connect();


async function selectMessages(id) {
    const client = await connect();
    //const res = await client.query('SELECT * FROM clientes WHERE ID=$1', [id]);
    const res = await client.query('SELECT id_conversa, mensagem, data_hr_mensagem, nome_usuario FROM descritivo d INNER JOIN usuarios u ON d.id_usuario = u.id_usuario ORDER BY data_hr_mensagem');
    return res.rows;
}

async function insertMessages(msg) {
    const client = await connect();
    //const res = await client.query('SELECT * FROM clientes WHERE ID=$1', [id]);
    const res = await client.query('insert into descritivo (mensagem, id_usuario, id_conversa) values ($1, $2, $3)',[msg]);
    return res.rows;
}
 
module.exports = { selectMessages, insertMessages }