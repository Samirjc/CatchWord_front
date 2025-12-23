import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';
import SidebarMenu from './components/Menu/Menu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen/>}/>
        <Route path="/cadastro" element={<SchoolRegistration/>}/>
        <Route path="/home" element={<SidebarMenu/>}/>
      </Routes>
    </Router>
  );
}

export default App;
