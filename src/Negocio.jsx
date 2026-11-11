// Negocio.jsx: página principal (single page) de la administración de Filo Barber Studio.
// Muestra un resumen del negocio y una pestaña por cada tabla de la API (productos, clientes,
// proveedores, compras y ventas). Cada pestaña reutiliza el mismo componente CRUD.
import { useEffect, useState } from 'react';
import { helpFetch } from './helpers/helpFetch.js';
import { ENTIDADES, pesos } from './config/entidades.js';
import CrudApp from './components/CrudApp.jsx';

const API = '/api';

export default function Negocio() {
  const [pestana, setPestana] = useState('productos');
  // Datos de todas las tablas: se usan para el resumen y para mostrar nombres en las relaciones
  const [datos, setDatos] = useState({});
  const [estadoApi, setEstadoApi] = useState('verificando');
  const api = helpFetch();

  // useEffect: al cargar la página consulta todas las tablas una vez
  useEffect(() => {
    Promise.all(ENTIDADES.map((e) => api.get(`${API}/${e.clave}`))).then((respuestas) => {
      const error = respuestas.find((r) => r.err);
      setEstadoApi(error ? 'sin conexión' : 'conectada');
      const nuevos = {};
      ENTIDADES.forEach((e, i) => {
        nuevos[e.clave] = respuestas[i].err ? [] : respuestas[i];
      });
      setDatos(nuevos);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando un CRUD cambia su tabla, avisa aquí para actualizar el resumen y las relaciones
  const actualizarTabla = (clave, registros) => setDatos((d) => ({ ...d, [clave]: registros }));

  const total = (clave, fn) => (datos[clave] || []).reduce((a, r) => a + fn(r), 0);
  const resumen = [
    { titulo: 'Productos', valor: (datos.productos || []).length, detalle: `${(datos.productos || []).filter((p) => p.stock <= 5).length} con stock bajo` },
    { titulo: 'Clientes', valor: (datos.clientes || []).length, detalle: `${(datos.proveedores || []).length} proveedores` },
    { titulo: 'Total compras', valor: pesos(total('compras', (r) => r.cantidad * r.costoUnitario)), detalle: `${(datos.compras || []).length} compras` },
    { titulo: 'Total ventas', valor: pesos(total('ventas', (r) => r.cantidad * r.precioUnitario)), detalle: `${(datos.ventas || []).length} ventas` },
  ];
  const entidad = ENTIDADES.find((e) => e.clave === pestana);

  return (
    <>
      <nav className="navbar navbar-dark navbar-filo mb-4">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.svg" alt="" width="40" height="40" />
            <span>
              <strong className="text-dorado">FILO</strong> Barber Studio
              <small className="d-block text-white-50 fs-6">Administración del negocio</small>
            </span>
          </span>
          <span className={`badge ${estadoApi === 'conectada' ? 'text-bg-success' : 'text-bg-danger'}`}>API: {estadoApi}</span>
        </div>
      </nav>

      <main className="container pb-5">
        <h1 className="h3 mb-3">Panel del negocio</h1>

        <div className="row g-3 mb-4">
          {resumen.map((r) => (
            <div key={r.titulo} className="col-6 col-lg-3">
              <div className="card shadow-sm tarjeta-resumen h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">{r.titulo}</p>
                  <p className="h4 mb-1">{r.valor}</p>
                  <p className="small text-muted mb-0">{r.detalle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ul className="nav nav-pills mb-3 gap-2 flex-wrap" role="tablist">
          {ENTIDADES.map((e) => (
            <li key={e.clave} className="nav-item" role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={pestana === e.clave}
                className={`nav-link ${pestana === e.clave ? 'active' : 'bg-white border'}`}
                onClick={() => setPestana(e.clave)}
              >
                <span aria-hidden="true">{e.icono}</span> {e.titulo}{' '}
                <span className="badge text-bg-secondary">{(datos[e.clave] || []).length}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* key: al cambiar de pestaña se monta un CRUD nuevo con su propio estado */}
        <CrudApp key={entidad.clave} entidad={entidad} url={`${API}/${entidad.clave}`} relaciones={datos} onCambio={actualizarTabla} />
      </main>

      <footer className="text-center text-muted small py-3 border-top">
        Laboratorio IV · Programación Web · Universidad Libre · React + json-server + Bootstrap
      </footer>
    </>
  );
}
