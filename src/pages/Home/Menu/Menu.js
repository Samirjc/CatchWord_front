import { useState } from 'react';
import { BookOpen, Users, PencilRuler, GraduationCap, BarChart3, Settings, LogOut } from 'lucide-react';
import { Logo } from '../../Cadastro/Cadastro';
import { TurmasContent } from '../Turmas/Turmas';
import './Menu.css';

function MenuItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  const isSair = item.id === 'sair';
  
  return (
    <button
      onClick={onClick}
      className={`menu-item ${isActive ? 'active' : 'inactive'} ${isSair ? 'sair' : ''}`}
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </button>
  );
}

function MenuSection({ items, activeItem, onItemClick }) {
  return (
    <nav className="menu-nav">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={activeItem === item.id}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </nav>
  );
}

function Sidebar({ activeItem, onItemClick, menuItems, bottomItems }) {
  return (
    <div className="menu-sidebar">
      <Logo />
      
      <div className="menu-section">
        <MenuSection
          items={menuItems}
          activeItem={activeItem}
          onItemClick={onItemClick}
        />
      </div>

      <div className="menu-bottom">
        <MenuSection
          items={bottomItems}
          activeItem={activeItem}
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
}

function MainContent({ activeItem, menuItems, bottomItems, userProfile }) {
  const currentItem = menuItems.find(i => i.id === activeItem) || bottomItems.find(i => i.id === activeItem);
  
  // Renderiza o conteúdo específico da seção Turmas
  if (activeItem === 'turmas') {
    return <TurmasContent userProfile={userProfile} />;
  }
  
  return (
    <div className="main-content">
      <div className="content-wrapper">
        <h1 className="content-title">Meus Jogos</h1>
        <p className="content-subtitle">Gerencie seus jogos de caça-palavras</p>
        
        <div className="content-card">
          <p className="content-text">
            Conteúdo da seção <span className="content-highlight">{currentItem?.label}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SidebarMenu({ userProfile = 'coordenador' }) {
  const [activeItem, setActiveItem] = useState('meus-jogos');

  const menuItems = [
    { id: 'meus-jogos', label: 'Meus Jogos', icon: BookOpen },
    { id: 'turmas', label: 'Turmas', icon: Users },
    { id: 'professores', label: 'Professores', icon: PencilRuler},
    { id: 'aluno', label: 'Alunos', icon: GraduationCap},
    { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'sair', label: 'Sair', icon: LogOut },
  ];

  return (
    <>
      <div className="app-container">
        <Sidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          menuItems={menuItems}
          bottomItems={bottomItems}
        />
        <MainContent
          activeItem={activeItem}
          menuItems={menuItems}
          bottomItems={bottomItems}
          userProfile={userProfile}
        />
      </div>
    </>
  );
}