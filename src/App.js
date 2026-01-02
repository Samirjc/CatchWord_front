import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';
import SidebarMenu from './components/Menu/Menu';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<LoginScreen/>}/>
            <Route path="/cadastro" element={<SchoolRegistration/>}/>
            <Route path="/home" element={<SidebarMenu/>}/>
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
