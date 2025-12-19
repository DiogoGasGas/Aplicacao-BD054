import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Employee } from '../types';

/**
 * Controllers para gestão de funcionários
 * ATUALIZADO para corresponder ao schema real da base de dados (bd054_schema)
 */

// Helper: Mapear estado de férias PT → EN
function mapVacationStatus(estadoPT: string): 'Approved' | 'Pending' | 'Rejected' {
  const map: Record<string, 'Approved' | 'Pending' | 'Rejected'> = {
    'Aprovado': 'Approved',
    'Por aprovar': 'Pending',
    'Rejeitado': 'Rejected'
  };
  return map[estadoPT] || 'Pending';
}

// GET /api/employees - Listar todos os colaboradores
export async function getAllEmployees(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        f.id_fun as id,
        f.primeiro_nome || ' ' || f.ultimo_nome as "fullName",
        f.nif,
        f.email,
        f.num_telemovel as phone,
        f.nome_rua || ', ' || f.nome_localidade || ' ' || f.codigo_postal as address,
        f.data_nascimento as "birthDate",
        COALESCE(d.nome, 'Sem Departamento') as department,
        f.cargo as role
      FROM bd054_schema.funcionarios f
      LEFT JOIN bd054_schema.departamentos d ON f.id_depart = d.id_depart
      ORDER BY f.primeiro_nome, f.ultimo_nome
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error);
    res.status(500).json({
      error: 'Erro ao buscar colaboradores',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/employees/:id - Buscar colaborador por ID com todos os detalhes
export async function getEmployeeById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // 1. Buscar dados básicos do colaborador
    const employeeResult = await pool.query(`
      SELECT
        f.id_fun as id,
        f.primeiro_nome || ' ' || f.ultimo_nome as "fullName",
        f.nif,
        f.email,
        f.num_telemovel as phone,
        f.nome_rua || ', ' || f.nome_localidade || ' ' || f.codigo_postal as address,
        f.data_nascimento as "birthDate",
        COALESCE(d.nome, 'Sem Departamento') as department,
        f.cargo as role,
        (SELECT MIN(data_inicio) FROM bd054_schema.remuneracoes WHERE id_fun = f.id_fun) as "admissionDate"
      FROM bd054_schema.funcionarios f
      LEFT JOIN bd054_schema.departamentos d ON f.id_depart = d.id_depart
      WHERE f.id_fun = $1
    `, [id]);

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    const employee = employeeResult.rows[0];

    // 2. Buscar salário atual (mais recente)
    const salaryResult = await pool.query(`
      SELECT
        salario_bruto as "baseSalaryGross",
        salario_liquido as "netSalary",
        (salario_bruto - salario_liquido) as deductions
      FROM bd054_schema.salario
      WHERE id_fun = $1
      ORDER BY data_inicio DESC
      LIMIT 1
    `, [id]);

    // 3. Buscar benefícios atuais
    const benefitsResult = await pool.query(`
      SELECT
        b.id_fun || '-' || b.data_inicio || '-' || b.tipo as id,
        b.tipo as type,
        b.valor as value
      FROM bd054_schema.beneficios b
      WHERE b.id_fun = $1
      ORDER BY b.data_inicio DESC
    `, [id]);

    // 4. Buscar histórico salarial
    const salaryHistoryResult = await pool.query(`
      SELECT
        s.data_inicio::text as date,
        s.salario_bruto as amount,
        'Ajuste salarial' as reason
      FROM bd054_schema.salario s
      WHERE s.id_fun = $1
      ORDER BY s.data_inicio DESC
    `, [id]);

    // 5. Calcular férias (dias usados no ano corrente)
    const vacationSummaryResult = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN estado_aprov = 'Aprovado' THEN num_dias ELSE 0 END), 0) as "usedDays"
      FROM bd054_schema.ferias
      WHERE id_fun = $1
        AND EXTRACT(YEAR FROM data_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [id]);

    // 6. Buscar histórico de férias
    const vacationHistoryResult = await pool.query(`
      SELECT
        id_fun || '-' || data_inicio::text as id,
        data_inicio::text as "startDate",
        data_fim::text as "endDate",
        num_dias as "daysUsed",
        estado_aprov as status
      FROM bd054_schema.ferias
      WHERE id_fun = $1
      ORDER BY data_inicio DESC
    `, [id]);

    // 7. Buscar formações
    const trainingsResult = await pool.query(`
      SELECT
        f.id_for::text as id,
        f.nome_formacao as title,
        tf.data_inicio::text as date,
        CASE
          WHEN f.estado = 'Concluida' THEN 'Completed'
          WHEN f.estado = 'Em curso' THEN 'Enrolled'
          ELSE 'Available'
        END as status,
        'Empresa' as provider
      FROM bd054_schema.teve_formacao tf
      JOIN bd054_schema.formacoes f ON tf.id_for = f.id_for
      WHERE tf.id_fun = $1
      ORDER BY tf.data_inicio DESC
    `, [id]);

    // 8. Buscar avaliações
    const evaluationsResult = await pool.query(`
      SELECT
        a.id_fun || '-' || a.id_avaliador || '-' || a.data::text as id,
        a.data::text as date,
        a.avaliacao_numerica as score,
        av.primeiro_nome || ' ' || av.ultimo_nome as reviewer,
        a.criterios as comments,
        a.autoavaliacao as "selfEvaluation",
        CASE
          WHEN a.id_fun = a.id_avaliador THEN 'Self'
          ELSE 'Manager'
        END as type
      FROM bd054_schema.avaliacoes a
      JOIN bd054_schema.funcionarios av ON a.id_avaliador = av.id_fun
      WHERE a.id_fun = $1
      ORDER BY a.data DESC
    `, [id]);

    // 9. Buscar histórico profissional
    const jobHistoryResult = await pool.query(`
      SELECT
        nome_empresa as company,
        cargo as role,
        data_inicio::text as "startDate",
        data_fim::text as "endDate",
        (nome_empresa = 'Empresa Atual') as "isInternal"
      FROM bd054_schema.historico_empresas
      WHERE id_fun = $1
      ORDER BY data_inicio DESC
    `, [id]);

    // 10. Buscar dependentes
    const dependentsResult = await pool.query(`
      SELECT
        id_fun || '-' || parentesco || '-' || nome as id,
        nome as name,
        parentesco as relationship,
        data_nascimento::text as "birthDate"
      FROM bd054_schema.dependentes
      WHERE id_fun = $1
    `, [id]);

    // 11. Buscar faltas
    const absencesResult = await pool.query(`
      SELECT
        id_fun || '-' || data::text as id,
        data::text as date,
        justificacao as reason,
        (justificacao IS NOT NULL AND justificacao != '') as justified
      FROM bd054_schema.faltas
      WHERE id_fun = $1
      ORDER BY data DESC
    `, [id]);

    // Montar objeto completo Employee
    const fullEmployee: Employee = {
      ...employee,
      avatarUrl: undefined, // Não existe na BD
      financials: {
        baseSalaryGross: salaryResult.rows[0]?.baseSalaryGross || 0,
        netSalary: salaryResult.rows[0]?.netSalary || 0,
        deductions: salaryResult.rows[0]?.deductions || 0,
        benefits: benefitsResult.rows,
        history: salaryHistoryResult.rows
      },
      vacations: {
        totalDays: 22, // Padrão em Portugal
        usedDays: parseInt(vacationSummaryResult.rows[0]?.usedDays || '0'),
        history: vacationHistoryResult.rows.map(v => ({
          ...v,
          status: mapVacationStatus(v.status)
        }))
      },
      trainings: trainingsResult.rows,
      evaluations: evaluationsResult.rows,
      jobHistory: jobHistoryResult.rows,
      dependents: dependentsResult.rows,
      absences: absencesResult.rows
    };

    res.json(fullEmployee);
  } catch (error) {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).json({
      error: 'Erro ao buscar colaborador',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// POST /api/employees - Criar novo colaborador
export async function createEmployee(req: Request, res: Response) {
  const employeeData = req.body;

  try {
    // Separar nome completo em primeiro e último nome
    const [primeiroNome, ...restoNome] = employeeData.fullName.split(' ');
    const ultimoNome = restoNome.join(' ') || primeiroNome;

    // Buscar próximo ID disponível
    const maxIdResult = await pool.query(`
      SELECT COALESCE(MAX(id_fun), 0) + 1 as next_id
      FROM bd054_schema.funcionarios
    `);
    const nextId = maxIdResult.rows[0].next_id;

    // Buscar id_depart pelo nome do departamento
    const deptResult = await pool.query(`
      SELECT id_depart
      FROM bd054_schema.departamentos
      WHERE nome = $1
    `, [employeeData.department]);

    const idDepart = deptResult.rows[0]?.id_depart;

    // Inserir funcionário
    await pool.query(`
      INSERT INTO bd054_schema.funcionarios (
        id_fun, nif, primeiro_nome, ultimo_nome, num_telemovel,
        email, data_nascimento, cargo, id_depart
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      nextId,
      employeeData.nif,
      primeiroNome,
      ultimoNome,
      employeeData.phone,
      employeeData.email,
      employeeData.birthDate,
      employeeData.role,
      idDepart
    ]);

    res.status(201).json({
      message: 'Colaborador criado com sucesso',
      id: nextId
    });
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(500).json({
      error: 'Erro ao criar colaborador',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// PUT /api/employees/:id - Atualizar colaborador
export async function updateEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const employeeData = req.body;

  try {
    // Separar nome completo
    const [primeiroNome, ...restoNome] = employeeData.fullName.split(' ');
    const ultimoNome = restoNome.join(' ') || primeiroNome;

    // Buscar id_depart
    const deptResult = await pool.query(`
      SELECT id_depart
      FROM bd054_schema.departamentos
      WHERE nome = $1
    `, [employeeData.department]);

    const idDepart = deptResult.rows[0]?.id_depart;

    const result = await pool.query(`
      UPDATE bd054_schema.funcionarios
      SET
        primeiro_nome = $1,
        ultimo_nome = $2,
        email = $3,
        num_telemovel = $4,
        cargo = $5,
        id_depart = $6
      WHERE id_fun = $7
      RETURNING id_fun
    `, [
      primeiroNome,
      ultimoNome,
      employeeData.email,
      employeeData.phone,
      employeeData.role,
      idDepart,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json({ message: 'Colaborador atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({
      error: 'Erro ao atualizar colaborador',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// DELETE /api/employees/:id - Remover colaborador
export async function deleteEmployee(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM bd054_schema.funcionarios
      WHERE id_fun = $1
      RETURNING id_fun
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json({ message: 'Colaborador removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover colaborador:', error);
    res.status(500).json({
      error: 'Erro ao remover colaborador',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
