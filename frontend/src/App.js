import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Biens from './pages/Biens';
import Locataires from './pages/Locataires';
import Alertes from './pages/Alertes';
import Terrains from './pages/Terrains';
import Assurances from './pages/Assurances';
import Vitrine from './pages/Vitrine';
import Chatbot from './pages/Chatbot';
import Paiements from './pages/Paiements';
import Carte from './pages/Carte';
import Notation from './pages/Notation';
import Graphiques from './pages/Graphiques';
import Contacts from './pages/Contacts';
import WhatsApp from './pages/WhatsApp';
import Login from './pages/Login';
import './App.css';

function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-name">Immo<span>Pro</span></div>
        <div className="brand-sub">Gestion immobilière</div>
      </div>
      <nav>
        <div className="nav-section">Principal</div>
        <NavLink to="/" end className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">📊</span> Dashboard</NavLink>
        <NavLink to="/graphiques" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">📈</span> Statistiques</NavLink>

        <div className="nav-section">Gestion</div>
        <NavLink to="/biens" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🏠</span> Biens</NavLink>
        <NavLink to="/locataires" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">👥</span> Locataires</NavLink>
        <NavLink to="/paiements" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🧾</span> Paiements</NavLink>
        <NavLink to="/notation" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">⭐</span> Notation</NavLink>

        <div className="nav-section">Patrimoine</div>
        <NavLink to="/terrains" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🌍</span> Terrains</NavLink>
        <NavLink to="/carte" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🗺️</span> Carte</NavLink>
        <NavLink to="/assurances" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🚗</span> Assurances</NavLink>

        <div className="nav-section">Outils</div>
        <NavLink to="/alertes" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🔔</span> Alertes</NavLink>
        <NavLink to="/whatsapp" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">📲</span> Rappels WhatsApp</NavLink>
        <NavLink to="/contacts" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">📝</span> Demandes clients</NavLink>
        <NavLink to="/chatbot" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">💬</span> Chatbot IA</NavLink>

        <div className="nav-section">Public</div>
        <NavLink to="/vitrine" className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="icon">🌐</span> Vitrine clients</NavLink>
      </nav>

      <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#1D9E75,#15a878)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'white'}}>
            {user?.nom?.charAt(0)||'A'}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'white'}}>{user?.nom}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Administrateur</div>
          </div>
        </div>
        <button onClick={onLogout} style={{width:'100%',background:'rgba(255,100,100,0.1)',color:'#ff8080',border:'1px solid rgba(255,100,100,0.2)',borderRadius:8,padding:'7px 12px',fontSize:12,cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (saved && token) setUser(JSON.parse(saved));
  }, []);
  const handleLogin = (data) => setUser(data);
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  if (!user) return <Login onLogin={handleLogin} />;
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/graphiques" element={<Graphiques />} />
            <Route path="/biens" element={<Biens />} />
            <Route path="/locataires" element={<Locataires />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/notation" element={<Notation />} />
            <Route path="/terrains" element={<Terrains />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="/assurances" element={<Assurances />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/vitrine" element={<Vitrine />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;
