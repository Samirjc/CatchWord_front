import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Informações Gerais</h3>
          <ul className="footer-list">
            <li><a href="/sobre">Sobre o CatchWord</a></li>
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Política de Privacidade</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Dúvidas</h3>
          <ul className="footer-list">
            <li><a href="/tutorial">Como Usar?</a></li>
            <li><a href="/faq">Perguntas Frequentes</a></li>
            <li><a href="/ajuda">Central de Ajuda</a></li>
            <li><a href="/suporte">Suporte Técnico</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Saiba Mais</h3>
          <ul className="footer-list">
            <li><a href="/funcionalidades">Funcionalidades</a></li>
            <li><a href="/planos">Planos e Preços</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/atualizacoes">Atualizações</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CatchWord. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
