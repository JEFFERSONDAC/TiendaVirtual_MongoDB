// ============================================================
// TiendaVirtual - Consultas CRUD, filtros, $lookup y agregaciones
// Ejecutar después de 01_crear_datos.js:
// mongosh --file scripts/02_consultas.js
// ============================================================

use TiendaVirtual;

// ------------------------------------------------------------
// 1. Consultas de lectura (READ)
// ------------------------------------------------------------
print("\n--- Todos los clientes ---");
db.clientes.find().limit(10).forEach(printjson);

print("\n--- Clientes de Cali ---");
db.clientes.find({ ciudad: "Cali" }).forEach(printjson);

print("\n--- Productos con precio superior a 100000 ---");
db.productos.find({ precio: { $gt: 100000 } }).forEach(printjson);

print("\n--- Productos de Tecnología o Accesorios ---");
db.productos.find({
  categoria: { $in: ["Tecnología", "Accesorios"] }
}).forEach(printjson);

print("\n--- Pedidos entregados con total superior a 150000 ---");
db.pedidos.find({
  estado: "Entregado",
  total: { $gt: 150000 }
}).forEach(printjson);

// ------------------------------------------------------------
// 2. CRUD: CREATE, UPDATE y DELETE de un cliente de demostración
//    Se utiliza un correo exclusivo para no modificar los datos
//    de prueba generados en la carga inicial.
// ------------------------------------------------------------
print("\n--- CREATE: insertar cliente de demostración ---");
db.clientes.insertOne({
  nombre: "María López",
  correo: "maria.lopez.demo@correo.com",
  ciudad: "Cali",
  fechaRegistro: new Date()
});

print("\n--- READ: consultar cliente de demostración ---");
db.clientes.find({
  correo: "maria.lopez.demo@correo.com"
}).forEach(printjson);

print("\n--- UPDATE: cambiar ciudad a Jamundí ---");
db.clientes.updateOne(
  { correo: "maria.lopez.demo@correo.com" },
  { $set: { ciudad: "Jamundí" } }
);

db.clientes.find({
  correo: "maria.lopez.demo@correo.com"
}).forEach(printjson);

print("\n--- DELETE: eliminar cliente de demostración ---");
db.clientes.deleteOne({
  correo: "maria.lopez.demo@correo.com"
});

// ------------------------------------------------------------
// 3. $lookup: relacionar pedidos con sus clientes
// ------------------------------------------------------------
print("\n--- Pedidos con información del cliente ---");
db.pedidos.aggregate([
  {
    $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "cliente"
    }
  },
  { $unwind: "$cliente" },
  {
    $project: {
      _id: 1,
      fecha: 1,
      estado: 1,
      total: 1,
      nombreCliente: "$cliente.nombre",
      ciudad: "$cliente.ciudad"
    }
  },
  { $limit: 10 }
]).forEach(printjson);

// ------------------------------------------------------------
// 4. Agregaciones y estadísticas
// ------------------------------------------------------------
print("\n--- Cantidad de pedidos ---");
print("Pedidos: " + db.pedidos.countDocuments());

print("\n--- Valor total de ventas ---");
db.pedidos.aggregate([
  {
    $group: {
      _id: null,
      ventasTotales: { $sum: "$total" }
    }
  },
  { $project: { _id: 0, ventasTotales: 1 } }
]).forEach(printjson);

print("\n--- Promedio del valor de los pedidos ---");
db.pedidos.aggregate([
  {
    $group: {
      _id: null,
      promedioPedido: { $avg: "$total" }
    }
  },
  { $project: { _id: 0, promedioPedido: 1 } }
]).forEach(printjson);

print("\n--- Ventas agrupadas por estado ---");
db.pedidos.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidadPedidos: { $sum: 1 },
      valorVentas: { $sum: "$total" },
      promedioPedido: { $avg: "$total" }
    }
  },
  { $sort: { valorVentas: -1 } }
]).forEach(printjson);

print("\n--- Cantidad de clientes por ciudad ---");
db.clientes.aggregate([
  {
    $group: {
      _id: "$ciudad",
      cantidadClientes: { $sum: 1 }
    }
  },
  { $sort: { cantidadClientes: -1 } }
]).forEach(printjson);

// ------------------------------------------------------------
// 5. Resumen de documentos
// ------------------------------------------------------------
print("\n--- Resumen de colecciones ---");
printjson({
  clientes: db.clientes.countDocuments(),
  productos: db.productos.countDocuments(),
  pedidos: db.pedidos.countDocuments()
});
