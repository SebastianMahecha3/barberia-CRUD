// CrudApp: CRUD reutilizable. Recibe la descripción de una tabla (entidad) y la URL de la API.
// - useState guarda los registros, el registro que se edita, la carga y los errores.
// - useEffect lee los datos de la API al montarse.
// - helpFetch hace las peticiones GET, POST, PUT y DELETE a json-server.
import { useEffect, useState } from 'react';
import { helpFetch } from '../helpers/helpFetch.js';
import CrudForm from './CrudForm.jsx';
import CrudTable from './CrudTable.jsx';
import Loader from './Loader.jsx';
import Message from './Message.jsx';

export default function CrudApp({ entidad, url, relaciones, onCambio }) {
  const [db, setDb] = useState(null); // registros de la tabla
  const [dataToEdit, setDataToEdit] = useState(null); // registro que se está editando
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const api = helpFetch();

  // READ: leer todos los registros al cargar el componente
  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (res.err) {
        setError(res);
        setDb(null);
      } else {
        setDb(res);
        setError(null);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const guardarEnEstado = (registros, mensaje) => {
    setDb(registros);
    onCambio(entidad.clave, registros);
    setAviso(mensaje);
    setTimeout(() => setAviso(null), 3000);
  };

  // CREATE
  const createData = (data) => {
    api.post(url, { body: data }).then((res) => {
      if (res.err) setError(res);
      else guardarEnEstado([...db, res], `Se creó ${entidad.articulo} ${entidad.singular} correctamente.`);
    });
  };

  // UPDATE
  const updateData = (data) => {
    api.put(`${url}/${data.id}`, { body: data }).then((res) => {
      if (res.err) setError(res);
      else guardarEnEstado(db.map((el) => (el.id === data.id ? res : el)), `Se actualizó ${entidad.articulo} ${entidad.singular} #${data.id}.`);
    });
  };

  // DELETE (con confirmación para prevenir errores)
  const deleteData = (id) => {
    const seguro = window.confirm(`¿Eliminar ${entidad.articulo} ${entidad.singular} con id ${id}? Esta acción no se puede deshacer.`);
    if (!seguro) return;
    api.del(`${url}/${id}`).then((res) => {
      if (res.err) setError(res);
      else guardarEnEstado(db.filter((el) => el.id !== id), `Se eliminó ${entidad.articulo} ${entidad.singular} #${id}.`);
    });
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <CrudForm
          entidad={entidad}
          relaciones={relaciones}
          createData={createData}
          updateData={updateData}
          dataToEdit={dataToEdit}
          setDataToEdit={setDataToEdit}
        />
      </div>
      <div className="col-lg-8">
        {aviso && <div className="alert alert-success py-2" role="status">{aviso}</div>}
        {loading && <Loader />}
        {error && <Message msg={`Error ${error.status}: ${error.statusText}`} />}
        {db && (
          <CrudTable entidad={entidad} data={db} relaciones={relaciones} setDataToEdit={setDataToEdit} deleteData={deleteData} />
        )}
      </div>
    </div>
  );
}
