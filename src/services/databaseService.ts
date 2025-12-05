import { VectorService } from './vectorService';
import { postgresService } from './postgresService';
import { DatabaseInitializer } from '../scripts/initDatabase';

export interface DatabaseRecord {
  id: string;
  type: 'classroom' | 'professor' | 'schedule' | 'contact';
  data: any;
  embedding_text: string;
}

export class DatabaseService {
  private vectorService: VectorService | null = null;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Inicializar tabelas e dados
      await DatabaseInitializer.initializeTables();
      await DatabaseInitializer.seedInitialData();
      
      // Inicializar serviço vetorial
      await this.initializeVectorService();
    } catch (error) {
      console.error('Erro na inicialização do banco:', error);
    }
  }

  private async initializeVectorService() {
    try {
      this.vectorService = await VectorService.getInstance();
      
      // Indexar dados existentes
      await this.indexExistingData();
    } catch (error) {
      console.warn('Vector service initialization failed:', error);
    }
  }

  private async indexExistingData() {
    if (!this.vectorService) return;

    const records = await this.fetchAllRecords();
    const indexData = records.map(record => ({
      type: record.type,
      id: record.id,
      text: record.embedding_text
    }));

    await this.vectorService.indexData(indexData);
  }

  async fetchAllRecords(): Promise<DatabaseRecord[]> {
    try {
      const [classrooms, professors, schedules, contacts] = await Promise.all([
        postgresService.select('classrooms'),
        postgresService.select('professors'),
        postgresService.select('schedules'),
        postgresService.select('contacts')
      ]);

      const records: DatabaseRecord[] = [];

      // Converter salas de aula
      classrooms.forEach((classroom: any) => {
        records.push({
          id: classroom.id,
          type: 'classroom',
          data: classroom,
          embedding_text: this.generateEmbeddingText(classroom, 'classroom')
        });
      });

      // Converter professores
      professors.forEach((professor: any) => {
        records.push({
          id: professor.id,
          type: 'professor',
          data: professor,
          embedding_text: this.generateEmbeddingText(professor, 'professor')
        });
      });

      // Converter horários
      schedules.forEach((schedule: any) => {
        records.push({
          id: schedule.id,
          type: 'schedule',
          data: schedule,
          embedding_text: this.generateEmbeddingText(schedule, 'schedule')
        });
      });

      // Converter contatos
      contacts.forEach((contact: any) => {
        records.push({
          id: contact.id,
          type: 'contact',
          data: contact,
          embedding_text: this.generateEmbeddingText(contact, 'contact')
        });
      });

      return records;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      return [];
    }
  }

  private generateEmbeddingText(data: any, type: string): string {
    switch (type) {
      case 'classroom':
        return `${data.name} ${data.building} ${data.floor} ${data.description} ${data.equipment?.join(' ') || ''}`;
      
      case 'professor':
        return `${data.name} ${data.email} ${data.department} ${data.position} ${data.phone || ''} ${data.office || ''}`;
      
      case 'schedule':
        return `${data.subject} ${data.professor} ${data.classroom} ${data.time} ${data.days.join(' ')} ${data.career}`;
      
      case 'contact':
        return `${data.area} ${data.email} ${data.phone} ${data.location} ${data.hours}`;
      
      default:
        return JSON.stringify(data);
    }
  }

  async semanticSearch(query: string): Promise<DatabaseRecord[]> {
    // Implementação da busca semântica...
    // (mesma lógica do exemplo anterior)
    return [];
  }

  // Métodos para operações CRUD
  async addClassroom(classroom: any): Promise<void> {
    await postgresService.insert('classrooms', classroom);
  }

  async getProfessorsByDepartment(department: string): Promise<any[]> {
    return postgresService.select('professors', { department });
  }

  async getSchedulesBySubject(subject: string): Promise<any[]> {
    return postgresService.select('schedules', { subject });
  }

  async searchContactsByArea(area: string): Promise<any[]> {
    return postgresService.select('contacts', { area });
  }
}