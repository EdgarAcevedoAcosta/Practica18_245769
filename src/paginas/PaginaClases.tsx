import { Link } from "react-router";
import { Cargando } from "../componentes/Cargando";
import { MensajeError } from "../componentes/MensajeError";
import { useClases } from "../hooks/useClases";
import { urlImagen } from "../servicios/api";

export default function PaginaClases() {
  const { clases, cargando, error, reintentar } = useClases();
  return (
    <>
      <section className="pagina__encabezado">
        <h1>Clases</h1>
        <p className="pagina__bajada">Elige una clase para ver sus horarios e inscribirte.</p>
      </section>
      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {!cargando && !error && (
        <div className="rejilla">
          {clases.map((c) => (
            <Link key={c.id} to={`/clases/${c.id}`} className="tarjeta-clase">
              <img className="tarjeta-clase__imagen" src={urlImagen(c.imagen)} alt={c.nombre} />
              <div className="tarjeta-clase__cuerpo">
                <span className="etiqueta etiqueta--fuerza">{c.categoria}</span>
                <span className="tarjeta-clase__titulo">{c.nombre}</span>
                <span className="tarjeta-clase__meta">{c.duracionMin} min</span>
              </div>
            </Link>
          ))}

          <a href="/clases/2" className="tarjeta-clase">
            <img
              className="tarjeta-clase__imagen"
              src="http://localhost:3000/img/clase-02.jpg"
              alt="Ciclismo indoor"
            />
            <div className="tarjeta-clase__cuerpo">
              <span className="etiqueta etiqueta--cardio">cardio</span>
              <span className="tarjeta-clase__titulo">Ciclismo indoor</span>
              <span className="tarjeta-clase__meta">45 min</span>
            </div>
          </a>
        </div>
      )}
    </>
  );
}
