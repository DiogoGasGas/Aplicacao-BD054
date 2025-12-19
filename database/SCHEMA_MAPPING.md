# 📊 Mapeamento: Base de Dados ↔ Frontend

Este documento explica como as tabelas da base de dados PostgreSQL se relacionam com os tipos TypeScript do frontend.

## 🔄 Schema Overview

A base de dados usa o schema: **`bd054_schema`**

## 📋 Mapeamento Principal

### Funcionários (Employees)

| Frontend (types.ts) | Base de Dados (schema.sql) | Notas |
|---------------------|---------------------------|--------|
| `Employee.id` | `funcionarios.id_fun` | ID do funcionário |
| `Employee.fullName` | `primeiro_nome + ultimo_nome` | Concatenar |
| `Employee.nif` | `funcionarios.nif` | NIF |
| `Employee.email` | `funcionarios.email` | Email |
| `Employee.phone` | `funcionarios.num_telemovel` | Telemóvel |
| `Employee.address` | `nome_rua + nome_localidade + codigo_postal` | Concatenar morada |
| `Employee.birthDate` | `funcionarios.data_nascimento` | Data nascimento |
| `Employee.department` | `departamentos.nome` (via JOIN) | Nome do departamento |
| `Employee.role` | `funcionarios.cargo` | Cargo |
| `Employee.admissionDate` | *(não existe na BD)* | 🔴 Adicionar? |

### Financials (Dados Financeiros)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `financials.baseSalaryGross` | `salario.salario_bruto` | Último salário |
| `financials.netSalary` | `salario.salario_liquido` | Calculado automaticamente |
| `financials.deductions` | `salario_bruto - salario_liquido` | Diferença |
| `financials.benefits[]` | `beneficios` (JOIN) | Array de benefícios |
| `financials.history[]` | `salario` (histórico) | Histórico salarial |

### Vacation (Férias)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `vacations.totalDays` | *(calculado)* | 22 dias base (em PT) |
| `vacations.usedDays` | `SUM(ferias.num_dias)` | Soma de dias aprovados |
| `vacations.history[]` | `ferias` | Registos de férias |
| `VacationRecord.status` | `ferias.estado_aprov` | Mapeamento de estados |

**Mapeamento de Estados:**
- Frontend `'Approved'` ↔ BD `'Aprovado'`
- Frontend `'Pending'` ↔ BD `'Por aprovar'`
- Frontend `'Rejected'` ↔ BD `'Rejeitado'`

### Training (Formações)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `Training.id` | `formacoes.id_for` | ID da formação |
| `Training.title` | `formacoes.nome_formacao` | Nome |
| `Training.date` | `teve_formacao.data_inicio` | Data início |
| `Training.status` | `formacoes.estado` | Mapeamento de estados |
| `Training.provider` | *(não existe)* | 🔴 Adicionar ou usar fixo |

**Mapeamento de Estados:**
- Frontend `'Completed'` ↔ BD `'Concluida'`
- Frontend `'Enrolled'` ↔ BD `'Em curso'`
- Frontend `'Available'` ↔ BD `'Planeada'`

### Evaluations (Avaliações)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `Evaluation.id` | `id_fun + id_avaliador + data` | Chave composta |
| `Evaluation.date` | `avaliacoes.data` | Data |
| `Evaluation.score` | `avaliacoes.avaliacao_numerica` | Nota numérica |
| `Evaluation.reviewer` | Nome do `id_avaliador` (JOIN) | Nome do avaliador |
| `Evaluation.comments` | `avaliacoes.criterios` | Comentários |
| `Evaluation.selfEvaluation` | `avaliacoes.autoavaliacao` | Auto-avaliação |
| `Evaluation.documentUrl` | `avaliacoes.avaliacao` (BYTEA) | Documento em bytes |
| `Evaluation.type` | *(calculado)* | Manager/Self/Peer |

### Job History (Histórico)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `JobHistory.company` | `historico_empresas.nome_empresa` | Nome empresa |
| `JobHistory.role` | `historico_empresas.cargo` | Cargo |
| `JobHistory.startDate` | `historico_empresas.data_inicio` | Início |
| `JobHistory.endDate` | `historico_empresas.data_fim` | Fim |
| `JobHistory.isInternal` | `nome_empresa = 'Empresa Atual'` | Se é interno |

### Dependents (Dependentes)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `Dependent.id` | `id_fun + parentesco + nome` | Chave composta |
| `Dependent.name` | `dependentes.nome` | Nome |
| `Dependent.relationship` | `dependentes.parentesco` | Relação |
| `Dependent.birthDate` | `dependentes.data_nascimento` | Data nascimento |

### Absences (Faltas)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `Absence.id` | `id_fun + data` | Chave composta |
| `Absence.date` | `faltas.data` | Data |
| `Absence.reason` | `faltas.justificacao` | Justificação |
| `Absence.justified` | `justificacao IS NOT NULL` | Se tem justificação |

---

## 🏢 Departamentos

| Frontend (Department enum) | Base de Dados (CHECK constraint) |
|---------------------------|----------------------------------|
| `'Tecnologia da Informação'` | `'Tecnologia da Informação'` ✅ |
| `'Recursos Humanos'` | `'Recursos Humanos'` ✅ |
| `'Financeiro'` | `'Financeiro'` ✅ |
| `'Vendas'` | `'Vendas'` ✅ |
| `'Marketing'` | `'Marketing'` ✅ |
| `'Operações'` | ❌ Não existe na BD |

**Departamentos na BD mas não no Frontend:**
- `'Qualidade'` 🔴
- `'Atendimento ao Cliente'` 🔴
- `'Jurídico'` 🔴

