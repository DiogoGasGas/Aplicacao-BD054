import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Importar rotas
import employeesRouter from './routes/employees';
import departmentsRouter from './routes/departments';
import recruitmentRouter from './routes/recruitment';
import trainingsRouter from './routes/trainings';
import evaluationsRouter from './routes/evaluations';

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===

// Segurança com Helmet
app.use(helmet());

// CORS - permitir requests do frontend (configuração permissiva para desenvolvimento)
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting - proteger contra ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: 'Demasiados pedidos deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simples
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// === ROTAS ===

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'HR Pro API'
  });
});

// API Routes
app.use('/api/employees', employeesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/recruitment', recruitmentRouter);
app.use('/api/trainings', trainingsRouter);
app.use('/api/evaluations', evaluationsRouter);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Error handler global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// === INICIAR SERVIDOR ===

async function startServer() {
  try {
    // Testar conexão com base de dados
    console.log('🔌 A testar conexão com PostgreSQL...');
    const connected = await testConnection();

    if (!connected) {
      console.error('⚠️  Servidor a iniciar sem conexão à BD!');
      console.error('   Verifique as configurações em .env');
    }

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('🚀 HR Pro API Server');
      console.log('═══════════════════════════════════════');
      console.log(`📡 A correr em: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de Dados: ${connected ? '✅ Conectada' : '❌ Desconectada'}`);
      console.log('═══════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar
startServer();

export default app;
