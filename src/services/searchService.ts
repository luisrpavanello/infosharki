// src/services/searchService.ts
import { DatabaseService } from './databaseService';
import { classrooms, professors, schedules, contacts } from '../data/universityData';

export class SearchService {
  private static dbService: DatabaseService | null = null;
  private static isInitialized = false;

  // Função para normalizar texto (mantida para compatibilidade)
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Inicializar o serviço de banco
  static async initialize() {
    if (!this.isInitialized) {
      try {
        this.dbService = new DatabaseService();
        await this.dbService.initializeData();
        this.isInitialized = true;
        console.log('Vector search service initialized');
      } catch (error) {
        console.warn('Vector service failed, falling back to traditional search:', error);
        this.isInitialized = false;
      }
    }
  }

  static async processQuery(query: string): Promise<string> {
    // Tentar usar busca vetorial se disponível
    if (this.dbService && this.isInitialized) {
      try {
        const results = await this.dbService.semanticSearch(query);
        
        const classrooms = results.filter(r => r.type === 'classroom').map(r => r.data);
        const professors = results.filter(r => r.type === 'professor').map(r => r.data);
        const schedules = results.filter(r => r.type === 'schedule').map(r => r.data);
        const contacts = results.filter(r => r.type === 'contact').map(r => r.data);

        if (classrooms.length > 0 || professors.length > 0 || schedules.length > 0 || contacts.length > 0) {
          return this.formatMixedResults(classrooms, professors, schedules, contacts, query);
        }
      } catch (error) {
        console.warn('Vector search failed, falling back to traditional search:', error);
      }
    }

    // Fallback para busca tradicional
    return this.traditionalSearch(query);
  }

  // Busca tradicional (métodos originais)
  private static traditionalSearch(query: string): string {
    const normalizedQuery = this.normalizeText(query);

    const classroomResults = this.searchClassrooms(query);
    const professorResults = this.searchProfessors(query);
    const scheduleResults = this.searchSchedules(query);
    const contactResults = this.searchContacts(query);

    // ... resto da lógica original de processamento
    if (classroomResults.length === 0 && professorResults.length === 0 && 
        scheduleResults.length === 0 && contactResults.length === 0) {
      return `No encontré resultados para "${query}". ¿Puedes intentar con otros términos?`;
    }

    return this.formatMixedResults(classroomResults, professorResults, scheduleResults, contactResults, query);
  }

  // Manter todos os métodos de busca originais...
  static async searchClassrooms(query: string) {
    if (!query.trim()) {
      // Buscar todas as salas do PostgreSQL
      try {
        const dbService = new DatabaseService();
        const records = await dbService.fetchAllRecords();
        return records.filter(r => r.type === 'classroom').map(r => r.data);
      } catch (error) {
        console.warn('PostgreSQL failed, using local data:', error);
        return classrooms; // Fallback para dados locais
      }
    }
    
    const normalizedQuery = this.normalizeText(query);
    return classrooms.filter(classroom => 
      this.normalizeText(classroom.name).includes(normalizedQuery) ||
      this.normalizeText(classroom.building).includes(normalizedQuery) ||
      this.normalizeText(classroom.floor).includes(normalizedQuery) ||
      this.normalizeText(classroom.description).includes(normalizedQuery) ||
      (classroom.equipment && classroom.equipment.some(equip => 
        this.normalizeText(equip).includes(normalizedQuery)
      ))
    );
  }

