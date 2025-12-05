import { Pool, PoolClient } from 'pg';
import { dbConfig } from '../config/database';
import format from 'pg-format';

export class PostgresService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(dbConfig);
    
    // Log de conexão
    this.pool.on('connect', () => {
      console.log('✅ Conectado ao PostgreSQL');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Erro na conexão PostgreSQL:', err);
    });
  }

  async connect(): Promise<PoolClient> {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('Erro ao conectar ao PostgreSQL:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const queryText = format(
      'INSERT INTO %I (%s) VALUES (%L) RETURNING *',
      table,
      columns.join(', '),
      values
    );

    return this.query(queryText);
  }

  async select(table: string, where?: Record<string, any>, limit?: number): Promise<any[]> {
    let queryText = `SELECT * FROM ${table}`;
    const params: any[] = [];

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map((key, index) => {
        params.push(where[key]);
        return `${key} = $${index + 1}`;
      });
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (limit) {
      queryText += ` LIMIT ${limit}`;
    }

    const result = await this.query(queryText, params);
    return result.rows;
  }

  async update(table: string, id: string, data: Record<string, any>): Promise<any> {
    const updates = Object.keys(data).map((key, index) => {
      return `${key} = $${index + 1}`;
    });
    
    const values = Object.values(data);
    values.push(id);

    const queryText = `
      UPDATE ${table} 
      SET ${updates.join(', ')} 
      WHERE id = $${values.length} 
      RETURNING *
    `;

    return this.query(queryText, values);
  }

  async delete(table: string, id: string): Promise<any> {
    const queryText = 'DELETE FROM ${table} WHERE id = $1 RETURNING *';
    return this.query(queryText, [id]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Instância singleton
export const postgresService = new PostgresService();