import { ClassroomInfo, ProfessorInfo, ScheduleInfo, ContactInfo } from '../types';

export const classrooms: ClassroomInfo[] = [
  {
    id: '1',
    name: 'Aula 101',
    building: 'Torre 1',
    floor: 'Planta Baja',
    description: 'Torre 1 - Planta Baja - Lado Este',
    capacity: 40,
    equipment: ['Proyector', 'Sistema de sonido', 'Aire acondicionado']
  },
  {
    id: '2',
    name: 'Aula 203',
    building: 'Torre 1',
    floor: 'Piso 2',
    description: 'Torre 1 - Piso 2 - Ala Sur',
    capacity: 35,
    equipment: ['Proyector', 'Pizarra inteligente']
  },
  {
    id: '3',
    name: 'Aula 305',
    building: 'Torre 2',
    floor: 'Piso 3',
    description: 'Torre 2 - Piso 3 - Sector Norte',
    capacity: 50,
    equipment: ['Proyector', 'Sistema de sonido', 'Aire acondicionado', 'Computadoras']
  },
  {
    id: '4',
    name: 'Laboratorio 1',
    building: 'Edificio de Ciencias',
    floor: 'Piso 1',
    description: 'Edificio de Ciencias - Piso 1 - Laboratorio de Informática',
    capacity: 30,
    equipment: ['30 Computadoras', 'Proyector', 'Aire acondicionado']
  },
  {
    id: '5',
    name: 'Auditorio Principal',
    building: 'Edificio Central',
    floor: 'Planta Baja',
    description: 'Edificio Central - Planta Baja - Auditorio Principal',
    capacity: 200,
    equipment: ['Sistema audiovisual completo', 'Micrófono inalámbrico', 'Aire acondicionado']
  }
];

export const professors: ProfessorInfo[] = [
  {
    id: '1',
    name: 'Dr. Carlos López',
    email: 'clopez@upacifico.edu.py',
    department: 'Ingeniería',
    position: 'Profesor Titular',
    phone: '021-123-456',
    office: 'Torre 1 - Oficina 201'
  },
  {
    id: '2',
    name: 'Dra. María González',
    email: 'mgonzalez@upacifico.edu.py',
    department: 'Administración',
    position: 'Doctora',
    phone: '021-123-457',
    office: 'Torre 2 - Oficina 301'
  },
  {
    id: '3',
    name: 'Ing. Roberto Silva',
    email: 'rsilva@upacifico.edu.py',
    department: 'Ingeniería',
    position: 'Profesor Adjunto',
    phone: '021-123-458',
    office: 'Torre 1 - Oficina 205'
  },
  {
    id: '4',
    name: 'Lic. Ana Martínez',
    email: 'amartinez@upacifico.edu.py',
    department: 'Humanidades',
    position: 'Profesora',
    phone: '021-123-459',
    office: 'Edificio Central - Oficina 102'
  },
  {
    id: '5',
    name: 'Dr. Luis Fernández',
    email: 'lfernandez@upacifico.edu.py',
    department: 'Ciencias',
    position: 'Director de Investigación',
    phone: '021-123-460',
    office: 'Edificio de Ciencias - Oficina 301'
  }
];

export const schedules: ScheduleInfo[] = [
  {
    id: '1',
    subject: 'Programación I',
    professor: 'Dr. Carlos López',
    classroom: 'Laboratorio 1',
    time: '08:00 - 10:00',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    career: 'Ingeniería en Informática'
  },
  {
    id: '2',
    subject: 'Administración Estratégica',
    professor: 'Dra. María González',
    classroom: 'Aula 203',
    time: '14:00 - 16:00',
    days: ['Martes', 'Jueves'],
    career: 'Administración de Empresas'
  },
  {
    id: '3',
    subject: 'Matemática I',
    professor: 'Dr. Luis Fernández',
    classroom: 'Aula 101',
    time: '10:00 - 12:00',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    career: 'Ingeniería en Informática'
  },
  {
    id: '4',
    subject: 'Literatura Paraguaya',
    professor: 'Lic. Ana Martínez',
    classroom: 'Aula 305',
    time: '16:00 - 18:00',
    days: ['Martes', 'Jueves'],
    career: 'Letras'
  },
  {
    id: '5',
    subject: 'Estructuras de Datos',
    professor: 'Ing. Roberto Silva',
    classroom: 'Laboratorio 1',
    time: '14:00 - 16:00',
    days: ['Lunes', 'Miércoles'],
    career: 'Ingeniería en Informática'
  }
];

export const contacts: ContactInfo[] = [
  {
    id: '1',
    area: 'Secretaría Académica',
    email: 'academica@upacifico.edu.py',
    phone: '021-123-400',
    location: 'Torre 1 - Planta Baja',
    hours: 'Lunes a Viernes 07:00 - 17:00'
  },
  {
    id: '2',
    area: 'Admisiones',
    email: 'admisiones@upacifico.edu.py',
    phone: '021-123-401',
    location: 'Edificio Central - Planta Baja',
    hours: 'Lunes a Viernes 07:00 - 17:00, Sábados 08:00 - 12:00'
  },
  {
    id: '3',
    area: 'Biblioteca',
    email: 'biblioteca@upacifico.edu.py',
    phone: '021-123-402',
    location: 'Torre 2 - Piso 1',
    hours: 'Lunes a Viernes 07:00 - 20:00, Sábados 08:00 - 16:00'
  },
  {
    id: '4',
    area: 'Bienestar Estudiantil',
    email: 'bienestar@upacifico.edu.py',
    phone: '021-123-403',
    location: 'Torre 1 - Piso 1',
    hours: 'Lunes a Viernes 08:00 - 16:00'
  },
  {
    id: '5',
    area: 'Tesorería',
    email: 'tesoreria@upacifico.edu.py',
    phone: '021-123-404',
    location: 'Torre 2 - Planta Baja',
    hours: 'Lunes a Viernes 07:00 - 15:00'
  }
];