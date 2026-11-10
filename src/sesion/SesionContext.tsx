import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Sesion, Usuario } from "../tipos";
import * as servicio from "../servicios/sesion";
import { useInscripciones } from "../estado/inscripciones";

interface ValorSesion {
  usuario: Usuario | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

const SesionContext = createContext<ValorSesion | null>(null);
function leerUsuario(): Usuario | null {
  const usuarioGuardado = localStorage.getItem("usuario");
  return usuarioGuardado ? (JSON.parse(usuarioGuardado) as Usuario) : null;
}
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuario);
  function guardar(sesion: Sesion) {
    localStorage.setItem("token", sesion.token);
    localStorage.setItem("usuario", JSON.stringify(sesion.usuario));
    setUsuario(sesion.usuario);
  }

  async function entrar(correo: string, password: string) {
    guardar(await servicio.entrar(correo, password));
  }
  async function registrar(nombre: string, correo: string, password: string) {
    guardar(await servicio.registrar(nombre, correo, password));
  }
  function salir() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }
  useEffect(() => {
    if (usuario) useInscripciones.getState().cargar();
    else useInscripciones.getState().vaciar();
  }, [usuario]);
  useEffect(() => {
    const alTerminar = () => setUsuario(null);
    window.addEventListener("sesion-terminada", alTerminar);
    return () => window.removeEventListener("sesion-terminada", alTerminar);
  }, []);
  return <SesionContext value={{ usuario, entrar, registrar, salir }}>{children}</SesionContext>;
}

export function useSesion() {
  const valor = useContext(SesionContext);
  if (!valor)
    throw new Error("useSesion() tiene que usarse demtrp deñ cp,´pmemete <ProveedorSesion>");
  return valor;
}
