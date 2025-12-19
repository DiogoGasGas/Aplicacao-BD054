-- ====================================================================
-- EXEMPLO DE DADOS - data.sql
-- Este é um ficheiro de exemplo. Substitua com o seu data.sql completo.
-- ====================================================================

set search_path TO bd054_schema, public;

-- ====================================================================
-- DEPARTAMENTOS (inserir primeiro devido a foreign keys)
-- ====================================================================

-- Inserir departamentos (sem gerente primeiro)
INSERT INTO departamentos (id_depart, nome) VALUES
(1, 'Recursos Humanos'),
(2, 'Tecnologia da Informação'),
(3, 'Financeiro'),
(4, 'Marketing'),
(5, 'Vendas'),
(6, 'Qualidade'),
(7, 'Atendimento ao Cliente'),
(8, 'Jurídico');

-- ====================================================================
-- FUNCIONÁRIOS (exemplos)
-- ====================================================================

INSERT INTO funcionarios (id_fun, nif, primeiro_nome, ultimo_nome, nome_rua, nome_localidade, codigo_postal, num_telemovel, email, data_nascimento, cargo, id_depart) VALUES
(1, '123456789', 'João', 'Silva', 'Rua das Flores', 'Lisboa', '1000-001', '912345678', 'joao.silva@empresa.pt', '1985-03-15', 'Gestor de RH', 1),
(2, '987654321', 'Maria', 'Santos', 'Av. da Liberdade', 'Lisboa', '1250-096', '923456789', 'maria.santos@empresa.pt', '1990-07-22', 'Programadora Senior', 2),
(3, '456789123', 'Pedro', 'Costa', 'Rua do Comércio', 'Porto', '4000-123', '934567890', 'pedro.costa@empresa.pt', '1988-11-10', 'Analista Financeiro', 3);

-- ====================================================================
-- Atualizar gerentes dos departamentos
-- ====================================================================

UPDATE departamentos SET id_gerente = 1 WHERE id_depart = 1;
UPDATE departamentos SET id_gerente = 2 WHERE id_depart = 2;
UPDATE departamentos SET id_gerente = 3 WHERE id_depart = 3;

-- ====================================================================
-- REMUNERAÇÕES E SALÁRIOS
-- ====================================================================

INSERT INTO remuneracoes (id_fun, data_inicio, data_fim) VALUES
(1, '2020-01-01', NULL),
(2, '2021-03-15', NULL),
(3, '2019-06-01', NULL);

INSERT INTO salario (id_fun, data_inicio, salario_bruto, salario_liquido) VALUES
(1, '2020-01-01', 3000.00, 2310.00),  -- líquido calculado automaticamente pelo trigger
(2, '2021-03-15', 3500.00, 2695.00),
(3, '2019-06-01', 2800.00, 2156.00);

-- ====================================================================
-- BENEFÍCIOS
-- ====================================================================

INSERT INTO beneficios (id_fun, data_inicio, tipo, valor) VALUES
(1, '2020-01-01', 'Subsídio Alimentação', 150.00),
(1, '2020-01-01', 'Seguro Saúde', 100.00),
(2, '2021-03-15', 'Subsídio Alimentação', 150.00),
(2, '2021-03-15', 'Telemóvel Empresa', 50.00),
(3, '2019-06-01', 'Subsídio Transporte', 80.00);

-- ====================================================================
-- FÉRIAS
-- ====================================================================

INSERT INTO ferias (id_fun, data_inicio, data_fim, num_dias, estado_aprov) VALUES
(1, '2024-08-01', '2024-08-15', 14, 'Aprovado'),
(2, '2024-07-15', '2024-07-29', 14, 'Aprovado'),
(3, '2024-09-01', '2024-09-10', 9, 'Por aprovar');

-- ====================================================================
-- FORMAÇÕES
-- ====================================================================

INSERT INTO formacoes (id_for, nome_formacao, descricao, data_inicio, data_fim, estado) VALUES
(1, 'Liderança e Gestão de Equipas', 'Formação em competências de liderança', '2024-01-10', '2024-01-12', 'Concluida'),
(2, 'Python Avançado', 'Programação Python avançada', '2024-03-01', '2024-03-15', 'Concluida'),
(3, 'Excel para Finanças', 'Excel aplicado a análise financeira', '2024-02-05', '2024-02-07', 'Concluida');

INSERT INTO teve_formacao (id_fun, id_for, data_inicio, data_fim) VALUES
(1, 1, '2024-01-10', '2024-01-12'),
(2, 2, '2024-03-01', '2024-03-15'),
(3, 3, '2024-02-05', '2024-02-07');

-- ====================================================================
-- AVALIAÇÕES
-- ====================================================================

INSERT INTO avaliacoes (id_fun, id_avaliador, data, avaliacao_numerica, criterios, autoavaliacao) VALUES
(2, 1, '2024-06-01', 9, 'Excelente desempenho técnico, boa capacidade de resolução de problemas', 'Considero que cumpri todos os objetivos'),
(3, 1, '2024-06-15', 8, 'Bom desempenho, pontual e dedicado', 'Atingi as metas propostas');

-- ====================================================================
-- VAGAS
-- ====================================================================

INSERT INTO vagas (id_vaga, data_abertura, estado, id_depart) VALUES
(1, '2024-10-01', 'Aberta', 2),
(2, '2024-11-01', 'Aberta', 3);

INSERT INTO requisitos_vaga (id_vaga, requisito) VALUES
(1, 'Licenciatura em Informática'),
(1, '3+ anos de experiência em JavaScript/TypeScript'),
(1, 'Conhecimentos de React'),
(2, 'Licenciatura em Gestão ou Economia'),
(2, 'Experiência com Excel avançado');

-- ====================================================================
-- CANDIDATOS
-- ====================================================================

INSERT INTO candidatos (id_cand, nome, email, telemovel) VALUES
(1, 'Ana Ferreira', 'ana.ferreira@email.com', '915555111'),
(2, 'Bruno Almeida', 'bruno.almeida@email.com', '925555222');

INSERT INTO candidato_a (id_cand, id_vaga, data_cand, estado, id_recrutador) VALUES
(1, 1, '2024-10-05', 'Entrevista', 1),
(2, 2, '2024-11-10', 'Em análise', 1);

-- ====================================================================
-- DEPENDENTES
-- ====================================================================

INSERT INTO dependentes (id_fun, nome, sexo, data_nascimento, parentesco) VALUES
(1, 'Ana Silva', 'Feminino', '2015-05-20', 'Filho(a)'),
(2, 'José Santos', 'Masculino', '1960-03-10', 'Pai/Mãe');

-- ====================================================================
-- NOTA: Este é apenas um EXEMPLO com poucos registos.
-- Substitua este ficheiro pelo seu data.sql completo com todos os dados.
-- ====================================================================
