// Configuración de cada tabla del negocio. El mismo CRUD (CrudApp) sirve para todas:
// solo cambia esta descripción de campos. Agregar una tabla nueva = agregar un objeto aquí y en db.json.
//
// tipo: text | email | tel | number | date | select | relacion (elige un registro de otra tabla)
export const ENTIDADES = [
  {
    clave: 'productos',
    articulo: 'el',
    titulo: 'Productos',
    singular: 'producto',
    icono: '🧴',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, min: 3 },
      { nombre: 'categoria', etiqueta: 'Categoría', tipo: 'select', requerido: true, opciones: ['Ceras y pomadas', 'Polvos y geles', 'Cuidado capilar', 'Barba'] },
      { nombre: 'precio', etiqueta: 'Precio (COP)', tipo: 'number', requerido: true, min: 1, moneda: true },
      { nombre: 'stock', etiqueta: 'Stock', tipo: 'number', requerido: true, min: 0, entero: true },
      { nombre: 'proveedorId', etiqueta: 'Proveedor', tipo: 'relacion', requerido: true, tabla: 'proveedores' },
    ],
  },
  {
    clave: 'clientes',
    articulo: 'el',
    titulo: 'Clientes',
    singular: 'cliente',
    icono: '👤',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre completo', tipo: 'text', requerido: true, min: 3, patron: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, mensajePatron: 'Solo letras y espacios.' },
      { nombre: 'documento', etiqueta: 'Documento', tipo: 'text', requerido: true, patron: /^\d{6,10}$/, mensajePatron: 'Entre 6 y 10 dígitos.' },
      { nombre: 'telefono', etiqueta: 'Celular', tipo: 'tel', requerido: true, patron: /^3\d{9}$/, mensajePatron: '10 dígitos y empieza por 3.' },
      { nombre: 'email', etiqueta: 'Correo', tipo: 'email', requerido: true, patron: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, mensajePatron: 'Correo no válido.' },
    ],
  },
  {
    clave: 'proveedores',
    articulo: 'el',
    titulo: 'Proveedores',
    singular: 'proveedor',
    icono: '🚚',
    campos: [
      { nombre: 'nombre', etiqueta: 'Razón social', tipo: 'text', requerido: true, min: 3 },
      { nombre: 'nit', etiqueta: 'NIT', tipo: 'text', requerido: true, patron: /^\d{9}-\d$/, mensajePatron: 'Formato 900123456-1.' },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', requerido: true, patron: /^3\d{9}$/, mensajePatron: '10 dígitos y empieza por 3.' },
      { nombre: 'email', etiqueta: 'Correo', tipo: 'email', requerido: true, patron: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, mensajePatron: 'Correo no válido.' },
      { nombre: 'ciudad', etiqueta: 'Ciudad', tipo: 'text', requerido: true, min: 3 },
    ],
  },
  {
    clave: 'compras',
    articulo: 'la',
    titulo: 'Compras',
    singular: 'compra',
    icono: '📦',
    total: (r) => r.cantidad * r.costoUnitario,
    campos: [
      { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
      { nombre: 'proveedorId', etiqueta: 'Proveedor', tipo: 'relacion', requerido: true, tabla: 'proveedores' },
      { nombre: 'productoId', etiqueta: 'Producto', tipo: 'relacion', requerido: true, tabla: 'productos' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true, min: 1, entero: true },
      { nombre: 'costoUnitario', etiqueta: 'Costo unitario', tipo: 'number', requerido: true, min: 1, moneda: true },
    ],
  },
  {
    clave: 'ventas',
    articulo: 'la',
    titulo: 'Ventas',
    singular: 'venta',
    icono: '💈',
    total: (r) => r.cantidad * r.precioUnitario,
    campos: [
      { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
      { nombre: 'clienteId', etiqueta: 'Cliente', tipo: 'relacion', requerido: true, tabla: 'clientes' },
      { nombre: 'productoId', etiqueta: 'Producto', tipo: 'relacion', requerido: true, tabla: 'productos' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true, min: 1, entero: true },
      { nombre: 'precioUnitario', etiqueta: 'Precio unitario', tipo: 'number', requerido: true, min: 1, moneda: true },
    ],
  },
];

export const pesos = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0);
