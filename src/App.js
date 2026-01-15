import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';
import SidebarMenu from './components/Menu/Menu';
import PasswordScreen from './pages/Cadastro/CriarSenha';
import Footer from './components/Footer';
import SuccessScreen from './pages/Cadastro/Sucesso';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const location = useLocation();
  
  // Rotas onde o footer NÃO deve aparecer
  const hideFooterRoutes = ['/login', '/cadastro', '/completar-cadastro', '/sucesso'];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <Routes>
          {/* Redireciona a raiz para login */}
          <Route path="/" element={<Navigate to="/login" replace />}/>
          <Route path="/login" element={<LoginScreen/>}/>
          <Route path="/cadastro" element={<SchoolRegistration/>}/>
          <Route path='/completar-cadastro' element={<PasswordScreen/>}/>
          <Route path='/sucesso' element={<SuccessScreen/>}/>
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route path="/home/*" element={
            <PrivateRoute>
              <SidebarMenu/>
            </PrivateRoute>
          }/>
        </Routes>
      </div>
      {showFooter && <Footer/>}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
