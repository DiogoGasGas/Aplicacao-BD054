# 📥 Como Adicionar o Ficheiro data.sql

Este guia mostra como copiar o seu ficheiro `data.sql` do outro repositório para este projeto.

## 🎯 Objetivo

Você tem um ficheiro `data.sql` **noutro repositório** com milhares de linhas de dados INSERT. Precisa de o adicionar a este repositório para popular a base de dados.

---

## 📍 Opção 1: Copiar via Terminal/Linha de Comandos

### Windows (PowerShell ou CMD)

```powershell
# Navegue para o diretório do projeto
cd C:\Users\SeuNome\Aplicacao-BD054

# Copie o data.sql do outro repositório
copy "C:\Caminho\Do\Outro\Repositorio\data.sql" "database\data.sql"

# Verificar que foi copiado
dir database\data.sql
```

### macOS / Linux

```bash
# Navegue para o diretório do projeto
cd ~/Aplicacao-BD054

# Copie o data.sql do outro repositório
cp /caminho/do/outro/repositorio/data.sql database/data.sql

# Verificar que foi copiado
ls -lh database/data.sql
```

---

## 📍 Opção 2: Copiar Manualmente (Qualquer Sistema Operacional)

### Passo a Passo:

1. **Abrir o ficheiro original**
   - Navegue até ao seu **repositório de BD**
   - Localize o ficheiro `data.sql`
   - Abra com um editor de texto (VS Code, Notepad++, Sublime, etc.)

2. **Selecionar tudo**
   - `Ctrl+A` (Windows/Linux) ou `Cmd+A` (Mac)

3. **Copiar**
   - `Ctrl+C` (Windows/Linux) ou `Cmd+C` (Mac)

4. **Criar novo ficheiro neste repositório**
   - Navegue até `Aplicacao-BD054/database/`
   - Crie um novo ficheiro chamado `data.sql`

5. **Colar o conteúdo**
   - Abra `data.sql` no editor
   - `Ctrl+V` (Windows/Linux) ou `Cmd+V` (Mac)
   - Guardar: `Ctrl+S` ou `Cmd+S`

---

## 📍 Opção 3: Usar o Git (Se ambos repositórios estiverem no Git)

```bash
# No repositório Aplicacao-BD054
cd database/

# Copiar ficheiro do outro repositório git (ajuste o caminho)
git show <outro-repo-remote>/main:data.sql > data.sql

# Ou se o outro repo está localmente clonado:
cp ../../outro-repositorio/data.sql ./data.sql
```

---

## ✅ Verificar se Foi Copiado Corretamente

### 1. Verificar que o ficheiro existe

```bash
# Windows (CMD)
dir database\data.sql

# macOS/Linux ou Windows (PowerShell)
ls database/data.sql
```

### 2. Verificar tamanho do ficheiro

O ficheiro deve ter **vários KB ou MB** (dependendo da quantidade de dados).

```bash
# Ver tamanho
ls -lh database/data.sql

# Ou contar linhas (Linux/Mac)
wc -l database/data.sql
```

### 3. Verificar primeiras linhas

```bash
# Linux/Mac
head -20 database/data.sql

# Windows (PowerShell)
Get-Content database/data.sql -Head 20
```

Deve começar com algo como:
```sql
set search_path TO bd054_schema, public;

INSERT INTO departamentos ...
INSERT INTO funcionarios ...
```

---

## 🚀 Próximos Passos (Depois de Copiar)

### 1. Executar os Scripts SQL no PostgreSQL

**Ordem correta:**
```bash
# 1. Criar schema e tabelas
psql -h HOST -U USER -d DATABASE -f database/schema.sql

# 2. Criar triggers e funções
psql -h HOST -U USER -d DATABASE -f database/triggers.sql

# 3. Inserir dados (o seu data.sql!)
psql -h HOST -U USER -d DATABASE -f database/data.sql
```

### 2. Verificar Dados

```sql
-- Conectar ao PostgreSQL e executar:
SELECT COUNT(*) FROM bd054_schema.funcionarios;
SELECT COUNT(*) FROM bd054_schema.departamentos;

-- Ver alguns dados
SELECT * FROM bd054_schema.funcionarios LIMIT 5;
```

### 3. Testar Backend

```bash
cd backend
npm run dev

# Noutro terminal:
curl http://localhost:5000/api/employees
```

Deve retornar **dados reais** (não array vazio)!

---

## ⚠️ Problemas Comuns

### ❌ "Ficheiro não encontrado"
- Verificar caminho do ficheiro original
- Verificar que está no diretório correto

### ❌ "Permission denied"
- No Linux/Mac: `chmod +r data.sql`
- No Windows: verificar permissões da pasta

### ❌ "Ficheiro muito grande"
- É normal! Pode ter vários MB
- Ao executar no PostgreSQL pode demorar alguns minutos

### ❌ Erros de Foreign Key ao executar data.sql
- Ver `database/README.md` → "Erro ao executar data.sql"
- Verificar ordem de inserção de dados

---

## 📝 Exemplo de Estrutura Esperada

Ver o ficheiro `data_example.sql` nesta pasta para ver a estrutura esperada dos dados.

---

## 🆘 Ajuda

Se tiver problemas:

1. Verificar que o `data.sql` começa com `set search_path TO bd054_schema`
2. Verificar que tem comandos INSERT para as tabelas corretas
3. Ver documentação completa em `database/README.md`

---

**Pronto!** Depois de copiar o `data.sql`, siga os passos em `database/README.md` para executar tudo.
