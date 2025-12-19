# 📂 Base de Dados - Scripts SQL

Esta pasta contém os **scripts SQL** da base de dados PostgreSQL para o sistema de RH.

## 📝 Ficheiros SQL Disponíveis

```
database/
├── schema.sql                    # ✅ Definição das tabelas (CREATE TABLE)
├── procedures.sql                # ⚠️  Funções, views, procedures (VOCÊ precisa adicionar)
├── triggers.sql                  # ✅ Triggers básicos (cálculo salários, validações)
├── data.sql                      # ⚠️  Dados iniciais (VOCÊ precisa adicionar)
├── data_example.sql              # 📝 Exemplo de estrutura de dados
├── SCHEMA_MAPPING.md             # 📖 Mapeamento BD ↔ Frontend
├── NOTA_IMPORTANTE.md            # ⚠️  Função em falta nos triggers
├── HOWTO_ADD_DATA.md             # 📘 Como copiar data.sql
├── COMO_ADICIONAR_FICHEIROS.md   # 📘 Como adicionar todos os ficheiros
└── README.md                     # Este ficheiro
```

## 🗂️ Schema: bd054_schema

Todas as tabelas estão no schema: **`bd054_schema`**

### Tabelas Principais

**Gestão de Funcionários:**
- `funcionarios` - Dados pessoais e profissionais
- `departamentos` - Departamentos da empresa
- `remuneracoes` - Períodos de remuneração
- `salario` - Valores de salários (bruto/líquido)
- `beneficios` - Benefícios adicionais
- `ferias` - Pedidos de férias
- `faltas` - Registo de faltas
- `dependentes` - Dependentes dos funcionários
- `historico_empresas` - Histórico profissional

**Recrutamento:**
- `candidatos` - Candidatos às vagas
- `vagas` - Vagas abertas
- `candidato_a` - Relação candidato-vaga
- `requisitos_vaga` - Requisitos das vagas

**Formação e Avaliação:**
- `formacoes` - Programas de formação
- `teve_formacao` - Relação funcionário-formação
- `avaliacoes` - Avaliações de desempenho

**Sistema:**
- `utilizadores` - Credenciais de acesso
- `permissoes` - Permissões de utilizadores

## 🔌 Integração com Backend

O backend em `backend/src/controllers/employees.ts` já está **configurado** para usar o schema real:

✅ Usa `bd054_schema.funcionarios` (não `employees`)
✅ Usa `primeiro_nome` e `ultimo_nome` (não `full_name`)
✅ Mapeia estados PT → EN (`'Aprovado'` → `'Approved'`)
✅ Concatena morada de 3 campos
✅ Calcula férias do ano corrente

**Ver mapeamento completo:** `SCHEMA_MAPPING.md`

## 🚀 Como Executar os Scripts

### 1️⃣ **Criar o Schema** (se ainda não existe)

```sql
CREATE SCHEMA IF NOT EXISTS bd054_schema;
SET search_path TO bd054_schema, public;
```

### 2️⃣ **Executar schema.sql**

#### Opção A: Via pgAdmin (Recomendado)
1. Conectar ao servidor PostgreSQL da universidade
2. Abrir **Query Tool**
3. Copiar conteúdo de `schema.sql`
4. Executar (F5)

#### Opção B: Via psql (Terminal)
```bash
psql -h SEU_HOST -U SEU_USER -d SUA_DATABASE -f database/schema.sql
```

### 3️⃣ **Adicionar procedures.sql e data.sql**

⚠️ **IMPORTANTE:** Copie os ficheiros `procedures.sql` e `data.sql` do seu repositório de BD.

```bash
# Copiar do outro repositório
cp /caminho/do/outro/repo/procedures.sql database/procedures.sql
cp /caminho/do/outro/repo/data.sql database/data.sql
```

**Ou manualmente:** Ver `COMO_ADICIONAR_FICHEIROS.md` para instruções detalhadas.

### 4️⃣ **Executar procedures.sql (Funções e Views)**

⚠️ Execute ANTES de triggers.sql (os triggers dependem de funções)

```bash
# Via psql
psql -h SEU_HOST -U SEU_USER -d SUA_DATABASE -f database/procedures.sql

# Ou via pgAdmin (copiar/colar e executar)
```

**Deve incluir:** Função `calcular_total_dias_permitidos()` e outras funções auxiliares.

### 5️⃣ **Executar triggers.sql**

```bash
# Via psql
psql -h SEU_HOST -U SEU_USER -d SUA_DATABASE -f database/triggers.sql

# Ou via pgAdmin (copiar/colar e executar)
```

### 6️⃣ **Executar data.sql (Inserir Dados)**

⚠️ **ORDEM IMPORTANTE:** Execute DEPOIS de schema.sql, procedures.sql e triggers.sql

```bash
# Via psql
psql -h SEU_HOST -U SEU_USER -d SUA_DATABASE -f database/data.sql

# Ou via pgAdmin:
# 1. Abrir Query Tool
# 2. Copiar/colar conteúdo de data.sql
# 3. Executar (F5)
```

