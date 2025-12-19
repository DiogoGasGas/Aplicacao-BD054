set search_path TO bd054_schema, public;

-- ====================================================================
-- TRIGGER: Calcular número de dias de férias automaticamente
-- Deve ser executado antes do trigger de validar dias de férias
-- ====================================================================

CREATE OR REPLACE FUNCTION calcular_num_dias_ferias()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se as datas são válidas
    IF NEW.data_fim < NEW.data_inicio THEN
        RAISE NOTICE
            'A data de fim (%) não pode ser anterior à data de início (%)',
            NEW.data_fim, NEW.data_inicio;
    END IF;

    -- Calcula o número de dias de férias automaticamente
    NEW.num_dias := NEW.data_fim - NEW.data_inicio + 1;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_calcular_num_dias_ferias
BEFORE INSERT OR UPDATE ON ferias
FOR EACH ROW
EXECUTE FUNCTION calcular_num_dias_ferias();

-- ====================================================================
-- TRIGGER: Validar dias de férias
-- ====================================================================

CREATE OR REPLACE FUNCTION validar_dias_ferias()
RETURNS TRIGGER AS $$
DECLARE
    v_dias_permitidos INT;
BEGIN
    -- Usa a função correta que calcula o total de dias permitidos
    v_dias_permitidos := calcular_total_dias_permitidos(NEW.id_fun);

    -- Verifica se o funcionário está a tentar tirar mais dias do que tem direito
    IF NEW.num_dias > v_dias_permitidos THEN
        RAISE NOTICE
            'O funcionário % não pode tirar % dias, máximo permitido é %',
            NEW.id_fun, NEW.num_dias, v_dias_permitidos;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_dias_ferias
BEFORE INSERT OR UPDATE ON ferias
FOR EACH ROW
EXECUTE FUNCTION validar_dias_ferias();

-- ====================================================================
-- FUNÇÃO: Calcular descontos sobre o salário bruto
-- ====================================================================

