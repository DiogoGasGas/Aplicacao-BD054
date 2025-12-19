import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET /api/evaluations - Listar todas as avaliações
export async function getAllEvaluations(req: Request, res: Response) {
  try {
    console.log('📊 Buscando avaliações...');
    
    const result = await pool.query(`
      SELECT
        a.id_fun as "employeeId",
        a.data as date,
        a.avaliacao_numerica as score,
        (favaliador.primeiro_nome || ' ' || favaliador.ultimo_nome) as reviewer,
        a.criterios as comments,
        a.autoavaliacao as "selfEvaluation",
        NULL as "documentUrl",
        CASE 
          WHEN a.id_avaliador = a.id_fun THEN 'Self'
          ELSE 'Manager'
        END as type
      FROM avaliacoes a
      LEFT JOIN funcionarios favaliador ON a.id_avaliador = favaliador.id_fun
      ORDER BY a.data DESC
    `);

    const evaluations = result.rows.map(row => ({
      id: `${row.employeeId}-${row.date}`,
      employeeId: row.employeeId.toString(),
      date: row.date,
      score: row.score,
      reviewer: row.reviewer,
      comments: row.comments,
      selfEvaluation: row.selfEvaluation,
      documentUrl: row.documentUrl,
      type: row.type
    }));

    console.log(`✅ Encontradas ${evaluations.length} avaliações`);
    res.json(evaluations);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({
      error: 'Erro ao buscar avaliações',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/evaluations/employee/:employeeId - Avaliações de um colaborador
export async function getEvaluationsByEmployee(req: Request, res: Response) {
  const { employeeId } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        a.data as date,
        a.avaliacao_numerica as score,
        (favaliador.primeiro_nome || ' ' || favaliador.ultimo_nome) as reviewer,
        a.criterios as comments,
        a.autoavaliacao as "selfEvaluation",
        NULL as "documentUrl",
        'Avaliação de Desempenho' as type
      FROM avaliacoes a
      LEFT JOIN funcionarios favaliador ON a.id_avaliador = favaliador.id_fun
      WHERE a.id_fun = $1
      ORDER BY a.data DESC
    `, [employeeId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({
      error: 'Erro ao buscar avaliações',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// POST /api/evaluations - Criar nova avaliação
export async function createEvaluation(req: Request, res: Response) {
  const { employeeId, date, score, reviewerId, comments, selfEvaluation, type } = req.body;

  try {
    await pool.query(`
      INSERT INTO avaliacoes (
        id_fun, id_avaliador, data, avaliacao_numerica, criterios, autoavaliacao
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [employeeId, reviewerId, date, score, comments, selfEvaluation]);

    res.status(201).json({
      message: 'Avaliação criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({
      error: 'Erro ao criar avaliação',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