**Nota:** Se o ficheiro for muito grande, pode demorar alguns minutos.

### 6️⃣ **Verificar Criação de Tabelas e Dados**

```sql
-- 1. Ver todas as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'bd054_schema'
ORDER BY table_name;

-- Deve retornar 18 tabelas:
-- avaliacoes, beneficios, candidato_a, candidatos, departamentos,
-- dependentes, faltas, ferias, formacoes, funcionarios,
-- historico_empresas, permissoes, remuneracoes, requisitos_vaga,
-- salario, teve_formacao, utilizadores, vagas

-- 2. Verificar se dados foram inseridos
SELECT COUNT(*) as total_funcionarios FROM bd054_schema.funcionarios;
SELECT COUNT(*) as total_departamentos FROM bd054_schema.departamentos;
SELECT COUNT(*) as total_vagas FROM bd054_schema.vagas;

-- 3. Ver primeiros funcionários
SELECT id_fun, primeiro_nome, ultimo_nome, email, cargo
FROM bd054_schema.funcionarios
LIMIT 5;
```

## 🧪 Testar Conexão do Backend

### 1. Configurar `.env`

```bash
cd backend
cp .env.example .env
nano .env  # editar com suas credenciais
```

Preencher:
```env
DB_HOST=servidor.universidade.pt
DB_PORT=5432
DB_NAME=sua_base_de_dados
DB_USER=seu_username
DB_PASSWORD=sua_password
```

### 2. Iniciar Backend

```bash
npm install
npm run dev
```

### 3. Ver Resultado

Se funcionar:
```
✅ Conexão com PostgreSQL estabelecida com sucesso!
   Timestamp do servidor: 2025-12-19 10:30:45
🚀 HR Pro API Server
📡 A correr em: http://localhost:5000
📊 Base de Dados: ✅ Conectada
```

### 4. Testar Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Listar funcionários (deve retornar [] se vazio)
curl http://localhost:5000/api/employees
```

## 📋 Checklist Completo

### Preparação dos Ficheiros
- [ ] ✅ `schema.sql` está na pasta database/ (já existe)
- [ ] ✅ `triggers.sql` está na pasta database/ (já existe)
- [ ] ⚠️  **Copiar `procedures.sql` do outro repositório** (ver `COMO_ADICIONAR_FICHEIROS.md`)
- [ ] ⚠️  **Copiar `data.sql` do outro repositório** (ver `COMO_ADICIONAR_FICHEIROS.md`)
- [ ] Verificar que `procedures.sql` tem função `calcular_total_dias_permitidos()`

### Execução no PostgreSQL
- [ ] Schema `bd054_schema` criado
- [ ] Executar `schema.sql` - Criar 18 tabelas
- [ ] Executar `procedures.sql` - Criar funções e views
- [ ] Executar `triggers.sql` - Criar triggers
- [ ] Executar `data.sql` - Inserir dados
- [ ] Verificar contagem de dados (funcionarios, departamentos, etc.)

### Configuração do Backend
- [ ] Ficheiro `backend/.env` configurado com credenciais da universidade
- [ ] `npm install` no backend
- [ ] Backend conecta com sucesso à BD
- [ ] Endpoints `/health` funciona
- [ ] Endpoint `/api/employees` funciona
- [ ] Endpoints retornam dados reais (não array vazio [])

## 🐛 Problemas Comuns

### Erro: "schema 'bd054_schema' does not exist"
```sql
CREATE SCHEMA bd054_schema;
```

### Erro: "relation already exists"
```sql
-- Apagar todas as tabelas e recomeçar
DROP SCHEMA bd054_schema CASCADE;
CREATE SCHEMA bd054_schema;
-- Depois executar schema.sql novamente
```

### Erro ao executar data.sql
```
ERROR: insert or update on table "X" violates foreign key constraint
```
**Solução:** Executar scripts na ordem correta:
1. `schema.sql` (cria tabelas)
2. `triggers.sql` (cria funções)
3. `data.sql` (insere dados)

**Ou:** O data.sql tem ordem errada de inserção. Dados devem ser inseridos respeitando foreign keys:
- `departamentos` ANTES de `funcionarios` (sem gerente)
- `funcionarios` ANTES de atualizar gerentes
- `remuneracoes` ANTES de `salario`

### Backend não conecta
- ✅ Verificar credenciais em `.env`
- ✅ Testar conexão com pgAdmin
- ✅ Verificar VPN da universidade
- ✅ Ver se porta 5432 está acessível

### API retorna dados vazios []
- ✅ Verificar se `data.sql` foi executado
- ✅ Executar query: `SELECT COUNT(*) FROM bd054_schema.funcionarios;`
- ✅ Se retornar 0, executar `data.sql` novamente

## 📖 Documentação Adicional

- **SCHEMA_MAPPING.md** - Mapeamento completo BD ↔ Frontend
- **backend/README.md** - Documentação da API
- **INTEGRATION.md** - Como conectar frontend ao backend
