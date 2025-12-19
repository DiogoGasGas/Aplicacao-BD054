import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET /api/trainings - Listar todos os programas de formação
export async function getAllTrainings(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        f.id_for as id,
        f.nome_formacao as title,
        f.descricao as description,
        f.data_inicio as "startDate",
        f.data_fim as "endDate",
        f.estado as status,
        'Empresa' as provider
      FROM formacoes f
      ORDER BY f.data_inicio DESC
    `);

    // Para cada programa, buscar colaboradores inscritos
    const trainingsWithEnrollments = await Promise.all(
      result.rows.map(async (training) => {
        const enrollments = await pool.query(`
          SELECT id_fun as employee_id
          FROM teve_formacao
          WHERE id_for = $1
        `, [training.id]);

        return {
          ...training,
          enrolledEmployeeIds: enrollments.rows.map(e => e.employee_id)
        };
      })
    );

    res.json(trainingsWithEnrollments);
  } catch (error) {
    console.error('Erro ao buscar formações:', error);
    res.status(500).json({
      error: 'Erro ao buscar formações',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/trainings/:id - Buscar formação por ID
export async function getTrainingById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        f.id_for as id,
        f.nome_formacao as title,
        f.descricao as description,
        f.data_inicio as "startDate",
        f.data_fim as "endDate",
        f.estado as status,
        'Empresa' as provider
      FROM formacoes f
      WHERE f.id_for = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formação não encontrada' });
    }

    const training = result.rows[0];

    // Buscar colaboradores inscritos
    const enrollments = await pool.query(`
      SELECT id_fun as employee_id
      FROM teve_formacao
      WHERE id_for = $1
    `, [id]);

    res.json({
      ...training,
      enrolledEmployeeIds: enrollments.rows.map(e => e.employee_id)
    });
  } catch (error) {
    console.error('Erro ao buscar formação:', error);
    res.status(500).json({
      error: 'Erro ao buscar formação',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// POST /api/trainings/:id/enroll - Inscrever colaborador numa formação
export async function enrollEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const { employeeId } = req.body;

  try {
    // Verificar se a formação existe
    const trainingResult = await pool.query(`
      SELECT data_inicio, data_fim FROM formacoes WHERE id_for = $1
    `, [id]);

    if (trainingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Formação não encontrada' });
    }

    const { data_inicio, data_fim } = trainingResult.rows[0];

    await pool.query(`
      INSERT INTO teve_formacao (id_fun, id_for, data_inicio, data_fim, certificado)
      VALUES ($1, $2, $3, $4, NULL)
      ON CONFLICT (id_fun, id_for) DO NOTHING
    `, [employeeId, id, data_inicio, data_fim]);

    res.json({ message: 'Colaborador inscrito com sucesso' });
  } catch (error) {
    console.error('Erro ao inscrever colaborador:', error);
    res.status(500).json({
      error: 'Erro ao inscrever colaborador',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
