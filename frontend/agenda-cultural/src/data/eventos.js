const eventos = [
  {
    id: 1,
    nombre: 'Ciencia y Tecnología en el Desarrollo de las Artes Visuales',
    correoAutor:'shirley.brenes@something.com',
    categoria: 'Conversatorio',
    fecha: 'Miércoles 16 de julio',
    inicio: 'Miércoles 16 de julio - 6:00 p.m.',
    final: 'Miércoles 16 de julio - 8:00 p.m.',
    precio: 'Gratuito, pero sujeto a cupo',
    descripcion: 'El capítulo costarricense de la Asociación Internacional de Críticos de Arte...',
    entradas: 'https://www.asociacioncrtica.cr',
    contacto: '6041 5533',
    correo: 'arsciriticacr@gmail.com',
    accesibilidad: 'Accesible en silla de ruedas, Intérprete de LESCO disponible',
    direccion: 'Av. 9, Calle 11, Amón, San José',
    comentarios: [
      { autor: 'María Salazar', texto: '¡Me encantó!', estrellas: 4 },
      { autor: 'Shirley Brenes', texto: 'Muy interesante.', estrellas: 5 }
    ],
    imagen: 'event1.jpeg',
    categoria: 'Arte'
     
  },
  {
    id: 2,
    nombre: 'Festival de Jazz CR 2025',
    correoAutor:'shirley.brenes@something.com',
    categoria: 'Música',
    fecha: 'Sábado 10 de agosto',
    inicio: 'Sábado 10 de agosto - 3:00 p.m.',
    final: 'Sábado 10 de agosto - 10:00 p.m.',
    precio: '₡5,000',
    descripcion: 'Un festival vibrante con artistas nacionales e internacionales.',
    entradas: 'https://jazzfestivalcr.com',
    contacto: '8888 5555',
    correo: 'info@jazzcr.com',
    accesibilidad: 'Silla de ruedas, subtítulos',
    direccion: 'Teatro Nacional, San José',
    comentarios: [
      { autor: 'Luis Vargas', texto: 'Excelente ambiente.', estrellas: 5 }
    ],
    imagen: 'event2.jpg',
    categoria: 'Música'
  },
  {
    id: 3,
    nombre: 'Taller de Fotografía Urbana',
    correoAutor:'',
    categoria: 'Taller',
    fecha: 'Viernes 15 de septiembre',
    inicio: 'Viernes 15 de septiembre - 10:00 a.m.',
    final: 'Viernes 15 de septiembre - 4:00 p.m.',
    precio: '₡15,000',
    descripcion: 'Aprendé técnicas de fotografía con enfoque urbano en este taller práctico.',
    entradas: 'https://tallerfoto.cr',
    contacto: '7022 3344',
    correo: 'foto@artecr.com',
    accesibilidad: 'Espacio accesible, sin intérprete',
    direccion: 'Casa del Cuño, Antigua Aduana, San José',
    comentarios: [
      { autor: 'Ana Morales', texto: 'Muy útil para principiantes.', estrellas: 4 }
    ],
    imagen: 'event3.jpg',
    categoria: 'Arte'
  },
  {
    id: 4,
    nombre: 'Exposición: Arte Textil Contemporáneo',
    correoAutor:'',
    categoria: 'Exposición',
    fecha: 'Del 1 al 30 de octubre',
    inicio: 'Del 1 al 30 de octubre',
    final: '8:00 a.m. a 5:00 p.m.',
    precio: 'Entrada gratuita',
    descripcion: 'Obras textiles de artistas costarricenses contemporáneos.',
    entradas: '',
    contacto: '2255 7894',
    correo: 'info@galeriacostarica.cr',
    accesibilidad: 'Totalmente accesible',
    direccion: 'Galería Nacional, Museo de los Niños, San José',
    comentarios: [
      { autor: 'Carlos Rojas', texto: 'Arte impresionante.', estrellas: 5 }
    ],
    imagen: 'event4.jpg',
    categoria: 'Arte'
  },
  {
    id: 5,
    nombre: 'Teatro: “La Casa de Bernarda Alba”',
    correoAutor:'shirley.brenes@something.com',
    categoria: 'Teatro',
    fecha: 'Sábado 5 de octubre',
    inicio: 'Sábado 5 de octubre - 7:00 p.m.',
    final: 'Sábado 5 de octubre - 9:00 p.m.',
    precio: '₡8,000',
    descripcion: 'Una producción clásica del teatro español presentada por elenco nacional.',
    entradas: 'https://teatrocr.com/bernarda',
    contacto: '8880 1122',
    correo: 'contacto@teatrocr.com',
    accesibilidad: 'Silla de ruedas, intérprete LESCO',
    direccion: 'Teatro Popular Melico Salazar, San José',
    comentarios: [
      { autor: 'Lucía Navarro', texto: 'Excelente actuación y escenografía.', estrellas: 5 }
    ],
    imagen: 'event5.jpg',
    categoria: 'Teatro'
  }
];

export default eventos;
