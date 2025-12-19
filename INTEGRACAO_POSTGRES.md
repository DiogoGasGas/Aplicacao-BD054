# Integração com PostgreSQL - HR Pro System

## ✅ Configuração Concluída

A integração com a base de dados PostgreSQL foi concluída com sucesso. Todos os controllers foram ajustados para usar o schema `bd054_schema` com nomes de tabelas em português.

---

## 📋 Configurações Aplicadas

### 1. Arquivo `.env` Criado

O arquivo `/backend/.env` foi configurado com suas credenciais:

```env
DB_HOST=appserver.alunos.di.fc.ul.pt
DB_PORT=5432
DB_NAME=bd054
DB_USER=bd054
DB_PASSWORD=iiipa
```

⚠️ **IMPORTANTE**: Por segurança, nunca faça commit do arquivo `.env` no Git. Ele já está no `.gitignore`.

### 2. Configuração do Database

O arquivo `/backend/src/config/database.ts` foi atualizado para:
- Usar as variáveis de ambiente do `.env`
- Configurar o `search_path` para usar o schema `bd054_schema`
- Incluir pool de conexões com 20 conexões máximas

### 3. Controllers Atualizados

Todos os controllers foram adaptados para usar os nomes de tabelas em português do schema SQL:

#### Mapeamento de Tabelas

| Controller | Tabelas PostgreSQL Usadas |
|-----------|---------------------------|
| **employees.ts** | `funcionarios`, `departamentos`, `salario`, `remuneracoes`, `beneficios`, `ferias`, `teve_formacao`, `formacoes`, `avaliacoes`, `historico_empresas`, `dependentes`, `faltas` |
| **departments.ts** | `departamentos`, `funcionarios` |
| **recruitment.ts** | `vagas`, `candidatos`, `candidato_a`, `requisitos_vaga`, `departamentos` |
| **trainings.ts** | `formacoes`, `teve_formacao` |
| **evaluations.ts** | `avaliacoes`, `funcionarios` |

#### Mapeamento de Campos

Os campos do schema SQL em português são mapeados para os campos esperados pelo frontend:

| Campo SQL (PT) | Campo API (EN) |
|---------------|---------------|
| `id_fun` | `id` |
| `primeiro_nome + ultimo_nome` | `fullName` |
| `num_telemovel` | `phone` |
| `nome_rua + nome_localidade + codigo_postal` | `address` |
| `data_nascimento` | `birthDate` |
| `cargo` | `role` |
| `id_depart` | `department` (com join para nome) |

---

## 🚀 Como Testar a Integração

### 1. Testar a Conexão

Execute o script de teste de conexão:

```bash
cd backend
node test-connection.js
```

Este script irá:
- Testar a conexão com o PostgreSQL
- Listar todas as tabelas do schema `bd054_schema`
- Mostrar o número de funcionários na base de dados

### 2. Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor irá iniciar na porta 5000. Você verá mensagens de log indicando:
- ✅ Conexão com PostgreSQL estabelecida
- 🚀 Servidor rodando em http://localhost:5000

### 3. Testar os Endpoints da API

#### Listar Funcionários
```bash
curl http://localhost:5000/api/employees
```

#### Listar Departamentos
```bash
curl http://localhost:5000/api/departments
```

#### Listar Vagas
```bash
curl http://localhost:5000/api/recruitment/jobs
```

#### Listar Formações
```bash
curl http://localhost:5000/api/trainings
```

#### Listar Avaliações
```bash
curl http://localhost:5000/api/evaluations
```

---

## 🔧 Próximos Passos

### 1. Verificar a Base de Dados

Antes de testar a aplicação, certifique-se de que:

1. **O schema `bd054_schema` existe** na sua base de dados
2. **As tabelas foram criadas** usando o script `database/schema.sql`
3. **Dados de teste foram inseridos** (opcional, use `database/data.sql`)

Para criar o schema e tabelas, conecte-se ao PostgreSQL:

```bash
psql -h appserver.alunos.di.fc.ul.pt -U bd054 -d bd054
```

E execute:

```sql
-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS bd054_schema;

-- Executar o script schema.sql
\i database/schema.sql

-- Opcional: inserir dados de teste
\i database/data.sql
```

