import { postgresService } from '../services/postgresService';

export class DatabaseInitializer {
  static async testConnection(): Promise<boolean> {
    try {
      const result = await postgresService.query('SELECT 1 as connection_test');
      console.log('✅ Conexão PostgreSQL OK:', result.rows[0]);
      return true;
    } catch (error: any) {
      console.warn('❌ Falha na conexão PostgreSQL:', error.message);
      return false;
    }
  }

  static async getDataFromTable(table: string): Promise<any[]> {
    try {
      const result = await postgresService.query(`SELECT * FROM ${table}`);
      console.log(`✅ Dados da tabela ${table}:`, result.rows.length, 'registros');
      return result.rows;
    } catch (error: any) {
      console.warn(`❌ Erro ao buscar dados da tabela ${table}:`, error.message);
      return [];
    }
  }
}