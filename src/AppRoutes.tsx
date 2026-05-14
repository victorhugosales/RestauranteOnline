import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './Layout';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
//import { AreaAdministrativa } from './pages/AreaAdministrativa';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pai com o Layout fixo */}
        <Route path="/" element={<MainLayout />}>
          {/* Index significa que esta é a página padrão quando acessar "/" */}
          <Route index element={<Home />} />
          
          {/* Rota para o CRUD administrativo [cite: 29] */}
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}