export const inicialData = {
/* ======================================================
    SEED DE MATERIAS - Primaria Argentina
====================================================== */
 MATERIAS_SEED : [
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
GRADOS_SEED : [
  { name: 'primero' },
  { name: 'segundo' },
  { name: 'tercero' },
  { name: 'cuarto' },
  { name: 'quinto' },
  { name: 'sexto' },
  { name: 'septimo' },
],

/* ======================================================
    SEED DE ROLES
====================================================== */
// ROLES_SEED : [
//   { name: 'super-admin' },
//   { name: 'admin' },
//   { name: 'user' },
// ],

/* ======================================================
    SEED DE USUARIOS
    ⚠️ IMPORTANTE:
    El campo "rol" NO se coloca acá.
    Se asigna luego en el SeedService cuando estén insertados
====================================================== */
USERS_SEED : [
  {
    email: 'superadmin@example.com',
    password: '123456', // luego confirmame si querés hash con bcrypt
    name: 'Super',
    lastname: 'Admin',
    isActive: true,
    roles: ['super-admin']
  },
  {
    email: 'admin@example.com',
    password: '123456',
    name: 'Admin',
    lastname: 'System',
    isActive: true,
    roles:['admin']
  },
  {
    email: 'user@example.com',
    password: '123456',
    name: 'User',
    lastname: 'Demo',
    isActive: true,
  },
]

}
