import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';
import SidebarMenu from './components/Menu/Menu';
import PasswordScreen from './pages/Cadastro/CriarSenha';
import Footer from './components/Footer';
import SuccessScreen from './pages/Cadastro/Sucesso';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<LoginScreen/>}/>
            <Route path="/cadastro" element={<SchoolRegistration/>}/>
            <Route path="/home" element={<SidebarMenu/>}/>
            <Route path='/completar-cadastro' element={<PasswordScreen/>}/>
            <Route path='/sucesso' element={<SuccessScreen/>}/>
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