CREATE OR REPLACE FUNCTION descontos(p_salario_bruto NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    v_descontos NUMERIC;  -- Guarda o valor total dos descontos
BEGIN
    -- Aplica uma taxa de 11% de Segurança Social e 12% de IRS
    v_descontos := p_salario_bruto * (0.11 + 0.12);

    -- Retorna o valor total dos descontos calculado
    RETURN v_descontos;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- TRIGGER: Calcular salário líquido
-- ====================================================================

CREATE OR REPLACE FUNCTION calc_salario_liquido()
RETURNS TRIGGER AS $$
DECLARE
    v_descontos NUMERIC;
    v_salario_liquido NUMERIC;
BEGIN
    -- Chama a função que calcula os descontos
    v_descontos := descontos(NEW.salario_bruto);

    -- Calcula o salário líquido
    v_salario_liquido := NEW.salario_bruto - v_descontos;

    -- Evita salário líquido negativo
    IF v_salario_liquido < 0 THEN
        RAISE NOTICE
            'O salário líquido não pode ser negativo: bruto=%, descontos=%',
            NEW.salario_bruto, v_descontos;
    END IF;

    -- Atualiza o campo da nova linha
    NEW.salario_liquido := v_salario_liquido;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_calc_salario_liquido
BEFORE INSERT OR UPDATE ON salario
FOR EACH ROW
EXECUTE FUNCTION calc_salario_liquido();

-- ====================================================================
-- TRIGGER: Registar mudança de cargo no histórico
-- ====================================================================

CREATE OR REPLACE FUNCTION registrar_mudanca_cargo()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o cargo foi alterado
    IF OLD.cargo IS DISTINCT FROM NEW.cargo THEN
        -- CORREÇÃO: Removemos a referência à coluna "nome_departamento"
        INSERT INTO historico_empresas (id_fun, nome_empresa, cargo, data_inicio, data_fim)
        VALUES (NEW.id_fun, 'Empresa Atual', NEW.cargo, CURRENT_DATE, NULL);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- TRIGGER: Validar idade mínima do funcionário (16 anos)
-- ====================================================================

CREATE OR REPLACE FUNCTION validar_idade_funcionario()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica a idade mínima
    IF NEW.data_nascimento > CURRENT_DATE - INTERVAL '16 years' THEN
        RAISE NOTICE
            'O funcionário % tem idade inferior a 16 anos',
            NEW.primeiro_nome || ' ' || NEW.ultimo_nome;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_validar_idade_funcionario
BEFORE INSERT ON funcionarios
FOR EACH ROW
EXECUTE FUNCTION validar_idade_funcionario();

-- ====================================================================
-- TRIGGER: Criar utilizador automaticamente ao inserir funcionário
-- ====================================================================

CREATE OR REPLACE FUNCTION cria_utilizador()
RETURNS TRIGGER AS $$
BEGIN
    -- Insere o novo utilizador com password temporária
    INSERT INTO utilizadores (id_fun, password)
    VALUES (NEW.id_fun, 'password_temporaria');
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_cria_utilizador
AFTER INSERT ON funcionarios
FOR EACH ROW
EXECUTE FUNCTION cria_utilizador();

-- ====================================================================
-- TRIGGER: Remover permissões ao eliminar funcionário
-- ====================================================================

CREATE OR REPLACE FUNCTION delete_permissoes()
RETURNS TRIGGER AS $$
BEGIN
    -- Apaga as permissões do funcionário removido
    DELETE FROM permissoes WHERE id_fun = OLD.id_fun;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_delete_permissoes
AFTER DELETE ON funcionarios
FOR EACH ROW
EXECUTE FUNCTION delete_permissoes();

-- ====================================================================
-- TRIGGER: Validar datas de dependentes
-- ====================================================================

CREATE OR REPLACE FUNCTION validar_datas_dependentes()
RETURNS TRIGGER AS $$
DECLARE
    v_data_funcionario DATE;  -- Data de nascimento do funcionário
BEGIN
    -- Busca a data de nascimento do funcionário
    SELECT data_nascimento INTO v_data_funcionario
    FROM funcionarios
    WHERE id_fun = NEW.id_fun;

    -- Se o funcionário não existir, lança erro
    IF v_data_funcionario IS NULL THEN
        RAISE EXCEPTION 'Funcionário com ID % não encontrado.', NEW.id_fun;
    END IF;

    -- Caso o dependente seja um filho(a)
    IF NEW.parentesco = 'Filho(a)' THEN
        IF NEW.data_nascimento <= v_data_funcionario THEN
            RAISE EXCEPTION
                'O dependente (Filho(a)) deve nascer após o funcionário (ID %).', NEW.id_fun;
        END IF;
    END IF;

    -- Caso o dependente seja pai/mãe
    IF NEW.parentesco = 'Pai/Mãe' THEN
        IF NEW.data_nascimento >= v_data_funcionario THEN
            RAISE EXCEPTION
                'O dependente (Pai/Mãe) deve ser mais velho que o funcionário (ID %).', NEW.id_fun;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger associado
CREATE TRIGGER trg_validar_datas_dependentes
BEFORE INSERT OR UPDATE ON dependentes
FOR EACH ROW
EXECUTE FUNCTION validar_datas_dependentes();

-- ====================================================================
-- TRIGGER: Validar datas de remunerações
-- ====================================================================

CREATE OR REPLACE FUNCTION validar_datas_remuneracoes()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se a data de fim foi fornecida antes de comparar
    IF NEW.data_fim IS NOT NULL AND NEW.data_inicio >= NEW.data_fim THEN
        RAISE NOTICE
            'A data de início (%) deve ser anterior à data de fim (%)',
            NEW.data_inicio, NEW.data_fim;
    END IF;

    -- Garante que a data de início não está no futuro
    IF NEW.data_inicio > CURRENT_DATE THEN
        RAISE NOTICE
            'A data de início (%) não pode ser no futuro', NEW.data_inicio;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