### 2. Iniciar o Frontend

Para conectar o frontend ao backend:

```bash
cd frontend
npm install
npm run dev
```

O frontend irá rodar em `http://localhost:3000` e conectar-se automaticamente ao backend em `http://localhost:5000`.

### 3. Testar a Aplicação Completa

1. Acesse `http://localhost:3000`
2. Navegue pelas diferentes seções:
   - Funcionários
   - Departamentos
   - Recrutamento
   - Formações
   - Avaliações
3. Teste as operações CRUD (Create, Read, Update, Delete)

---

## 📊 Estrutura dos Endpoints da API

### Employees (Funcionários)
- `GET /api/employees` - Listar todos os funcionários
- `GET /api/employees/:id` - Obter detalhes de um funcionário
- `POST /api/employees` - Criar novo funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Remover funcionário

### Departments (Departamentos)
- `GET /api/departments` - Listar todos os departamentos
- `GET /api/departments/:id` - Obter detalhes de um departamento
- `GET /api/departments/:id/employees` - Listar funcionários de um departamento

### Recruitment (Recrutamento)
- `GET /api/recruitment/jobs` - Listar todas as vagas
- `GET /api/recruitment/jobs/:id` - Obter detalhes de uma vaga
- `GET /api/recruitment/candidates` - Listar todos os candidatos
- `GET /api/recruitment/jobs/:jobId/candidates` - Listar candidatos de uma vaga
- `PUT /api/recruitment/candidates/:id/status` - Atualizar status de candidato

### Trainings (Formações)
- `GET /api/trainings` - Listar todos os programas de formação
- `GET /api/trainings/:id` - Obter detalhes de uma formação
- `POST /api/trainings/:id/enroll` - Inscrever funcionário em formação

### Evaluations (Avaliações)
- `GET /api/evaluations` - Listar todas as avaliações
- `GET /api/evaluations/employee/:employeeId` - Listar avaliações de um funcionário
- `POST /api/evaluations` - Criar nova avaliação

---

## 🐛 Resolução de Problemas

### Erro: "could not translate host name"

Se você vir este erro ao testar a conexão, significa que o servidor PostgreSQL não está acessível. Verifique:

1. Está conectado à VPN da universidade (se necessário)?
2. O servidor `appserver.alunos.di.fc.ul.pt` está online?
3. As credenciais no `.env` estão corretas?

### Erro: "relation does not exist"

Se você vir este erro, significa que as tabelas não existem no schema. Execute o script `database/schema.sql`:

```bash
psql -h appserver.alunos.di.fc.ul.pt -U bd054 -d bd054 -f database/schema.sql
```

### Erro: "password authentication failed"

Verifique se a password no arquivo `.env` está correta (`iiipa`).

---

## 📁 Arquivos Modificados

### Arquivos Criados:
- ✅ `/backend/.env` - Variáveis de ambiente
- ✅ `/backend/test-connection.js` - Script de teste de conexão
- ✅ `/INTEGRACAO_POSTGRES.md` - Esta documentação

### Arquivos Modificados:
- ✅ `/backend/src/config/database.ts` - Adicionado search_path
- ✅ `/backend/src/controllers/employees.ts` - Atualizado para schema PT
- ✅ `/backend/src/controllers/departments.ts` - Atualizado para schema PT
- ✅ `/backend/src/controllers/recruitment.ts` - Atualizado para schema PT
- ✅ `/backend/src/controllers/trainings.ts` - Atualizado para schema PT
- ✅ `/backend/src/controllers/evaluations.ts` - Atualizado para schema PT

---

## 💡 Dicas

1. **Durante o desenvolvimento**: Use `npm run dev` para reiniciar automaticamente o servidor quando fizer alterações
2. **Para debug**: Verifique os logs no console do backend para ver as queries SQL executadas
3. **Segurança**: Nunca commite o arquivo `.env` no Git
4. **Performance**: A configuração atual usa um pool de 20 conexões, suficiente para desenvolvimento

---

## ✉️ Suporte

Se encontrar algum problema, verifique:
1. Os logs do backend (`npm run dev`)
2. O script de teste de conexão (`node test-connection.js`)
3. As queries SQL nos controllers

Boa sorte com o seu projeto HR Pro! 🚀
