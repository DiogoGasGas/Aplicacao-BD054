# 🎓 Sistema de Gestão de Recursos Humanos - BD054

Sistema completo de gestão de RH desenvolvido para o projeto de Bases de Dados da FCUL, integrado com PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 📋 Descrição

Aplicação web completa para gestão de recursos humanos com funcionalidades de:
- 👥 Gestão de colaboradores (1000+ funcionários)
- 🏢 Organização por departamentos (8 departamentos)
- 💰 Gestão de remunerações e benefícios
- 🎓 Formações e desenvolvimento profissional
- ⭐ Avaliações de desempenho
- 📊 Recrutamento e seleção (50 vagas ativas)
- 🏖️ Gestão de férias e ausências
- 📈 Dashboard com visualização de dados

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Base de dados
- **pg** - Driver PostgreSQL

### Frontend
- **React** + **TypeScript** - Interface do utilizador
- **Vite** - Build tool e dev server
- **Recharts** - Gráficos e visualizações
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
Aplicacao-BD054/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuração da BD
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   └── server.ts        # Servidor principal
│   └── package.json
├── frontend/
│   ├── components/          # Componentes React
│   ├── types.ts            # Tipos TypeScript
│   ├── App.tsx             # Componente principal
│   └── package.json
├── database/
│   ├── schema.sql          # Estrutura das tabelas
│   ├── data.sql            # Dados de teste (1000+ registos)
│   ├── procedures.sql      # Stored procedures
│   └── triggers.sql        # Triggers
└── README.md
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- Acesso à VPN da universidade (para conectar à base de dados)
- Git (para clonar o repositório)

### 1. Clonar o Repositório
```bash
git clone <repository-url>
cd Aplicacao-BD054
```

### 2. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configurar Variáveis de Ambiente

Criar ficheiro `.env` na pasta `backend/`:
```env
DB_HOST=appserver.alunos.di.fc.ul.pt
DB_PORT=5432
DB_NAME=bd054
DB_USER=bd054
DB_PASSWORD=iiipa
PORT=3000
```

### 4. Executar a Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
O servidor estará disponível em http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
A aplicação estará disponível em http://localhost:5174

## 📊 Base de Dados

### Informações de Conexão
- **Host**: appserver.alunos.di.fc.ul.pt
- **Database**: bd054
- **User**: bd054
- **Password**: iiipa
- **Port**: 5432
- **Schema**: bd054_schema

⚠️ **Importante**: É necessário estar conectado à VPN da universidade!

### Estrutura
- **8 Departamentos**: Recursos Humanos, TI, Financeiro, Marketing, Vendas, Qualidade, Atendimento ao Cliente, Jurídico
- **1000+ Funcionários** com dados completos
- **50 Vagas de emprego** ativas
- **342 Candidatos** registados
- **5 Programas de formação** com 176+ participantes cada
- **400+ Avaliações** de desempenho

## 🎯 Funcionalidades

### Módulo Colaboradores
- Listagem e pesquisa de colaboradores
- Visualização detalhada de perfil
- Informações pessoais e profissionais
- Remunerações (salário bruto/líquido calculado automaticamente a 77%)
- Benefícios ativos
- Histórico salarial
- Gestão de férias (22 dias anuais)
- Formações realizadas
- Avaliações de desempenho
- Histórico profissional
- Dependentes
- Registo de faltas

### Módulo Departamentos
- Listagem de 8 departamentos
- Gerente responsável por departamento
- Estatísticas (nº colaboradores, salário médio, custo total)
- Histograma de distribuição salarial
- Lista de colaboradores por departamento

### Módulo Recrutamento
- 50 vagas de emprego abertas
- Estados: Aberta, Fechada, Suspensa
- Gestão de candidatos (342 candidatos)
- Estados de candidatura: Submetido, Em análise, Entrevista, Rejeitado, Contratado

### Módulo Formações
- 5 programas de formação
- Estados: Planeada, Em curso, Concluída, Cancelada
- 176+ colaboradores inscritos por formação
- Período de participação individual

### Módulo Avaliações
- 400+ avaliações de desempenho
- Avaliação numérica (0-5)
- Critérios de avaliação
- Autoavaliação
- Tipo: Gestor ou Autoavaliação
- Visualização de documento (simulado)

## 🔧 API Endpoints

### Colaboradores
- `GET /api/employees` - Listar todos os colaboradores
- `GET /api/employees/:id` - Obter detalhes de um colaborador

### Departamentos
- `GET /api/departments` - Listar todos os departamentos
- `GET /api/departments/:id` - Obter detalhes de um departamento
- `GET /api/departments/:id/employees` - Listar colaboradores de um departamento

### Recrutamento
- `GET /api/recruitment/jobs` - Listar vagas
- `GET /api/recruitment/candidates` - Listar candidatos

### Formações
- `GET /api/trainings` - Listar formações

### Avaliações
- `GET /api/evaluations` - Listar avaliações

## 🎨 Interface

- Design moderno e responsivo
- Navegação intuitiva por módulos
- Visualizações em gráficos (histogramas, barras)
- Dashboards informativos
- Cores consistentes e identidade visual

## 📝 Notas de Desenvolvimento

- **Cálculo salarial**: Salário líquido = 77% do salário bruto
- **Férias**: 22 dias por ano (padrão)
- **Estados traduzidos**: Português (BD) → Interface
- **IDs**: Convertidos para string no frontend
- **Documentos**: Campo BYTEA simulado (sempre disponível)

## 👨‍💻 Autor

Desenvolvido para o projeto de Bases de Dados - FCUL 2024/2025

## 📄 Licença

Projeto académico - FCUL

```
Frontend (React)  →  Backend (Express)  →  PostgreSQL
  localhost:5173      localhost:5000      appserver.alunos...
```

---

## 📝 Notas Importantes

⚠️ **Nunca faça commit do ficheiro `.env`** - Contém credenciais sensíveis!

✅ **Já está tudo configurado:**
- Credenciais da BD no `backend/.env`
- Dependências instaladas
- Scripts de setup prontos

---

## 🆘 Precisa de Ajuda?

**→ Leia o [COMO_USAR.md](./COMO_USAR.md) para:**
- Guia completo passo a passo
- Resolução de problemas
- Explicações detalhadas para iniciantes

---

**🎉 Boa sorte com o seu projeto de Bases de Dados!** 🚀
