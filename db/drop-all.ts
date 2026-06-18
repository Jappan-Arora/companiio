import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection('mysql://2M4WC4hTxHM8pY1.root:B0Ltt5DalxqldLPNNAXBIu0XTI06y67E@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19ed8569-3442-8e3c-8000-09e361d0c9b0');
  const [tables] = await conn.execute('SHOW TABLES') as any[];
  console.log('Tables found:', tables.map((t: any) => Object.values(t)[0]));
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    const tableName = Object.values(t)[0];
    await conn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
    console.log('Dropped:', tableName);
  }
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
  await conn.end();
  console.log('All tables dropped.');
}

main().catch(console.error);
