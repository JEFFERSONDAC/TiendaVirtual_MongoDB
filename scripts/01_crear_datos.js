// ============================================================
// TiendaVirtual - Creación de base de datos y datos de prueba
// Ejecutar con: mongosh --file scripts/01_crear_datos.js
// Genera: 100 clientes, 20 productos y 100 pedidos.
// ADVERTENCIA: limpia los documentos existentes en estas colecciones.
// ============================================================

use TiendaVirtual;

// Limpiar datos anteriores para que la carga sea reproducible.
db.clientes.deleteMany({});
db.productos.deleteMany({});
db.pedidos.deleteMany({});

const ciudades = ["Cali", "Jamundí", "Palmira", "Yumbo"];
const categorias = ["Tecnología", "Hogar", "Accesorios", "Deportes"];

// ------------------------------------------------------------
// 1. Clientes
// ------------------------------------------------------------
const clientes = [];

for (let i = 1; i <= 100; i++) {
  clientes.push({
    nombre: "Cliente " + i,
    correo: "cliente" + i + "@correo.com",
    ciudad: ciudades[i % ciudades.length],
    fechaRegistro: new Date(2026, 0, (i % 28) + 1)
  });
}

db.clientes.insertMany(clientes);

// ------------------------------------------------------------
// 2. Productos
// ------------------------------------------------------------
const productos = [];

for (let i = 1; i <= 20; i++) {
  productos.push({
    nombre: "Producto " + i,
    categoria: categorias[i % categorias.length],
    precio: 25000 + (i * 7500),
    stock: 10 + i
  });
}

db.productos.insertMany(productos);

// ------------------------------------------------------------
// 3. Pedidos relacionados con clientes y productos existentes
// ------------------------------------------------------------
const listaClientes = db.clientes.find({}, { _id: 1 }).toArray();
const listaProductos = db.productos.find({}, { _id: 1, precio: 1 }).toArray();

const pedidos = [];

for (let i = 0; i < 100; i++) {
  const producto = listaProductos[i % listaProductos.length];
  const cantidad = (i % 4) + 1;

  pedidos.push({
    cliente_id: listaClientes[i % listaClientes.length]._id,
    fecha: new Date(2026, 1, (i % 28) + 1),
    estado: i % 5 === 0 ? "Pendiente" : "Entregado",
    items: [{
      producto_id: producto._id,
      cantidad: cantidad,
      precioUnitario: producto.precio
    }],
    total: producto.precio * cantidad
  });
}

db.pedidos.insertMany(pedidos);

// ------------------------------------------------------------
// 4. Verificación de la carga
// ------------------------------------------------------------
print("Base de datos: " + db.getName());
print("Clientes: " + db.clientes.countDocuments());
print("Productos: " + db.productos.countDocuments());
print("Pedidos: " + db.pedidos.countDocuments());
print("Carga de datos finalizada.");
