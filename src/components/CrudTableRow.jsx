// CrudTableRow: una fila de la tabla con sus botones de acción.
import { pesos } from '../config/entidades.js';

export default function CrudTableRow({ el, entidad, valorCelda, setDataToEdit, deleteData }) {
  const stockBajo = entidad.clave === 'productos' && el.stock <= 5;

  return (
    <tr className={stockBajo ? 'table-warning' : undefined}>
      <td>{el.id}</td>
      {entidad.campos.map((c) => (
        <td key={c.nombre} className={c.tipo === 'number' ? 'text-end' : undefined}>
          {valorCelda(c, el)}
          {c.nombre === 'stock' && stockBajo && <span className="badge text-bg-danger ms-2">Bajo</span>}
        </td>
      ))}
      {entidad.total && <td className="text-end fw-semibold">{pesos(entidad.total(el))}</td>}
      <td className="text-end text-nowrap">
        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => setDataToEdit(el)} aria-label={`Editar ${entidad.singular} ${el.id}`}>
          Editar
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteData(el.id)} aria-label={`Eliminar ${entidad.singular} ${el.id}`}>
          Eliminar
        </button>
      </td>
    </tr>
  );
}