  static searchProfessors(query: string) {
    if (!query.trim()) return professors;
    
    const normalizedQuery = this.normalizeText(query);
    return professors.filter(professor => {
      const cleanName = professor.name.replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mg\.)\s*/i, '');
      const normalizedCleanName = this.normalizeText(cleanName);
      
      const nameWords = normalizedCleanName.split(/\s+/);
      const fullNameWords = this.normalizeText(professor.name).split(/\s+/);
      
      const matchesExactName = nameWords.some(word => word === normalizedQuery);
      const matchesExactFullName = fullNameWords.some(word => word === normalizedQuery);
      const matchesPartialName = normalizedQuery.length > 2 && 
        (normalizedCleanName.includes(normalizedQuery) || 
         this.normalizeText(professor.name).includes(normalizedQuery));
      const matchesOtherFields = 
        this.normalizeText(professor.department).includes(normalizedQuery) ||
        this.normalizeText(professor.email).includes(normalizedQuery) ||
        (professor.position && this.normalizeText(professor.position).includes(normalizedQuery));

      return matchesExactName || matchesExactFullName || matchesPartialName || matchesOtherFields;
    });
  }

  static searchSchedules(query: string) {
    if (!query.trim()) return schedules;
    
    const normalizedQuery = this.normalizeText(query);
    return schedules.filter(schedule => 
      this.normalizeText(schedule.subject).includes(normalizedQuery) ||
      this.normalizeText(schedule.professor).includes(normalizedQuery) ||
      this.normalizeText(schedule.classroom).includes(normalizedQuery) ||
      this.normalizeText(schedule.career).includes(normalizedQuery) ||
      schedule.days.some(day => this.normalizeText(day).includes(normalizedQuery)) ||
      this.normalizeText(schedule.time).includes(normalizedQuery)
    );
  }

  static searchContacts(query: string) {
    if (!query.trim()) return contacts;
    
    const normalizedQuery = this.normalizeText(query);
    return contacts.filter(contact => 
      this.normalizeText(contact.area).includes(normalizedQuery) ||
      this.normalizeText(contact.email).includes(normalizedQuery) ||
      this.normalizeText(contact.phone).includes(normalizedQuery) ||
      this.normalizeText(contact.location).includes(normalizedQuery) ||
      this.normalizeText(contact.hours).includes(normalizedQuery)
    );
  }

  // Métodos de formatação (mantidos da versão original)
  private static formatMixedResults(classrooms: any[], professors: any[], schedules: any[], contacts: any[], originalQuery: string): string {
    let result = `Encontré información relacionada con "${originalQuery}":\n\n`;

    if (professors.length > 0) {
      result += `👨‍🏫 **Profesores (${professors.length})**\n`;
      professors.slice(0, 3).forEach(prof => {
        result += `• ${prof.name} - ${prof.email}\n`;
      });
      if (professors.length > 3) result += `• ... y ${professors.length - 3} más\n`;
      result += '\n';
    }

    if (classrooms.length > 0) {
      result += `📍 **Aulas (${classrooms.length})**\n`;
      classrooms.slice(0, 3).forEach(room => {
        result += `• ${room.name} - ${room.description}\n`;
      });
      if (classrooms.length > 3) result += `• ... y ${classrooms.length - 3} más\n`;
      result += '\n';
    }

    if (schedules.length > 0) {
      result += `📅 **Horarios (${schedules.length})**\n`;
      schedules.slice(0, 2).forEach(sched => {
        result += `• ${sched.subject} - ${sched.time}\n`;
      });
      if (schedules.length > 2) result += `• ... y ${schedules.length - 2} más\n`;
      result += '\n';
    }

    if (contacts.length > 0) {
      result += `📞 **Contactos (${contacts.length})**\n`;
      contacts.slice(0, 2).forEach(contact => {
        result += `• ${contact.area} - ${contact.phone}\n`;
      });
      if (contacts.length > 2) result += `• ... y ${contacts.length - 2} más\n`;
    }

    result += '\n¿Sobre cuál categoría te gustaría más información?';
    return result;
  }

  // Métodos para ações rápidas (mantidos)
  static processQuickAction(actionId: string): string {
    switch (actionId) {
      case 'aulas':
        const allClassrooms = this.searchClassrooms('');
        return this.formatClassroomResults(allClassrooms);
      
      case 'correos':
        const allProfessors = this.searchProfessors('');
        return this.formatProfessorResults(allProfessors);
      
      case 'horarios':
        const allSchedules = this.searchSchedules('');
        return this.formatScheduleResults(allSchedules);
      
      case 'contactos':
        const allContacts = this.searchContacts('');
        return this.formatContactResults(allContacts);
      
      default:
        return "Acción no reconocida. ¿Podrías intentar de nuevo?";
    }
  }

  // Métodos de formatação individuais (mantidos)
  private static formatClassroomResults(classrooms: any[]): string {
    if (classrooms.length === 0) {
      return "No encontré aulas que coincidan con tu búsqueda.";
    }

    if (classrooms.length === 1) {
      const room = classrooms[0];
      return `📍 **${room.name}**\nUbicación: ${room.description}\nEdificio: ${room.building}\nPiso: ${room.floor}\nCapacidad: ${room.capacity} personas\nEquipamiento: ${room.equipment?.join(', ') || 'No especificado'}`;
    }

    let result = `Encontré ${classrooms.length} aulas:\n\n`;
    classrooms.forEach(room => {
      result += `📍 **${room.name}** - ${room.description}\n   Edificio: ${room.building} | Piso: ${room.floor}\n\n`;
    });
    return result;
  }

  private static formatProfessorResults(professors: any[]): string {
    if (professors.length === 0) {
      return "No encontré profesores que coincidan con tu búsqueda.";
    }

    if (professors.length === 1) {
      const prof = professors[0];
      return `👨‍🏫 **${prof.name}**\nEmail: ${prof.email}\nDepartamento: ${prof.department}\nCargo: ${prof.position}\nTeléfono: ${prof.phone || 'No disponible'}\nOficina: ${prof.office || 'No especificada'}`;
    }

    let result = `Encontré ${professors.length} profesores:\n\n`;
    professors.forEach(prof => {
      result += `👨‍🏫 **${prof.name}**\n   Email: ${prof.email}\n   Departamento: ${prof.department}\n\n`;
    });
    return result;
  }

  private static formatScheduleResults(schedules: any[]): string {
    if (schedules.length === 0) {
      return "No encontré horarios que coincidan con tu búsqueda.";
    }

    if (schedules.length === 1) {
      const sched = schedules[0];
      return `📅 **${sched.subject}**\nProfesor: ${sched.professor}\nAula: ${sched.classroom}\nHorario: ${sched.time}\nDías: ${sched.days.join(', ')}\nCarrera: ${sched.career}`;
    }

    let result = `Encontré ${schedules.length} horarios:\n\n`;
    schedules.forEach(sched => {
      result += `📅 **${sched.subject}**\n   Profesor: ${sched.professor}\n   Aula: ${sched.classroom}\n   Horario: ${sched.time} (${sched.days.join(', ')})\n\n`;
    });
    return result;
  }

  private static formatContactResults(contacts: any[]): string {
    if (contacts.length === 0) {
      return "No encontré información de contacto que coincida con tu búsqueda.";
    }

    if (contacts.length === 1) {
      const contact = contacts[0];
      return `📞 **${contact.area}**\nEmail: ${contact.email}\nTeléfono: ${contact.phone}\nUbicación: ${contact.location}\nHorarios: ${contact.hours}`;
    }

    let result = `Encontré ${contacts.length} contactos:\n\n`;
    contacts.forEach(contact => {
      result += `📞 **${contact.area}**\n   Email: ${contact.email}\n   Teléfono: ${contact.phone}\n   Ubicación: ${contact.location}\n\n`;
    });
    return result;
  }
}