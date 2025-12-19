import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET /api/departments - Listar todos os departamentos
export async function getAllDepartments(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        d.id_depart as id,
        d.nome as name,
        d.id_gerente as "managerId",
        (f.primeiro_nome || ' ' || f.ultimo_nome) as "managerName",
        d.nome as description
      FROM departamentos d
      LEFT JOIN funcionarios f ON d.id_gerente = f.id_fun
      ORDER BY d.id_depart
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    res.status(500).json({
      error: 'Erro ao buscar departamentos',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/departments/:id - Buscar departamento por ID
export async function getDepartmentById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        d.id_depart as id,
        d.nome as name,
        d.id_gerente as "managerId",
        (f.primeiro_nome || ' ' || f.ultimo_nome) as "managerName",
        d.nome as description
      FROM departamentos d
      LEFT JOIN funcionarios f ON d.id_gerente = f.id_fun
      WHERE d.id_depart = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departamento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar departamento:', error);
    res.status(500).json({
      error: 'Erro ao buscar departamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// GET /api/departments/:id/employees - Listar colaboradores de um departamento
export async function getDepartmentEmployees(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        f.id_fun as id,
        (f.primeiro_nome || ' ' || f.ultimo_nome) as "fullName",
        f.email,
        f.cargo as role
      FROM funcionarios f
      WHERE f.id_depart = $1
      ORDER BY f.primeiro_nome, f.ultimo_nome
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar colaboradores do departamento:', error);
    res.status(500).json({
      error: 'Erro ao buscar colaboradores',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
