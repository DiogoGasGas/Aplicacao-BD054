// Script para testar a conexão com a base de dados PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: '-c search_path=bd054_schema,public',
});

async function testConnection() {
  console.log('='.repeat(60));
  console.log('TESTE DE CONEXÃO COM POSTGRESQL');
  console.log('='.repeat(60));
  console.log('\nConfigurações:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Schema: bd054_schema`);
  console.log('\n' + '-'.repeat(60));

  try {
    // Testar conexão básica
    console.log('\n1. Testando conexão básica...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('   ✅ Conexão estabelecida com sucesso!');
    console.log(`   Timestamp do servidor: ${result.rows[0].now}`);

    // Testar schema
    console.log('\n2. Testando acesso ao schema...');
    const schemaResult = await client.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'bd054_schema'
    `);
    console.log(`   ✅ Schema encontrado com ${schemaResult.rows[0].table_count} tabelas`);

    // Listar tabelas
    console.log('\n3. Listando tabelas no schema bd054_schema:');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'bd054_schema'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('   ⚠️  Nenhuma tabela encontrada no schema bd054_schema');
    }

    // Testar query numa tabela específica
    console.log('\n4. Testando query na tabela funcionarios...');
    try {
      const empResult = await client.query(`
        SELECT COUNT(*) as total FROM funcionarios
      `);
      console.log(`   ✅ Total de funcionários: ${empResult.rows[0].total}`);
    } catch (err) {
      console.log(`   ⚠️  Erro ao consultar funcionarios: ${err.message}`);
    }

    client.release();

    console.log('\n' + '='.repeat(60));
    console.log('TESTE CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO ao conectar com PostgreSQL:');
    console.error('   ', error.message);
    console.error('\nDetalhes do erro:');
    console.error(error);

    console.log('\n' + '='.repeat(60));
    console.log('TESTE FALHOU');
    console.log('='.repeat(60));

    process.exit(1);
  }
}

testConnection();
