# TiendaVirtual - Sistema de gestión de ventas con MongoDB

Proyecto académico de Big Data que implementa una base de datos NoSQL documental para administrar una tienda virtual.

## Objetivo

Almacenar y consultar información de clientes, productos y pedidos. La implementación permite explorar el catálogo, registrar compras, relacionar documentos y obtener indicadores mediante agregaciones de MongoDB.

## Tecnologías

- MongoDB
- MongoDB Shell (`mongosh`)
- JavaScript para MongoDB Shell

## Modelo de datos

La base de datos se llama `TiendaVirtual` y contiene tres colecciones:

| Colección | Campos principales | Descripción |
|---|---|---|
| `clientes` | `_id`, `nombre`, `correo`, `ciudad`, `fechaRegistro` | Datos de los compradores. |
| `productos` | `_id`, `nombre`, `categoria`, `precio`, `stock` | Catálogo y existencias. |
| `pedidos` | `_id`, `cliente_id`, `fecha`, `estado`, `items`, `total` | Compras realizadas. |

Cada pedido contiene `cliente_id` como referencia al cliente. El arreglo `items` incluye `producto_id`, `cantidad` y `precioUnitario`.

## Estructura del repositorio

```text
TiendaVirtual_MongoDB/
├── README.md
├── .gitignore
└── scripts/
    ├── 01_crear_datos.js
    └── 02_consultas.js
```

## Requisitos

1. Tener MongoDB instalado y en ejecución, o disponer de una instancia MongoDB accesible.
2. Tener instalado MongoDB Shell (`mongosh`).
3. Contar con conexión a la instancia de MongoDB.

## Instalación y ejecución

Clona el repositorio:

```bash
git clone https://github.com/JEFFERSONDAC/TiendaVirtual_MongoDB.git
cd TiendaVirtual_MongoDB
```

Ejecuta el script de creación de datos:

```bash
mongosh --file scripts/01_crear_datos.js
```

El script crea la base de datos y carga los siguientes registros:

- 100 clientes.
- 20 productos.
- 100 pedidos.

Después ejecuta las consultas:

```bash
mongosh --file scripts/02_consultas.js
```

También puedes abrir una sesión interactiva con `mongosh` y ejecutar los archivos desde allí.

## Operaciones incluidas

### CRUD

- **Create:** inserción de un cliente de demostración.
- **Read:** consulta de clientes, productos y pedidos.
- **Update:** actualización de la ciudad del cliente de demostración.
- **Delete:** eliminación del cliente de demostración.

### Filtros

- `$gt`: productos con precio superior a 100.000.
- `$in`: productos de las categorías Tecnología y Accesorios.
- Filtro combinado: pedidos entregados cuyo total supera 150.000.

### Relación entre colecciones

Se utiliza `$lookup` para incorporar a cada pedido la información del cliente que realizó la compra.

### Agregaciones

- Conteo de pedidos.
- Suma del valor total de ventas.
- Promedio del valor de los pedidos.
- Ventas agrupadas por estado.
- Cantidad de clientes por ciudad.

## Advertencia sobre la carga de datos

`01_crear_datos.js` ejecuta `deleteMany({})` sobre las colecciones `clientes`, `productos` y `pedidos` antes de insertar los datos de prueba. Esto elimina los documentos que existan previamente en esas colecciones. Ejecuta el script únicamente en una base de datos de práctica o después de realizar una copia de seguridad.

## Resultados

Los conteos de documentos se verifican al finalizar la carga. Los valores monetarios y los resultados de las agregaciones deben obtenerse ejecutando los scripts en MongoDB; no se deben presentar cifras como resultados reales sin haber ejecutado las consultas.

## Autor

Jefferson Daniel Arango Ciro

Proyecto académico - Curso BIG DATA (UNAD), 2026.
