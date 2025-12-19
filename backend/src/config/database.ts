import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da pool de conexões PostgreSQL
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Configurações de pool para melhor performance
  max: 20, // número máximo de conexões
  idleTimeoutMillis: 30000, // tempo que uma conexão pode ficar idle
  connectionTimeoutMillis: 2000, // tempo máximo para obter uma conexão

  // Definir o search_path para usar o schema bd054_schema
  options: '-c search_path=bd054_schema,public',
};

// Criar pool de conexões
export const pool = new Pool(poolConfig);

// Evento de erro
pool.on('error', (err) => {
  console.error('Erro inesperado no cliente PostgreSQL:', err);
  process.exit(-1);
});

// Testar conexão
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    console.log('   Timestamp do servidor:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:');
    console.error('   ', error instanceof Error ? error.message : error);
    return false;
  }
}

// Helper para executar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Erro na query:', { text, error });
    throw error;
  }
}

export default pool;
