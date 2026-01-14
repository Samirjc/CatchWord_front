import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';
import SidebarMenu from './components/Menu/Menu';
import PasswordScreen from './pages/Cadastro/CriarSenha';
import Footer from './components/Footer';
import SuccessScreen from './pages/Cadastro/Sucesso';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
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
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
