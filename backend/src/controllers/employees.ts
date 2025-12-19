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
    console.log('📊 Buscando colaboradores...');
    
    const result = await pool.query(`
      SELECT
        f.id_fun as id,
        (f.primeiro_nome || ' ' || f.ultimo_nome) as "fullName",
        f.nif,
        f.email,
        f.num_telemovel as phone,
        (COALESCE(f.nome_rua, '') || ', ' || COALESCE(f.nome_localidade, '') || ' ' || COALESCE(f.codigo_postal, '')) as address,
        f.data_nascimento as "birthDate",
        d.nome as department,
        f.cargo as role,
        NULL as "admissionDate",
        NULL as "avatarUrl"
      FROM funcionarios f
      LEFT JOIN departamentos d ON f.id_depart = d.id_depart
      ORDER BY f.primeiro_nome, f.ultimo_nome
    `);

    console.log(`✅ Encontrados ${result.rows.length} colaboradores`);

    // Buscar salários para cada funcionário
    const employeesWithSalary = await Promise.all(
      result.rows.map(async (row) => {
        try {
          const salaryResult = await pool.query(`
            SELECT salario_bruto
            FROM salario
            WHERE id_fun = $1
            ORDER BY data_inicio DESC
            LIMIT 1
          `, [row.id]);

          const salary = salaryResult.rows[0];
          const baseSalary = salary ? parseFloat(salary.salario_bruto) : 0;
          const netSalary = baseSalary * 0.77;
          const deductions = baseSalary - netSalary;
          
          return {
            id: row.id.toString(), // Converter para string
            fullName: row.fullName,
            nif: row.nif,
            email: row.email,
            phone: row.phone,
            address: row.address,
            birthDate: row.birthDate,
            department: row.department,
            role: row.role,
            admissionDate: row.admissionDate,
            avatarUrl: row.avatarUrl,
            financials: {
              baseSalaryGross: baseSalary,
              netSalary: netSalary,
              deductions: deductions,
              benefits: [],
              history: []
            },
            vacations: {
              totalDays: 22,
              usedDays: 0,
              history: []
            },
            trainings: [],
            evaluations: [],
            jobHistory: [],
            dependents: []
          };
        } catch (err) {
          console.error(`Erro ao buscar salário para funcionário ${row.id}:`, err);
          return {
            id: row.id.toString(), // Converter para string
            fullName: row.fullName,
            nif: row.nif,
            email: row.email,
            phone: row.phone,
            address: row.address,
            birthDate: row.birthDate,
            department: row.department,
            role: row.role,
            admissionDate: row.admissionDate,
            avatarUrl: row.avatarUrl,
            financials: {
              baseSalaryGross: 0,
              netSalary: 0,
              deductions: 0,
              benefits: [],
              history: []
            },
            vacations: {
              totalDays: 22,
              usedDays: 0,
              history: []
            },
            trainings: [],
            evaluations: [],
            jobHistory: [],
            dependents: []
          };
        }
      })
    );

    console.log('📤 Enviando resposta...');
    res.json(employeesWithSalary);
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
    console.log(`📊 Buscando detalhes do colaborador ${id}...`);
    
    // 1. Buscar dados básicos do colaborador
    const employeeResult = await pool.query(`
      SELECT
        f.id_fun as id,
        (f.primeiro_nome || ' ' || f.ultimo_nome) as "fullName",
        f.nif,
        f.email,
        f.num_telemovel as phone,
        (COALESCE(f.nome_rua, '') || ', ' || COALESCE(f.nome_localidade, '') || ' ' || COALESCE(f.codigo_postal, '')) as address,
        f.data_nascimento as "birthDate",
        d.nome as department,
        f.cargo as role,
        NULL as "avatarUrl",
        (
          SELECT h.data_inicio
          FROM historico_empresas h
          WHERE h.id_fun = f.id_fun
          AND h.nome_empresa = 'bd054'
          ORDER BY h.data_inicio DESC
          LIMIT 1
        ) as "admissionDate"
      FROM funcionarios f
      LEFT JOIN departamentos d ON f.id_depart = d.id_depart
      WHERE f.id_fun = $1
    `, [id]);

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    const employee = employeeResult.rows[0];

    // Buscar dados financeiros (salário mais recente)
    const financialsResult = await pool.query(`
      SELECT
        s.salario_bruto as "baseSalaryGross"
      FROM salario s
      INNER JOIN remuneracoes r ON s.id_fun = r.id_fun AND s.data_inicio = r.data_inicio
      WHERE s.id_fun = $1
      AND (r.data_fim IS NULL OR r.data_fim >= CURRENT_DATE)
      ORDER BY s.data_inicio DESC
      LIMIT 1
    `, [id]);

    // 3. Buscar benefícios atuais - buscar os mais recentes para cada tipo
    const benefitsResult = await pool.query(`
      SELECT DISTINCT ON (b.tipo)
        CONCAT(b.id_fun::text, '-', b.tipo, '-', b.data_inicio) as id,
        b.tipo as type,
        b.valor as value,
        b.data_inicio
      FROM beneficios b
      WHERE b.id_fun = $1
      ORDER BY b.tipo, b.data_inicio DESC
    `, [id]);
    
    console.log(`📋 Benefícios encontrados para funcionário ${id}:`, benefitsResult.rows.length);

    // 4. Buscar histórico salarial
    const salaryHistoryResult = await pool.query(`
      SELECT
        s.data_inicio as date,
        s.salario_bruto as amount,
        'Atualização salarial' as reason
      FROM salario s
      WHERE s.id_fun = $1
      ORDER BY s.data_inicio DESC
    `, [id]);

    // Buscar férias (calcular total de dias permitidos e usados)
    const vacationsResult = await pool.query(`
      SELECT
        22 as "totalDays",
        COALESCE(SUM(CASE WHEN f.estado_aprov = 'Aprovado' THEN f.num_dias ELSE 0 END), 0) as "usedDays"
      FROM ferias f
      WHERE f.id_fun = $1
      AND EXTRACT(YEAR FROM f.data_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [id]);

    // 6. Buscar histórico de férias
    const vacationHistoryResult = await pool.query(`
      SELECT
        f.data_inicio as "startDate",
        f.data_fim as "endDate",
        f.num_dias as "daysUsed",
        f.estado_aprov as status
      FROM ferias f
      WHERE f.id_fun = $1
      ORDER BY f.data_inicio DESC
    `, [id]);

    // 7. Buscar formações
    const trainingsResult = await pool.query(`
      SELECT
        form.id_for as id,
        form.nome_formacao as title,
        tf.data_inicio as "startDate",
        tf.data_fim as "endDate",
        form.estado as status,
        'Empresa' as provider
      FROM teve_formacao tf
      INNER JOIN formacoes form ON tf.id_for = form.id_for
      WHERE tf.id_fun = $1
      ORDER BY tf.data_inicio DESC
    `, [id]);

    // 8. Buscar avaliações
    const evaluationsResult = await pool.query(`
      SELECT
        CONCAT(a.id_fun::text, '-', a.data, '-', COALESCE(a.id_avaliador, 0)) as id,
        a.data as date,
        a.avaliacao_numerica as score,
        (favaliador.primeiro_nome || ' ' || favaliador.ultimo_nome) as reviewer,
        a.criterios as comments,
        a.autoavaliacao as "selfEvaluation",
        true as "hasDocument",
        CASE 
          WHEN a.id_avaliador = a.id_fun THEN 'Self'
          ELSE 'Manager'
        END as type
      FROM avaliacoes a
      LEFT JOIN funcionarios favaliador ON a.id_avaliador = favaliador.id_fun
      WHERE a.id_fun = $1
      ORDER BY a.data DESC
    `, [id]);
    
    console.log(`📋 Avaliações encontradas para funcionário ${id}:`, evaluationsResult.rows.length);

    // 9. Buscar histórico profissional
    const jobHistoryResult = await pool.query(`
      SELECT
        h.nome_empresa as company,
        h.cargo as role,
        h.data_inicio as "startDate",
        h.data_fim as "endDate",
        (h.nome_empresa = 'Empresa Atual') as "isInternal"
      FROM historico_empresas h
      WHERE h.id_fun = $1
      ORDER BY h.data_inicio DESC
    `, [id]);

    // 10. Buscar dependentes
    const dependentsResult = await pool.query(`
      SELECT
        d.nome as name,
        d.parentesco as relationship,
        d.data_nascimento as "birthDate"
      FROM dependentes d
      WHERE d.id_fun = $1
    `, [id]);

    // 11. Buscar faltas
    const absencesResult = await pool.query(`
      SELECT
        f.data as date,
        f.justificacao as reason,
        (f.justificacao IS NOT NULL AND f.justificacao != '') as justified
      FROM faltas f
      WHERE f.id_fun = $1
      ORDER BY f.data DESC
    `, [id]);

    // Montar objeto completo Employee
    const baseSalaryGross = parseFloat(financialsResult.rows[0]?.baseSalaryGross) || 0;
    const netSalary = baseSalaryGross * 0.77;
    const deductions = baseSalaryGross - netSalary;
    
    const fullEmployee = {
      id: employee.id.toString(),
      ...employee,
      avatarUrl: undefined, // Não existe na BD
      financials: {
        baseSalaryGross: baseSalaryGross,
        netSalary: netSalary,
        deductions: deductions,
        benefits: benefitsResult.rows.map(b => ({
          ...b,
          value: parseFloat(b.value)
        })),
        history: salaryHistoryResult.rows
      },
      vacations: {
        totalDays: vacationsResult.rows[0]?.totalDays || 22,
        usedDays: vacationsResult.rows[0]?.usedDays || 0,
        history: vacationHistoryResult.rows.map(v => ({
          ...v,
          status: mapVacationStatus(v.status)
        }))
      },
      trainings: trainingsResult.rows,
      evaluations: evaluationsResult.rows,
      jobHistory: jobHistoryResult.rows,
      dependents: dependentsResult.rows.map(d => ({
        id: `${id}-${d.name}`,
        ...d
      })),
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
    // Separar o nome completo em primeiro e último nome
    const nameParts = employeeData.fullName?.split(' ') || ['', ''];
    const primeiroNome = nameParts[0] || '';
    const ultimoNome = nameParts.slice(1).join(' ') || '';

    // Separar o endereço em rua, localidade e código postal
    const addressParts = employeeData.address?.split(',') || ['', ''];
    const nomeRua = addressParts[0]?.trim() || '';
    const localidadeParts = addressParts[1]?.trim().split(' ') || [''];
    const nomeLocalidade = localidadeParts.slice(0, -1).join(' ') || '';
    const codigoPostal = localidadeParts[localidadeParts.length - 1] || '';

    // Buscar o ID do departamento
    const departResult = await pool.query(`
      SELECT id_depart FROM departamentos WHERE nome = $1
    `, [employeeData.department]);

    const idDepart = departResult.rows[0]?.id_depart || null;

    // Gerar próximo ID de funcionário
    const maxIdResult = await pool.query(`
      SELECT COALESCE(MAX(id_fun), 0) + 1 as next_id FROM funcionarios
    `);
    const nextId = maxIdResult.rows[0].next_id;

    const result = await pool.query(`
      INSERT INTO funcionarios (
        id_fun, nif, primeiro_nome, ultimo_nome, email, num_telemovel,
        nome_rua, nome_localidade, codigo_postal,
        data_nascimento, cargo, id_depart
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id_fun as id
    `, [
      nextId,
      employeeData.nif,
      primeiroNome,
      ultimoNome,
      employeeData.email,
      employeeData.phone,
      nomeRua,
      nomeLocalidade,
      codigoPostal,
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
    // Separar o nome completo em primeiro e último nome
    const nameParts = employeeData.fullName?.split(' ') || ['', ''];
    const primeiroNome = nameParts[0] || '';
    const ultimoNome = nameParts.slice(1).join(' ') || '';

    // Separar o endereço em rua, localidade e código postal
    const addressParts = employeeData.address?.split(',') || ['', ''];
    const nomeRua = addressParts[0]?.trim() || '';
    const localidadeParts = addressParts[1]?.trim().split(' ') || [''];
    const nomeLocalidade = localidadeParts.slice(0, -1).join(' ') || '';
    const codigoPostal = localidadeParts[localidadeParts.length - 1] || '';

    // Buscar o ID do departamento
    const departResult = await pool.query(`
      SELECT id_depart FROM departamentos WHERE nome = $1
    `, [employeeData.department]);

    const idDepart = departResult.rows[0]?.id_depart || null;

    const result = await pool.query(`
      UPDATE funcionarios
      SET
        primeiro_nome = $1,
        ultimo_nome = $2,
        email = $3,
        num_telemovel = $4,
        nome_rua = $5,
        nome_localidade = $6,
        codigo_postal = $7,
        id_depart = $8,
        cargo = $9
      WHERE id_fun = $10
      RETURNING id_fun as id
    `, [
      primeiroNome,
      ultimoNome,
      employeeData.email,
      employeeData.phone,
      nomeRua,
      nomeLocalidade,
      codigoPostal,
      idDepart,
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
      DELETE FROM funcionarios
      WHERE id_fun = $1
      RETURNING id_fun as id
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
