// Message: alerta de error de Bootstrap.
export default function Message({ msg }) {
  return (
    <div className="alert alert-danger" role="alert">
      {msg}
    </div>
  );
}
