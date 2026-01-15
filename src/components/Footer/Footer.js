import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CatchWord. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
