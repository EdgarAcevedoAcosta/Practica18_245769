import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./componentes/Layout";
import { NoEncontrado } from "./componentes/NoEncontrado";
import { RutaProtegida } from "./componentes/RutaProtegida";

const PaginaClases = lazy(() => import("./paginas/PaginaClases"));
const PaginaRegistro = lazy(() => import("./paginas/PaginaRegistro"));
const PaginaEntrar = lazy(() => import("./paginas/PaginasEntrar"));
const PaginaClase = lazy(() => import("./paginas/PaginaClase"));
const PaginaInscripciones = lazy(() => import("./paginas/PaginaInscripciones"));

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/clases" replace />}></Route>
          <Route path="/clases">
            <Route index element={<PaginaClases />}></Route>
            <Route path=":id" element={<PaginaClase />}></Route>
          </Route>
          <Route path="entrar" element={<PaginaEntrar />}></Route>
          <Route path="registro" element={<PaginaRegistro />}></Route>
          <Route element={<RutaProtegida />}>
            <Route path="mis-inscripciones" element={<PaginaInscripciones />}></Route>
          </Route>
        </Route>
        <Route path="*" element={<NoEncontrado />}></Route>
      </Routes>
    </>
  );
}

export default App;
