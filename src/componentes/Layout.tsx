// <Layout> — RECURSO: el marco que comparten todas las páginas.
// Es el mismo <Layout> de la tienda, con una diferencia: en lugar de
// {children} lleva <Outlet />. Outlet es el HUECO donde React Router pinta
// la ruta hija que coincide con la URL.
import { Outlet } from "react-router";
import { Encabezado } from "./Encabezado.tsx";
import { PiePagina } from "./PiePagina.tsx";
import { Suspense } from "react";
import { Cargando } from "./Cargando.tsx";

export function Layout() {
  return (
    <div className="disposicion">
      <Encabezado />
      <main className="disposicion__contenido">
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <PiePagina />
    </div>
  );
}
