import { Link } from "react-router";
import { Cargando } from "../componentes/Cargando";
import { MensajeError } from "../componentes/MensajeError";
import { useMisInscripciones } from "../hooks/useMisInscripciones";
import { urlImagen } from "../servicios/api";
import { useInscripciones } from "../estado/inscripciones";

export default function PaginaInscripciones() {
  const { lista: inscripciones, cargando, error, cargar: reintentar } = useInscripciones();

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;
  return (
    <>
      <section className="pagina__encabezado">
        <h1>Mis inscripciones</h1>
        <p className="pagina__bajada">
          {inscripciones.length === 0
            ? "Todavia no estas inscrito en ninguna clase"
            : `Estas inscrito en ${inscripciones.length} clases`}
        </p>
      </section>

      <ul className="inscripciones">
        {inscripciones.map((i) => (
          <li className="inscripcion">
            <img
              className="inscripcion__imagen"
              src={urlImagen(i.clase.imagen)}
              alt={i.clase.nombre}
            />
            <div>
              <Link to={`/clases/${i.clase.id}`} className="inscripcion__clase">
                {i.clase.nombre}
              </Link>
              <div className="inscripcion__meta">
                {i.horario.dia} · {i.horario.horaInicio} ·{i.horario.entrenador}{" "}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
