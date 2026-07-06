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
    {
      email: 'maria.gonzalez@example.com',
      password: '123Abc',
      name: 'María',
      lastname: 'González',
      isActive: true,
      roles: ['user']
    },
    {
      email: 'juan.perez@example.com',
      password: '123Abc',
      name: 'Juan',
      lastname: 'Pérez',
      isActive: true,
      roles: ['user']
    },
    {
      email: 'lucia.fernandez@example.com',
      password: '123Abc',
      name: 'Lucía',
      lastname: 'Fernández',
      isActive: true,
      roles: ['user']
    },
    {
      email: 'carlos.rodriguez@example.com',
      password: '123Abc',
      name: 'Carlos',
      lastname: 'Rodríguez',
      isActive: false,
      roles: ['user']
    },
    {
      email: 'ana.martinez@example.com',
      password: '123Abc',
      name: 'Ana',
      lastname: 'Martínez',
      isActive: true,
      roles: ['user']
    },
    {
      email: 'diego.lopez@example.com',
      password: '123Abc',
      name: 'Diego',
      lastname: 'López',
      isActive: true,
      roles: ['user']
    },
    {
      email: 'sofia.diaz@example.com',
      password: '123Abc',
      name: 'Sofía',
      lastname: 'Díaz',
      isActive: true,
      roles: ['user']
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
    {
      title: 'Planificación de Educación Física - 1er Grado',
      description: 'Juegos motores y actividades de coordinación para primer grado',
      price: 300,
      materiaName: 'educación física',
      gradoNumero: 1,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/edfisica-1er-grado.pdf',
      public_id: 'planificaciones/edfisica-1er-grado',
    },
    {
      title: 'Planificación de Música - 2do Grado',
      description: 'Iniciación musical con ritmo, melodía y canciones populares argentinas para segundo grado',
      price: 350,
      materiaName: 'música',
      gradoNumero: 2,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/musica-2do-grado.pdf',
      public_id: 'planificaciones/musica-2do-grado',
    },
    {
      title: 'Planificación de Educación Artística - 3er Grado',
      description: 'Técnicas plásticas y apreciación del arte para tercer grado',
      price: 380,
      materiaName: 'educación artística',
      gradoNumero: 3,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/artistica-3er-grado.pdf',
      public_id: 'planificaciones/artistica-3er-grado',
    },
    {
      title: 'Planificación de Lengua - 4to Grado',
      description: 'Comprensión lectora, producción de textos y gramática para cuarto grado',
      price: 480,
      materiaName: 'lengua y literatura',
      gradoNumero: 4,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/lengua-4to-grado.pdf',
      public_id: 'planificaciones/lengua-4to-grado',
    },
    {
      title: 'Planificación de Ciencias Naturales - 2do Grado',
      description: 'Los seres vivos, el agua y el clima para segundo grado',
      price: 420,
      materiaName: 'ciencias naturales',
      gradoNumero: 2,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/naturales-2do-grado.pdf',
      public_id: 'planificaciones/naturales-2do-grado',
    },
    {
      title: 'Planificación de Ciencias Sociales - 6to Grado',
      description: 'Historia argentina siglo XX y geografía económica para sexto grado',
      price: 500,
      materiaName: 'ciencias sociales',
      gradoNumero: 6,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/sociales-6to-grado.pdf',
      public_id: 'planificaciones/sociales-6to-grado',
    },
    {
      title: 'Planificación de Matemática - 1er Grado',
      description: 'Números hasta el 100, sumas, restas y resolución de problemas para primer grado',
      price: 400,
      materiaName: 'matemática',
      gradoNumero: 1,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/matematica-1er-grado.pdf',
      public_id: 'planificaciones/matematica-1er-grado',
    },
    {
      title: 'Planificación de Inglés - 5to Grado',
      description: 'Lectura, escritura y conversación en inglés para quinto grado',
      price: 450,
      materiaName: 'inglés',
      gradoNumero: 5,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/ingles-5to-grado.pdf',
      public_id: 'planificaciones/ingles-5to-grado',
    },
    {
      title: 'Planificación de Tecnología - 4to Grado',
      description: 'Uso responsable de herramientas digitales e introducción al hardware para cuarto grado',
      price: 470,
      materiaName: 'tecnología',
      gradoNumero: 4,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/tecnologia-4to-grado.pdf',
      public_id: 'planificaciones/tecnologia-4to-grado',
    },
    {
      title: 'Planificación de Educación Física - 6to Grado',
      description: 'Deportes colectivos, habilidades motrices avanzadas y trabajo en equipo para sexto grado',
      price: 320,
      materiaName: 'educación física',
      gradoNumero: 6,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/edfisica-6to-grado.pdf',
      public_id: 'planificaciones/edfisica-6to-grado',
    },
    {
      title: 'Planificación de Lengua - 7mo Grado',
      description: 'Literatura argentina, análisis de textos y escritura creativa para séptimo grado',
      price: 530,
      materiaName: 'lengua y literatura',
      gradoNumero: 7,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/lengua-7mo-grado.pdf',
      public_id: 'planificaciones/lengua-7mo-grado',
    },
    {
      title: 'Planificación de Música - 5to Grado',
      description: 'Historia de la música, lectura de partituras básicas e instrumentos para quinto grado',
      price: 390,
      materiaName: 'música',
      gradoNumero: 5,
      url: 'https://res.cloudinary.com/demo/raw/upload/v1/planificaciones/musica-5to-grado.pdf',
      public_id: 'planificaciones/musica-5to-grado',
    },
  ],

  /* ======================================================
      SEED DE COMPRAS
      userEmail y planificacionTitle se usan para resolver
      las relaciones luego de insertar usuarios y planificaciones
  ====================================================== */
  COMPRAS_SEED: [
    {
      userEmail: 'user@example.com',
      planificacionTitle: 'Planificación Anual de Lengua - 1er Grado',
      priceAtPurchase: 500,
      paymentStatus: 'paid',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0001',
    },
    {
      userEmail: 'user@example.com',
      planificacionTitle: 'Planificación de Matemática - 3er Grado',
      priceAtPurchase: 400,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0002',
    },
    {
      userEmail: 'user@example.com',
      planificacionTitle: 'Planificación de Ciencias Naturales - 5to Grado',
      priceAtPurchase: 600,
      paymentStatus: 'pending',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0003',
    },
    {
      userEmail: 'admin@example.com',
      planificacionTitle: 'Planificación de Inglés - 2do Grado',
      priceAtPurchase: 350,
      paymentStatus: 'failed',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0004',
    },
    {
      userEmail: 'maria.gonzalez@example.com',
      planificacionTitle: 'Planificación de Ciencias Sociales - 4to Grado',
      priceAtPurchase: 450,
      paymentStatus: 'paid',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0005',
    },
    {
      userEmail: 'juan.perez@example.com',
      planificacionTitle: 'Planificación de Tecnología - 7mo Grado',
      priceAtPurchase: 550,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0006',
    },
    {
      userEmail: 'lucia.fernandez@example.com',
      planificacionTitle: 'Planificación Anual de Lengua - 1er Grado',
      priceAtPurchase: 500,
      paymentStatus: 'paid',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0007',
    },
    {
      userEmail: 'carlos.rodriguez@example.com',
      planificacionTitle: 'Planificación de Matemática - 6to Grado',
      priceAtPurchase: 500,
      paymentStatus: 'refunded',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0008',
    },
    {
      userEmail: 'maria.gonzalez@example.com',
      planificacionTitle: 'Planificación de Ciencias Naturales - 5to Grado',
      priceAtPurchase: 600,
      paymentStatus: 'paid',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0009',
    },
    {
      userEmail: 'juan.perez@example.com',
      planificacionTitle: 'Planificación de Inglés - 2do Grado',
      priceAtPurchase: 350,
      paymentStatus: 'pending',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0010',
    },
    {
      userEmail: 'lucia.fernandez@example.com',
      planificacionTitle: 'Planificación de Ciencias Sociales - 4to Grado',
      priceAtPurchase: 450,
      paymentStatus: 'paid',
      paymentMethod: 'mercadopago',
      transactionId: 'TXN-0011',
    },
    {
      userEmail: 'user@example.com',
      planificacionTitle: 'Planificación de Tecnología - 7mo Grado',
      priceAtPurchase: 550,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      transactionId: 'TXN-0012',
    },
  ]

}
