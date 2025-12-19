# 🗂️ Como Adicionar os Ficheiros SQL ao Repositório

## 📍 Ficheiros Necessários

Você mencionou que tem 3 ficheiros do outro repositório:

1. ✅ **schema.sql** - Tabelas, chaves (JÁ ADICIONADO)
2. ⚠️ **data.sql** - Inserção de dados (PRECISA ADICIONAR)
3. ⚠️ **procedures.sql** - Funções, views, procedures (PRECISA ADICIONAR)

**Nota:** Já existe `triggers.sql` (criado automaticamente)

---

## 🚀 Passo a Passo para Adicionar

### Método 1: Copiar via Terminal (Mais Rápido)

```bash
# Navegue até o diretório do projeto
cd /caminho/para/Aplicacao-BD054/database/

# Copie os ficheiros do outro repositório
cp /caminho/do/outro/repositorio/data.sql ./data.sql
cp /caminho/do/outro/repositorio/procedures.sql ./procedures.sql

# Verificar que foram copiados
ls -lh data.sql procedures.sql
```

### Método 2: Copiar Manualmente

**Para data.sql:**
1. Abrir o ficheiro `data.sql` no outro repositório
2. Selecionar tudo (Ctrl+A)
3. Copiar (Ctrl+C)
4. Criar ficheiro `database/data.sql` neste repositório
5. Colar (Ctrl+V) e Guardar (Ctrl+S)

**Para procedures.sql:**
1. Abrir o ficheiro `procedures.sql` no outro repositório
2. Selecionar tudo (Ctrl+A)
3. Copiar (Ctrl+C)
4. Criar ficheiro `database/procedures.sql` neste repositório
5. Colar (Ctrl+V) e Guardar (Ctrl+S)

---

## 📋 Estrutura Final Esperada

```
database/
├── schema.sql           ✅ Tabelas (já existe)
├── triggers.sql         ✅ Triggers base (já existe)
├── procedures.sql       ⚠️  Funções, views (ADICIONAR)
├── data.sql             ⚠️  Dados (ADICIONAR)
├── data_example.sql     📝 Exemplo
├── SCHEMA_MAPPING.md
├── NOTA_IMPORTANTE.md
├── HOWTO_ADD_DATA.md
└── README.md
```

---

## ⚡ Ordem CORRETA de Execução

Depois de adicionar todos os ficheiros, execute nesta ordem:

```bash
# 1. Criar schema e tabelas
psql -h HOST -U USER -d DB -f database/schema.sql

# 2. Criar funções e procedures
psql -h HOST -U USER -d DB -f database/procedures.sql

# 3. Criar triggers (depende de funções)
psql -h HOST -U USER -d DB -f database/triggers.sql

# 4. Inserir dados
psql -h HOST -U USER -d DB -f database/data.sql
```

**Ou via pgAdmin:**
1. Conectar ao servidor
2. Abrir Query Tool
3. Executar cada ficheiro pela ordem acima

---

## ✅ Verificação

Depois de copiar os ficheiros:

```bash
# Verificar que existem
ls -lh database/*.sql

# Deve mostrar:
# schema.sql
# triggers.sql
# procedures.sql  ← NOVO
# data.sql        ← NOVO
# data_example.sql
```

---

## 🔄 Adicionar ao Git

Depois de copiar os ficheiros:

```bash
# Ver ficheiros novos
git status

# Adicionar ao git
git add database/data.sql
git add database/procedures.sql

# Commit
git commit -m "feat: Add data.sql and procedures.sql from BD repository"

# Push
git push
```

---

## 📝 Conteúdo Esperado

### procedures.sql deve conter:
- `CREATE FUNCTION calcular_total_dias_permitidos()` ⭐ (IMPORTANTE!)
- Outras funções auxiliares
- Views (se existirem)
- Stored procedures

### data.sql deve conter:
- `INSERT INTO bd054_schema.departamentos ...`
- `INSERT INTO bd054_schema.funcionarios ...`
- `INSERT INTO bd054_schema.salario ...`
- etc.

---

## ⚠️ IMPORTANTE

O `procedures.sql` deve incluir a função `calcular_total_dias_permitidos()` que está em falta!

Se não tiver, adicione isto ao ficheiro:

```sql
CREATE OR REPLACE FUNCTION calcular_total_dias_permitidos(p_id_fun INT)
RETURNS INT AS $$
BEGIN
    RETURN 22;  -- 22 dias de férias (padrão PT)
END;
$$ LANGUAGE plpgsql;
```

---

Precisa de ajuda para copiar os ficheiros?