### DepartmentMetadata

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `DepartmentMetadata.id` | `departamentos.id_depart` | ID |
| `DepartmentMetadata.managerId` | `departamentos.id_gerente` | Gerente |
| `DepartmentMetadata.description` | *(não existe)* | 🔴 Adicionar? |

---

## 📝 Recrutamento

### Job Openings (Vagas)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `JobOpening.id` | `vagas.id_vaga` | ID |
| `JobOpening.title` | *(não existe)* | 🔴 Adicionar ou usar cargo |
| `JobOpening.department` | `vagas.id_depart` (JOIN) | Departamento |
| `JobOpening.openDate` | `vagas.data_abertura` | Data abertura |
| `JobOpening.status` | `vagas.estado` | Mapeamento de estados |
| `JobOpening.description` | *(não existe)* | 🔴 Adicionar? |
| `JobOpening.requirements[]` | `requisitos_vaga` (JOIN) | Array requisitos |

**Mapeamento de Estados:**
- Frontend `'Open'` ↔ BD `'Aberta'`
- Frontend `'Closed'` ↔ BD `'Fechada'`
- Frontend `'Suspended'` ↔ BD `'Suspensa'`

### Candidates (Candidatos)

| Frontend | Base de Dados | Notas |
|----------|---------------|--------|
| `Candidate.id` | `candidatos.id_cand` | ID |
| `Candidate.jobId` | `candidato_a.id_vaga` | Vaga |
| `Candidate.name` | `candidatos.nome` | Nome |
| `Candidate.email` | `candidatos.email` | Email |
| `Candidate.phone` | `candidatos.telemovel` | Telemóvel |
| `Candidate.status` | `candidato_a.estado` | Mapeamento |
| `Candidate.appliedDate` | `candidato_a.data_cand` | Data candidatura |
| `Candidate.recruiterId` | `candidato_a.id_recrutador` | Recrutador |
| `Candidate.cvUrl` | `candidatos.cv` (BYTEA) | CV em bytes |
| `Candidate.coverLetter` | `candidatos.carta_motivacao` (BYTEA) | Carta em bytes |

**Mapeamento de Estados:**
- Frontend `'Submitted'` ↔ BD `'Submetido'`
- Frontend `'Screening'` ↔ BD `'Em análise'`
- Frontend `'Interview'` ↔ BD `'Entrevista'`
- Frontend `'Rejected'` ↔ BD `'Rejeitado'`
- Frontend `'Hired'` ↔ BD `'Contratado'`

---

## 🔴 Campos em Falta / Diferenças

### No Frontend mas não na BD:
1. `Employee.admissionDate` - Data de admissão (adicionar coluna?)
2. `Employee.avatarUrl` - URL da foto (adicionar coluna?)
3. `DepartmentMetadata.description` - Descrição do departamento
4. `JobOpening.title` - Título da vaga
5. `JobOpening.description` - Descrição da vaga
6. `Training.provider` - Fornecedor da formação

### Na BD mas não no Frontend:
1. `funcionarios.nome_rua`, `nome_localidade`, `codigo_postal` - Morada separada
2. `dependentes.sexo` - Sexo do dependente
3. `utilizadores` - Tabela de utilizadores/passwords
4. `permissoes` - Permissões de acesso

---

## 💡 Recomendações

### Opção 1: Adicionar Colunas à BD (Recomendado)
Adicionar as colunas em falta para corresponder ao frontend:

```sql
ALTER TABLE funcionarios
ADD COLUMN data_admissao DATE,
ADD COLUMN foto_url VARCHAR(255);

ALTER TABLE departamentos
ADD COLUMN descricao TEXT;

ALTER TABLE vagas
ADD COLUMN titulo VARCHAR(100),
ADD COLUMN descricao TEXT;

ALTER TABLE formacoes
ADD COLUMN fornecedor VARCHAR(100);
```

### Opção 2: Ajustar Frontend
Remover campos do frontend que não existem na BD e adaptar.

### Opção 3: Usar Valores Default
No backend, retornar valores default para campos inexistentes:
- `admissionDate`: primeira entrada em `remuneracoes`
- `avatarUrl`: `null` ou URL padrão
- `provider`: nome da empresa

---

## 📝 Queries Exemplo

### Buscar Funcionário Completo

```sql
-- Dados básicos
SELECT
    f.id_fun,
    f.primeiro_nome || ' ' || f.ultimo_nome AS nome_completo,
    f.nif,
    f.email,
    f.num_telemovel,
    f.nome_rua || ', ' || f.nome_localidade || ' ' || f.codigo_postal AS morada,
    f.data_nascimento,
    d.nome AS departamento,
    f.cargo
FROM bd054_schema.funcionarios f
LEFT JOIN bd054_schema.departamentos d ON f.id_depart = d.id_depart
WHERE f.id_fun = $1;

-- Salário atual
SELECT salario_bruto, salario_liquido
FROM bd054_schema.salario
WHERE id_fun = $1
ORDER BY data_inicio DESC
LIMIT 1;

-- Benefícios
SELECT tipo, valor
FROM bd054_schema.beneficios
WHERE id_fun = $1;

-- Férias
SELECT
    data_inicio,
    data_fim,
    num_dias,
    estado_aprov
FROM bd054_schema.ferias
WHERE id_fun = $1
ORDER BY data_inicio DESC;
```

---

## ✅ Checklist de Integração

- [ ] Executar `schema.sql` no PostgreSQL
- [ ] Executar `triggers.sql` no PostgreSQL
- [ ] Decidir se adiciona colunas em falta (Opção 1)
- [ ] Atualizar controllers com nomes corretos
- [ ] Testar queries no PostgreSQL
- [ ] Mapear enums (estados, departamentos)
- [ ] Implementar conversão BYTEA ↔ URL (para CVs, fotos)
- [ ] Adicionar função helper para concatenar nomes
- [ ] Testar integração completa
