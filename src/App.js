import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SchoolRegistration from './pages/Cadastro/Cadastro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchoolRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
