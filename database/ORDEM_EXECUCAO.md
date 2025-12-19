# ⚡ Ordem de Execução - Guia Rápido

## 📦 Pré-requisitos

Certifique-se que tem TODOS os ficheiros:
- ✅ `schema.sql` (já existe)
- ✅ `triggers.sql` (já existe)
- ⚠️ `procedures.sql` (copiar do outro repo)
- ⚠️ `data.sql` (copiar do outro repo)

**Se ainda não copiou:** Ver `COMO_ADICIONAR_FICHEIROS.md`

---

## 🚀 Ordem CORRETA de Execução

Execute os scripts **EXATAMENTE nesta ordem:**

### 1️⃣ Schema (Tabelas)
```bash
psql -h HOST -U USER -d DATABASE -f database/schema.sql
```
**Cria:** 18 tabelas no schema `bd054_schema`

### 2️⃣ Procedures (Funções)
```bash
psql -h HOST -U USER -d DATABASE -f database/procedures.sql
```
**Cria:** Funções, views, stored procedures
**IMPORTANTE:** Deve incluir `calcular_total_dias_permitidos()`

### 3️⃣ Triggers (Automatismos)
```bash
psql -h HOST -U USER -d DATABASE -f database/triggers.sql
```
**Cria:** Triggers que dependem das funções do passo 2

### 4️⃣ Data (Dados)
```bash
psql -h HOST -U USER -d DATABASE -f database/data.sql
```
**Insere:** Milhares de linhas de dados nas tabelas

---

## 🎯 Comando Único (Linux/Mac)

Se quiser executar tudo de uma vez:

```bash
psql -h HOST -U USER -d DATABASE << EOF
\i database/schema.sql
\i database/procedures.sql
\i database/triggers.sql
\i database/data.sql
EOF
```

---

## 🖥️ Via pgAdmin (Passo a Passo)

1. **Conectar** ao servidor PostgreSQL da universidade
2. **Abrir** Query Tool (ícone ⚡ ou Tools → Query Tool)
3. **Executar cada ficheiro pela ordem:**

   a) Copiar conteúdo de `schema.sql` → Executar (F5)

   b) Copiar conteúdo de `procedures.sql` → Executar (F5)

   c) Copiar conteúdo de `triggers.sql` → Executar (F5)

   d) Copiar conteúdo de `data.sql` → Executar (F5)

---

## ✅ Verificação

Depois de executar tudo:

```sql
-- 1. Ver tabelas criadas (deve retornar 18)
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'bd054_schema';

-- 2. Ver funções criadas
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'bd054_schema';

-- 3. Ver dados inseridos
SELECT COUNT(*) FROM bd054_schema.funcionarios;
SELECT COUNT(*) FROM bd054_schema.departamentos;

-- 4. Ver primeiros funcionários
SELECT id_fun, primeiro_nome, ultimo_nome, email
FROM bd054_schema.funcionarios
LIMIT 5;
```

---

## ❌ Erros Comuns

### "schema does not exist"
```sql
CREATE SCHEMA IF NOT EXISTS bd054_schema;
SET search_path TO bd054_schema, public;
```

### "function does not exist"
- Executou procedures.sql **ANTES** de triggers.sql?
- O procedures.sql tem a função `calcular_total_dias_permitidos()`?

### "relation does not exist"
- Executou schema.sql primeiro?
- Está no schema correto? `SET search_path TO bd054_schema;`

### "foreign key constraint"
- Executou data.sql por último?
- O data.sql insere dados na ordem correta? (departamentos → funcionarios → salarios)

---

## 🔄 Recomeçar do Zero

Se algo correr mal e quiser recomeçar:

```sql
-- ⚠️ CUIDADO: Apaga TUDO!
DROP SCHEMA bd054_schema CASCADE;

-- Depois execute os 4 ficheiros pela ordem novamente
```

---

## 📖 Mais Informação

- **Detalhes completos:** `README.md`
- **Como copiar ficheiros:** `COMO_ADICIONAR_FICHEIROS.md`
- **Mapeamento BD ↔ Frontend:** `SCHEMA_MAPPING.md`
- **Função em falta:** `NOTA_IMPORTANTE.md`

---

## 🎯 Resumo Visual

```
schema.sql      → Tabelas
     ↓
procedures.sql  → Funções
     ↓
triggers.sql    → Automatismos
     ↓
data.sql        → Dados
     ↓
✅ Pronto!
```

---

**Próximo passo:** Configurar backend (ver README.md principal)
