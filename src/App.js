import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';
import LoginScreen from './pages/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen/>} />
        <Route path="/cadastro" element={<SchoolRegistration/>} />
      </Routes>
    </Router>
  );
}

export default App;
