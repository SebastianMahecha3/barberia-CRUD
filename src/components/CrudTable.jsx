// CrudTable: tabla Bootstrap con buscador. Muestra los registros y los botones Editar y Eliminar.
import { useState } from 'react';
import CrudTableRow from './CrudTableRow.jsx';
import { pesos } from '../config/entidades.js';

export default function CrudTable({ entidad, data, relaciones, setDataToEdit, deleteData }) {
  const [buscar, setBuscar] = useState('');

  // Texto de una celda: nombre del registro relacionado, moneda o valor tal cual
  const valorCelda = (c, el) => {
    if (c.tipo === 'relacion') return (relaciones[c.tabla] || []).find((r) => r.id === el[c.nombre])?.nombre ?? `#${el[c.nombre]}`;
    if (c.moneda) return pesos(el[c.nombre]);
    return el[c.nombre];
  };

  const filtrados = data.filter((el) =>
    entidad.campos.some((c) => String(valorCelda(c, el)).toLowerCase().includes(buscar.trim().toLowerCase()))
  );
  const totalGeneral = entidad.total ? filtrados.reduce((a, el) => a + entidad.total(el), 0) : null;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h2 className="h5 mb-0">{entidad.titulo} <span className="text-muted fs-6">({filtrados.length})</span></h2>
        <input
          type="search"
          className="form-control form-control-sm w-auto"
          placeholder="Buscar…"
          aria-label={`Buscar ${entidad.titulo.toLowerCase()}`}
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th scope="col">Id</th>
              {entidad.campos.map((c) => <th key={c.nombre} scope="col">{c.etiqueta}</th>)}
              {entidad.total && <th scope="col" className="text-end">Total</th>}
              <th scope="col" className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((el) => (
                <CrudTableRow key={el.id} el={el} entidad={entidad} valorCelda={valorCelda} setDataToEdit={setDataToEdit} deleteData={deleteData} />
              ))
            ) : (
              <tr>
                <td colSpan={entidad.campos.length + 3} className="text-center text-muted py-4">Sin datos</td>
              </tr>
            )}
          </tbody>
          {totalGeneral !== null && (
            <tfoot>
              <tr className="table-light">
                <th scope="row" colSpan={entidad.campos.length + 1} className="text-end">Total</th>
                <th className="text-end">{pesos(totalGeneral)}</th>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
