import { Link, useNavigate, useParams } from "react-router";
import { Cargando } from "../componentes/Cargando";
import { MensajeError } from "../componentes/MensajeError";
import { estadoDeError, urlImagen } from "../servicios/api";
import { useClase } from "../hooks/useClase";
import { useSesion } from "../sesion/SesionContext";
import { useState } from "react";
import { inscribirse } from "../servicios/gimnasio";
import { useInscripciones } from "../estado/inscripciones";

interface Aviso {
  tipo: "exito" | "error";
  mensaje: string;
}
export default function PaginaClase() {
  const { id } = useParams();
  const { clase, cargando, error, reintentar } = useClase(Number(id));
  const navegar = useNavigate();
  //const ubicacion = useLocation();
  const { usuario } = useSesion();
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const misInscripciones = useInscripciones((estado) => estado.lista);
  const cargarInscripciones = useInscripciones((estado) => estado.cargar);
  if (cargando) return <Cargando />;
  if (error)
    return (
      <MensajeError
        mensaje={error ?? "Ocurrio un error al cargar la clase"}
        onReintentar={reintentar}
      />
    );
  if (!clase)
    return (
      <MensajeError
        mensaje={error ?? "Ocurrio un error al cargar la clase"}
        onReintentar={reintentar}
      />
    );
  async function inscribir(horarioId: number) {
    if (!usuario) {
      setAviso({ tipo: "error", mensaje: "Necesitas Iniciar sesion para inscribirte" });
      return;
    }
    try {
      await inscribirse(horarioId);
      cargarInscripciones();
      navegar("/mis-inscripciones");
    } catch (error) {
      if (estadoDeError(error) === 409) {
        setAviso({ tipo: "error", mensaje: "Ya te encuentras inscrito en esta clase" });
      } else if (error === 401) {
        navegar("/entrar");
      } else {
        setAviso({ tipo: "error", mensaje: "Ocurrio un error al inscribirte" });
      }
    }
  }
  return (
    <>
      <Link to="/clases" className="detalle__volver">
        ← Todas las clases
      </Link>

      <article className="detalle">
        <img className="detalle__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} />
        <div className="detalle__datos">
          <span className="etiqueta etiqueta--fuerza">{clase.categoria}</span>
          <h1>{clase.nombre}</h1>
          <p className="pagina__bajada">
            {clase.descripcion} · {clase.duracionMin} min
          </p>

          <h2>Horarios</h2>
          {aviso && <p className={`aviso aviso--${aviso?.tipo}`}>{aviso.mensaje}</p>}
          <ul className="horarios">
            {clase.horarios.map((h) => (
              <li className="horario">
                <div>
                  <div className="horario__dia">
                    {h.dia} · {h.horaInicio}{" "}
                  </div>
                  <div className="horario__meta">
                    {h.entrenador} · {h.disponibles} de {h.cupoMaximo} lugares
                  </div>
                </div>
                {misInscripciones.some((i) => i.horario.id === h.id) ? (
                  <span>Ya estas Inscrito</span>
                ) : h.disponibles === 0 ? (
                  <span>Cupos llenos</span>
                ) : (
                  <button className="boton boton--chico" onClick={() => inscribir(h.id)}>
                    Inscribirme
                  </button>
                )}
              </li>
            ))}

            <li className="horario">
              <div>
                <div className="horario__dia">viernes · 18:00</div>
                <div className="horario__meta">Ana Robles · 0 de 1 lugares</div>
              </div>
              <span className="horario__lleno">Lleno</span>
            </li>
          </ul>
        </div>
      </article>
    </>
  );
}
