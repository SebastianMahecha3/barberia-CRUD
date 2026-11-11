// CrudForm: formulario Bootstrap para crear y editar. Los campos se dibujan a partir de la
// configuración de la entidad, y se validan con HTML (required, min, type) y con expresiones regulares.
import { useEffect, useState } from 'react';

const vacio = (entidad) => Object.fromEntries([...entidad.campos.map((c) => [c.nombre, '']), ['id', null]]);

const nombreDe = (registro) => registro?.nombre ?? `#${registro?.id}`;

export default function CrudForm({ entidad, relaciones, createData, updateData, dataToEdit, setDataToEdit }) {
  const [form, setForm] = useState(vacio(entidad));
  const [errores, setErrores] = useState({});

  // Cuando se elige un registro para editar, se carga en el formulario
  useEffect(() => {
    if (dataToEdit) setForm({ ...vacio(entidad), ...dataToEdit });
    else setForm(vacio(entidad));
    setErrores({});
  }, [dataToEdit, entidad]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: undefined });
  };

  const validar = () => {
    const e = {};
    for (const c of entidad.campos) {
      const valor = String(form[c.nombre] ?? '').trim();
      if (c.requerido && !valor) {
        e[c.nombre] = 'Este campo es obligatorio.';
        continue;
      }
      if (c.tipo === 'text' && c.min && valor.length < c.min) e[c.nombre] = `Mínimo ${c.min} caracteres.`;
      if (c.patron && !c.patron.test(valor)) e[c.nombre] = c.mensajePatron;
      if (c.tipo === 'number') {
        const n = Number(valor);
        if (!Number.isFinite(n) || n < c.min) e[c.nombre] = `Debe ser un número mayor o igual a ${c.min}.`;
        else if (c.entero && !Number.isInteger(n)) e[c.nombre] = 'Debe ser un número entero.';
      }
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encontrados = validar();
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;

    // Convierte números y relaciones antes de enviar a la API
    const datos = { ...form };
    for (const c of entidad.campos) {
      if (c.tipo === 'number' || c.tipo === 'relacion') datos[c.nombre] = Number(datos[c.nombre]);
      else datos[c.nombre] = String(datos[c.nombre]).trim();
    }

    if (datos.id === null) {
      delete datos.id; // json-server asigna el id
      createData(datos);
    } else {
      updateData(datos);
    }
    handleReset();
  };

  const handleReset = () => {
    setForm(vacio(entidad));
    setErrores({});
    setDataToEdit(null);
  };

  const control = (c) => {
    const props = {
      id: `campo-${c.nombre}`,
      name: c.nombre,
      value: form[c.nombre] ?? '',
      onChange: handleChange,
      required: c.requerido,
      className: `form-${c.tipo === 'select' || c.tipo === 'relacion' ? 'select' : 'control'} ${errores[c.nombre] ? 'is-invalid' : ''}`,
      'aria-describedby': errores[c.nombre] ? `error-${c.nombre}` : undefined,
    };
    if (c.tipo === 'select') {
      return (
        <select {...props}>
          <option value="">Seleccione…</option>
          {c.opciones.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (c.tipo === 'relacion') {
      return (
        <select {...props}>
          <option value="">Seleccione…</option>
          {(relaciones[c.tabla] || []).map((r) => <option key={r.id} value={r.id}>{nombreDe(r)}</option>)}
        </select>
      );
    }
    return <input {...props} type={c.tipo} min={c.min} step={c.tipo === 'number' ? (c.entero ? 1 : 'any') : undefined} />;
  };

  const editando = form.id !== null;

  return (
    <div className="card shadow-sm">
      <div className={`card-header ${editando ? 'bg-warning-subtle' : 'bg-white'}`}>
        <h2 className="h5 mb-0">{editando ? `Editar ${entidad.singular} #${form.id}` : `Agregar ${entidad.singular}`}</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          {entidad.campos.map((c) => (
            <div key={c.nombre} className="mb-3">
              <label htmlFor={`campo-${c.nombre}`} className="form-label">
                {c.etiqueta} {c.requerido && <span className="text-danger" aria-hidden="true">*</span>}
              </label>
              {control(c)}
              {errores[c.nombre] && <div id={`error-${c.nombre}`} className="invalid-feedback">{errores[c.nombre]}</div>}
            </div>
          ))}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-dorado flex-fill">{editando ? 'Guardar cambios' : 'Agregar'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
