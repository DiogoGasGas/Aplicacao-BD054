# ⚠️ NOTA IMPORTANTE - Função em Falta

## Problema Identificado

O trigger `validar_dias_ferias()` em `triggers.sql` referencia uma função que **não está definida**:

```sql
v_dias_permitidos := calcular_total_dias_permitidos(NEW.id_fun);
```

## 🔧 Solução

Você precisa criar a função `calcular_total_dias_permitidos`. Aqui está um exemplo:

```sql
-- Adicionar ao triggers.sql ANTES do trigger validar_dias_ferias

CREATE OR REPLACE FUNCTION calcular_total_dias_permitidos(p_id_fun INT)
RETURNS INT AS $$
DECLARE
    v_dias_permitidos INT := 22;  -- Base em Portugal
    v_anos_servico INT;
BEGIN
    -- Calcular anos de serviço
    SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, MIN(data_inicio)))::INT
    INTO v_anos_servico
    FROM bd054_schema.remuneracoes
    WHERE id_fun = p_id_fun;

    -- Adicionar dias por antiguidade (exemplo: +1 dia a cada 5 anos)
    IF v_anos_servico IS NOT NULL THEN
        v_dias_permitidos := v_dias_permitidos + (v_anos_servico / 5);
    END IF;

    RETURN v_dias_permitidos;
END;
$$ LANGUAGE plpgsql;
```

## Ou Alternativa Simples

Se não quiser lógica complexa, retorne sempre 22 dias:

```sql
CREATE OR REPLACE FUNCTION calcular_total_dias_permitidos(p_id_fun INT)
RETURNS INT AS $$
BEGIN
    RETURN 22;  -- 22 dias de férias (padrão PT)
END;
$$ LANGUAGE plpgsql;
```

## 📝 Como Aplicar

### Opção 1: Adicionar ao triggers.sql
Edite o ficheiro `triggers.sql` e adicione a função **ANTES** do trigger `validar_dias_ferias`.

### Opção 2: Executar diretamente
Execute o SQL acima diretamente no PostgreSQL via pgAdmin ou psql.

### Opção 3: Comentar o trigger
Se não quiser essa validação agora, pode comentar o trigger:

```sql
-- Comentar estas linhas em triggers.sql:
/*
CREATE OR REPLACE FUNCTION validar_dias_ferias()
...
CREATE TRIGGER trg_validar_dias_ferias
...
*/
```

## ✅ Checklist

- [ ] Decidir qual função usar (complexa ou simples)
- [ ] Adicionar função ao `triggers.sql` ou executar no PostgreSQL
- [ ] Testar inserção de férias para confirmar que funciona
- [ ] Verificar se não há outros erros de trigger

## 🧪 Teste

Depois de adicionar a função, teste:

```sql
-- Inserir um pedido de férias de teste
INSERT INTO bd054_schema.ferias (id_fun, data_inicio, data_fim, num_dias)
VALUES (1, '2025-07-01', '2025-07-15', 14);

-- Se não der erro, está tudo OK!
```
