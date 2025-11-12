import { classrooms, professors, schedules, contacts } from '../data/universityData';

export class SearchService {
  static searchClassrooms(query: string) {
    const lowerQuery = query.toLowerCase();
    return classrooms.filter(classroom => 
      classroom.name.toLowerCase().includes(lowerQuery) ||
      classroom.building.toLowerCase().includes(lowerQuery) ||
      classroom.description.toLowerCase().includes(lowerQuery)
    );
  }

  static searchProfessors(query: string) {
    const lowerQuery = query.toLowerCase();
    return professors.filter(professor => 
      professor.name.toLowerCase().includes(lowerQuery) ||
      professor.department.toLowerCase().includes(lowerQuery) ||
      professor.email.toLowerCase().includes(lowerQuery)
    );
  }

  static searchSchedules(query: string) {
    const lowerQuery = query.toLowerCase();
    return schedules.filter(schedule => 
      schedule.subject.toLowerCase().includes(lowerQuery) ||
      schedule.professor.toLowerCase().includes(lowerQuery) ||
      schedule.career.toLowerCase().includes(lowerQuery) ||
      schedule.classroom.toLowerCase().includes(lowerQuery)
    );
  }

  static searchContacts(query: string) {
    const lowerQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.area.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery)
    );
  }

  static processQuery(query: string): string {
    const lowerQuery = query.toLowerCase();

    // Detección de intenciones
    if (lowerQuery.includes('aula') || lowerQuery.includes('salon') || lowerQuery.includes('clase')) {
      const results = this.searchClassrooms(query);
      if (results.length > 0) {
        return this.formatClassroomResults(results);
      }
      return "No encontré aulas que coincidan con tu búsqueda. ¿Podrías ser más específico?";
    }

    if (lowerQuery.includes('correo') || lowerQuery.includes('email') || lowerQuery.includes('profesor') || lowerQuery.includes('docente')) {
      const results = this.searchProfessors(query);
      if (results.length > 0) {
        return this.formatProfessorResults(results);
      }
      return "No encontré profesores que coincidan con tu búsqueda. ¿Podrías verificar el nombre?";
    }

    if (lowerQuery.includes('horario') || lowerQuery.includes('materia') || lowerQuery.includes('clase')) {
      const results = this.searchSchedules(query);
      if (results.length > 0) {
        return this.formatScheduleResults(results);
      }
      return "No encontré horarios que coincidan con tu búsqueda. ¿Podrías especificar la materia o carrera?";
    }

    if (lowerQuery.includes('contacto') || lowerQuery.includes('telefono') || lowerQuery.includes('secretaria') || lowerQuery.includes('admision')) {
      const results = this.searchContacts(query);
      if (results.length > 0) {
        return this.formatContactResults(results);
      }
      return "No encontré información de contacto que coincida con tu búsqueda.";
    }

    // Búsqueda general
    const allResults = [
      ...this.searchClassrooms(query),
      ...this.searchProfessors(query),
      ...this.searchSchedules(query),
      ...this.searchContacts(query)
    ];

    if (allResults.length === 0) {
      return `No encontré resultados para "${query}". ¿Puedes intentar con otros términos? Puedo ayudarte con:
• Búsqueda de aulas (ej: "Aula 101")
• Correos de profesores (ej: "Carlos López")
• Horarios de materias (ej: "Programación I")
• Contactos de áreas (ej: "Admisiones")`;
    }

    return "Encontré información relacionada. ¿Podrías ser más específico sobre qué tipo de información necesitas?";
  }

  private static formatClassroomResults(classrooms: any[]): string {
    if (classrooms.length === 1) {
      const room = classrooms[0];
      return `📍 **${room.name}**
Ubicación: ${room.description}
Edificio: ${room.building}
Piso: ${room.floor}
Capacidad: ${room.capacity} personas
Equipamiento: ${room.equipment?.join(', ') || 'No especificado'}`;
    }

    let result = `Encontré ${classrooms.length} aulas:\n\n`;
    classrooms.forEach(room => {
      result += `📍 **${room.name}** - ${room.description}\n`;
    });
    return result;
  }

  private static formatProfessorResults(professors: any[]): string {
    if (professors.length === 1) {
      const prof = professors[0];
      return `👨‍🏫 **${prof.name}**
Email: ${prof.email}
Departamento: ${prof.department}
Cargo: ${prof.position}
Teléfono: ${prof.phone || 'No disponible'}
Oficina: ${prof.office || 'No especificada'}`;
    }

    let result = `Encontré ${professors.length} profesores:\n\n`;
    professors.forEach(prof => {
      result += `👨‍🏫 **${prof.name}** - ${prof.email}\n   Departamento: ${prof.department}\n\n`;
    });
    return result;
  }

  private static formatScheduleResults(schedules: any[]): string {
    if (schedules.length === 1) {
      const sched = schedules[0];
      return `📅 **${sched.subject}**
Profesor: ${sched.professor}
Aula: ${sched.classroom}
Horario: ${sched.time}
Días: ${sched.days.join(', ')}
Carrera: ${sched.career}`;
    }

    let result = `Encontré ${schedules.length} horarios:\n\n`;
    schedules.forEach(sched => {
      result += `📅 **${sched.subject}** - ${sched.time}\n   Profesor: ${sched.professor} | Aula: ${sched.classroom}\n\n`;
    });
    return result;
  }

  private static formatContactResults(contacts: any[]): string {
    if (contacts.length === 1) {
      const contact = contacts[0];
      return `📞 **${contact.area}**
Email: ${contact.email}
Teléfono: ${contact.phone}
Ubicación: ${contact.location}
Horarios: ${contact.hours}`;
    }

    let result = `Encontré ${contacts.length} contactos:\n\n`;
    contacts.forEach(contact => {
      result += `📞 **${contact.area}**\n   Email: ${contact.email} | Tel: ${contact.phone}\n\n`;
    });
    return result;
  }
}