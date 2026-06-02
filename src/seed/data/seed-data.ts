export const inicialData = {
  /* ======================================================
      SEED DE MATERIAS - Primaria Argentina
  ====================================================== */
  MATERIAS_SEED: [
    { name: 'lengua y literatura', description: 'practicas del lenguaje' },
    { name: 'matemática', description: 'matemática' },
    { name: 'ciencias naturales', description: 'naturales' },
    { name: 'ciencias sociales', description: 'sociales' },
    { name: 'tecnología', description: 'tecnologia' },
    { name: 'educación artística', description: 'artistica' },
    { name: 'música', description: 'musica' },
    { name: 'educación física', description: 'ed fisica' },
    { name: 'inglés', description: 'idioma ingles' },
  ],

  /* ======================================================
      SEED DE GRADOS
  ====================================================== */
  GRADOS_SEED: [
    { name: 'primero', numero: 1 },
    { name: 'segundo', numero: 2 },
    { name: 'tercero', numero: 3 },
    { name: 'cuarto', numero: 4 },
    { name: 'quinto', numero: 5 },
    { name: 'sexto', numero: 6 },
    { name: 'septimo', numero: 7 },
  ],



  /* ======================================================
      SEED DE USUARIOS
      ⚠️ IMPORTANTE:
      El campo "rol" NO se coloca acá.
      Se asigna luego en el SeedService cuando estén insertados
  ====================================================== */
  USERS_SEED: [
    {
      email: 'superadmin@example.com',
      password: '123Abc', // luego confirmame si querés hash con bcrypt
      name: 'Super',
      lastname: 'Admin',
      isActive: true,
      roles: ['super-admin']
    },
    {
      email: 'admin@example.com',
      password: '123Abc',
      name: 'Admin',
      lastname: 'System',
      isActive: true,
      roles: ['admin']
    },
    {
      email: 'user@example.com',
      password: '123Abc',
      name: 'User',
      lastname: 'Demo',
      isActive: true,
    },
  ],

  /* ======================================================
      SEED DE PLANIFICACIONES
      materiaName y gradoNumero se usan para buscar los IDs
      luego de insertar materias y grados
  ====================================================== */
  PLANIFICACIONES_SEED: [
    {
      title: 'Planificación Anual de Lengua - 1er Grado',
      description: 'Secuencia didáctica anual para trabajar la lectura y escritura inicial en primer grado',
      price: 500,
      materiaName: 'lengua y literatura',
      gradoNumero: 1,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/lengua-1er-grado.pdf',
      public_id: 'planificaciones/lengua-1er-grado',
    },
    {
      title: 'Planificación de Matemática - 3er Grado',
      description: 'Unidades didácticas sobre multiplicación y división para tercer grado',
      price: 400,
      materiaName: 'matemática',
      gradoNumero: 3,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/matematica-3er-grado.pdf',
      public_id: 'planificaciones/matematica-3er-grado',
    },
    {
      title: 'Planificación de Ciencias Naturales - 5to Grado',
      description: 'Proyectos sobre el cuerpo humano y los ecosistemas para quinto grado',
      price: 600,
      materiaName: 'ciencias naturales',
      gradoNumero: 5,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/naturales-5to-grado.pdf',
      public_id: 'planificaciones/naturales-5to-grado',
    },
    {
      title: 'Planificación de Ciencias Sociales - 4to Grado',
      description: 'Secuencia sobre geografía argentina e historia contemporánea para cuarto grado',
      price: 450,
      materiaName: 'ciencias sociales',
      gradoNumero: 4,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/sociales-4to-grado.pdf',
      public_id: 'planificaciones/sociales-4to-grado',
    },
    {
      title: 'Planificación de Inglés - 2do Grado',
      description: 'Introducción al inglés mediante juegos y canciones para segundo grado',
      price: 350,
      materiaName: 'inglés',
      gradoNumero: 2,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/ingles-2do-grado.pdf',
      public_id: 'planificaciones/ingles-2do-grado',
    },
    {
      title: 'Planificación de Matemática - 6to Grado',
      description: 'Fracciones, decimales y problemas de razonamiento para sexto grado',
      price: 500,
      materiaName: 'matemática',
      gradoNumero: 6,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/matematica-6to-grado.pdf',
      public_id: 'planificaciones/matematica-6to-grado',
    },
    {
      title: 'Planificación de Tecnología - 7mo Grado',
      description: 'Introducción a la programación y el pensamiento computacional para séptimo grado',
      price: 550,
      materiaName: 'tecnología',
      gradoNumero: 7,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/tecnologia-7mo-grado.pdf',
      public_id: 'planificaciones/tecnologia-7mo-grado',
    },
  ]

}
