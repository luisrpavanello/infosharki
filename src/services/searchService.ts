import { classrooms, professors, schedules, contacts } from '../data/universityData';

export class SearchService {
  // Função para normalizar texto (remover acentos e converter para minúsculas)
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .trim();
  }

  static searchClassrooms(query: string) {
    if (!query.trim()) return classrooms;
    
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
      // Remove títulos como "Dr.", "Ing.", etc. para busca mais flexível
      const cleanName = professor.name.replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mg\.)\s*/i, '');
      const normalizedCleanName = this.normalizeText(cleanName);
      
      // Divide o nome em palavras para busca exata
      const nameWords = normalizedCleanName.split(/\s+/);
      const fullNameWords = this.normalizeText(professor.name).split(/\s+/);
      
      // Busca exata por palavras no nome limpo
      const matchesExactName = nameWords.some(word => word === normalizedQuery);
      
      // Busca exata por palavras no nome completo
      const matchesExactFullName = fullNameWords.some(word => word === normalizedQuery);
      
      // Busca parcial apenas para queries com mais de 2 caracteres
      const matchesPartialName = normalizedQuery.length > 2 && 
        (normalizedCleanName.includes(normalizedQuery) || 
         this.normalizeText(professor.name).includes(normalizedQuery));
      
      // Busca em outros campos
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

  static processQuery(query: string): string {
    const normalizedQuery = this.normalizeText(query);

    // Busca em todas as categorias
    const classroomResults = this.searchClassrooms(query);
    const professorResults = this.searchProfessors(query);
    const scheduleResults = this.searchSchedules(query);
    const contactResults = this.searchContacts(query);

    console.log('Debug - Busca:', query, 'Normalizada:', normalizedQuery);
    console.log('Debug - Professores encontrados:', professorResults.map(p => p.name));

    // Se a busca é muito curta (menos de 3 caracteres), só mostra resultados exatos
    if (normalizedQuery.length < 3) {
      const exactProfessorResults = professorResults.filter(professor => {
        const cleanName = professor.name.replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mg\.)\s*/i, '');
        const normalizedCleanName = this.normalizeText(cleanName);
        const nameWords = normalizedCleanName.split(/\s+/);
        return nameWords.some(word => word === normalizedQuery);
      });

      if (exactProfessorResults.length > 0) {
        return this.formatProfessorResults(exactProfessorResults);
      }
      
      // Se não encontrou resultados exatos para busca curta, mostra mensagem
      if (professorResults.length > 0 || classroomResults.length > 0 || scheduleResults.length > 0 || contactResults.length > 0) {
        return `La búsqueda "${query}" es muy corta. Por favor, usa al menos 3 caracteres o un nombre completo para obtener resultados más precisos.`;
      }
    }

    // Se encontrou resultados em apenas uma categoria, mostra essa
    const nonEmptyCategories = [
      { type: 'professors', results: professorResults },
      { type: 'classrooms', results: classroomResults },
      { type: 'schedules', results: scheduleResults },
      { type: 'contacts', results: contactResults }
    ].filter(cat => cat.results.length > 0);

    if (nonEmptyCategories.length === 1) {
      const category = nonEmptyCategories[0];
      switch (category.type) {
        case 'professors':
          return this.formatProfessorResults(professorResults);
        case 'classrooms':
          return this.formatClassroomResults(classroomResults);
        case 'schedules':
          return this.formatScheduleResults(scheduleResults);
        case 'contacts':
          return this.formatContactResults(contactResults);
      }
    }

    // Se há palavras-chave específicas, prioriza essas categorias
    if (normalizedQuery.includes('profesor') || normalizedQuery.includes('correo') || normalizedQuery.includes('email') || (professorResults.length > 0 && this.looksLikeFullName(query))) {
      if (professorResults.length > 0) {
        return this.formatProfessorResults(professorResults);
      }
    }

    if (normalizedQuery.includes('aula') || normalizedQuery.includes('salon') || normalizedQuery.includes('clase') || query.match(/\b\d{3}\b/)) {
      if (classroomResults.length > 0) {
        return this.formatClassroomResults(classroomResults);
      }
    }

    if (normalizedQuery.includes('horario') || normalizedQuery.includes('materia') || normalizedQuery.includes('clase')) {
      if (scheduleResults.length > 0) {
        return this.formatScheduleResults(scheduleResults);
      }
    }

    if (normalizedQuery.includes('contacto') || normalizedQuery.includes('telefono') || normalizedQuery.includes('secretaria') || normalizedQuery.includes('admision')) {
      if (contactResults.length > 0) {
        return this.formatContactResults(contactResults);
      }
    }

    // Se não encontrou nada
    const allResults = [
      ...classroomResults,
      ...professorResults,
      ...scheduleResults,
      ...contactResults
    ];

    if (allResults.length === 0) {
      return `No encontré resultados para "${query}". ¿Puedes intentar con otros términos? Puedo ayudarte con:
• Búsqueda de aulas (ej: "Aula 101", "Laboratorio")
• Correos de profesores (ej: "Carlos López", "Roberto")
• Horarios de materias (ej: "Programación", "Lunes")
• Contactos de áreas (ej: "Admisiones", "Biblioteca")`;
    }

    // Se encontrou resultados em múltiplas categorias
    return this.formatMixedResults(classroomResults, professorResults, scheduleResults, contactResults, query);
  }

  // Método para acciones rápidas
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

  // Helper mejorado para detectar si parece un nombre completo
  private static looksLikeFullName(query: string): boolean {
    const words = query.trim().split(/\s+/);
    // Solo considera como nombre si tiene al menos 2 palabras y cada una tiene más de 2 caracteres
    return words.length >= 2 && words.every(word => word.length > 2);
  }

  // Método para resultados mixtos
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