// Loader: indicador de carga de Bootstrap mientras llega la respuesta de la API.
export default function Loader() {
  return (
    <div className="d-flex align-items-center gap-2 text-muted my-3" role="status">
      <div className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>Cargando datos de la API…</span>
    </div>
  );
}
