import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET /api/recruitment/jobs - Listar todas as vagas
export async function getAllJobs(req: Request, res: Response) {
  try {
    console.log('📊 Buscando vagas...');
    
    const result = await pool.query(`
      SELECT
        v.id_vaga as id,
        d.nome as title,
        d.nome as department,
        v.data_abertura as "openDate",
        CASE 
          WHEN v.estado = 'Aberta' THEN 'Open'
          WHEN v.estado = 'Fechada' THEN 'Closed'
          WHEN v.estado = 'Suspensa' THEN 'Suspended'
          ELSE v.estado
        END as status,
        'Vaga para o departamento de ' || d.nome as description
      FROM vagas v
      INNER JOIN departamentos d ON v.id_depart = d.id_depart
      ORDER BY v.data_abertura DESC
    `);

    // Buscar requisitos para cada vaga
    const jobsWithRequirements = await Promise.all(
      result.rows.map(async (job) => {
        const reqResult = await pool.query(`
          SELECT requisito
          FROM requisitos_vaga
          WHERE id_vaga = $1
        `, [job.id]);
        
        return {
          ...job,
          requirements: reqResult.rows.map(r => r.requisito)
        };
      })
    );

    console.log(`✅ Encontradas ${jobsWithRequirements.length} vagas`);
    res.json(jobsWithRequirements);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({
      error: 'Erro ao buscar vagas',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/recruitment/jobs/:id - Buscar vaga por ID
export async function getJobById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        v.id_vaga as id,
        d.nome as title,
        d.nome as department,
        v.data_abertura as "openDate",
        v.estado as status,
        d.nome as description,
        ARRAY_AGG(r.requisito) FILTER (WHERE r.requisito IS NOT NULL) as requirements
      FROM vagas v
      INNER JOIN departamentos d ON v.id_depart = d.id_depart
      LEFT JOIN requisitos_vaga r ON v.id_vaga = r.id_vaga
      WHERE v.id_vaga = $1
      GROUP BY v.id_vaga, d.nome, v.data_abertura, v.estado
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({
      error: 'Erro ao buscar vaga',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/recruitment/candidates - Listar todos os candidatos
export async function getAllCandidates(req: Request, res: Response) {
  try {
    console.log('📊 Buscando candidatos...');
    
    const result = await pool.query(`
      SELECT
        c.id_cand as id,
        ca.id_vaga as "jobId",
        c.nome as name,
        c.email,
        c.telemovel as phone,
        CASE 
          WHEN ca.estado = 'Submetido' THEN 'Applied'
          WHEN ca.estado = 'Em análise' THEN 'Screening'
          WHEN ca.estado = 'Entrevista' THEN 'Interview'
          WHEN ca.estado = 'Rejeitado' THEN 'Rejected'
          WHEN ca.estado = 'Contratado' THEN 'Hired'
          ELSE ca.estado
        END as status,
        ca.data_cand as "appliedDate",
        ca.id_recrutador as "recruiterId",
        NULL as "cvUrl",
        NULL as "coverLetter"
      FROM candidatos c
      LEFT JOIN candidato_a ca ON c.id_cand = ca.id_cand
      ORDER BY ca.data_cand DESC NULLS LAST
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    res.status(500).json({
      error: 'Erro ao buscar candidatos',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/recruitment/jobs/:jobId/candidates - Candidatos de uma vaga
export async function getCandidatesByJob(req: Request, res: Response) {
  const { jobId } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        c.id_cand as id,
        ca.id_vaga as "jobId",
        c.nome as name,
        c.email,
        c.telemovel as phone,
        ca.estado as status,
        ca.data_cand as "appliedDate",
        ca.id_recrutador as "recruiterId"
      FROM candidato_a ca
      INNER JOIN candidatos c ON ca.id_cand = c.id_cand
      WHERE ca.id_vaga = $1
      ORDER BY ca.data_cand DESC
    `, [jobId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    res.status(500).json({
      error: 'Erro ao buscar candidatos',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// PUT /api/recruitment/candidates/:id/status - Atualizar status do candidato
export async function updateCandidateStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status, jobId } = req.body;

  try {
    const result = await pool.query(`
      UPDATE candidato_a
      SET estado = $1
      WHERE id_cand = $2 AND id_vaga = $3
      RETURNING id_cand as id
    `, [status, id, jobId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado' });
    }

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      error: 'Erro ao atualizar status',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
