import { create } from "zustand";
import type { Inscripcion } from "../tipos";
import { traerMisInscripciones } from "../servicios/gimnasio";
import { mensajeDeError } from "../servicios/api";

interface EstadoInscripciones {
  lista: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}
export const useInscripciones = create<EstadoInscripciones>()((set) => ({
  lista: [],
  cargando: true,
  error: null,
  cargar: async () => {
    set({ cargando: true, error: null });
    try {
      set({ lista: await traerMisInscripciones() });
    } catch (error) {
      set({ error: mensajeDeError(error, "No se pudieron cargar tus inscripciones") });
    } finally {
      set({ cargando: false });
    }
  },
  vaciar: () => set({ lista: [], cargando: false, error: null }),
}));
