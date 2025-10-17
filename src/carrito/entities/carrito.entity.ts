export class Carrito {}




// Usuario agrega planificaciones al Carrito.
// El carrito se llena con CarritoItems.
// Usuario confirma compra → el sistema crea una Orden.
// Se copian los items del carrito a OrdenItems (para registrar qué compró).
// Orden queda "pendiente" hasta que se procese el pago.
// Si el pago es exitoso → la Orden pasa a "pagado".
// Con eso, el usuario obtiene el derecho a descargar las planificaciones (se registran en la tabla Descarga).