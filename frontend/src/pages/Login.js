import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Remplissez tous les champs'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ nom: res.data.nom, email: res.data.email }));
      onLogin(res.data);
    } catch {
      setError('Email ou mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>

      {/* Cercles décoratifs */}
      <div style={{position:'fixed', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(29,158,117,0.1)', pointerEvents:'none'}}></div>
      <div style={{position:'fixed', bottom:-150, left:-100, width:500, height:500, borderRadius:'50%', background:'rgba(29,158,117,0.06)', pointerEvents:'none'}}></div>

      <div style={{width:'100%', maxWidth:420, position:'relative'}}>
        {/* Logo */}
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{width:70, height:70, borderRadius:20, background:'linear-gradient(135deg,#1D9E75,#15a878)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 16px', boxShadow:'0 10px 30px rgba(29,158,117,0.4)'}}>🏠</div>
          <div style={{fontSize:28, fontWeight:800, color:'white', letterSpacing:-1}}>Immo<span style={{color:'#1D9E75'}}>Pro</span></div>
          <div style={{fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:6}}>Gestion immobilière & Assurances</div>
        </div>

        {/* Card login */}
        <div style={{background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', borderRadius:24, padding:36, border:'1px solid rgba(255,255,255,0.1)'}}>
          <div style={{fontSize:18, fontWeight:700, color:'white', marginBottom:6}}>Connexion</div>
          <div style={{fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:28}}>Entrez vos identifiants pour accéder</div>

          {error && (
            <div style={{background:'rgba(255,100,100,0.15)', border:'1px solid rgba(255,100,100,0.3)', color:'#ff8080', padding:'10px 14px', borderRadius:10, marginBottom:20, fontSize:13}}>
              ⚠️ {error}
            </div>
          )}

          <div style={{marginBottom:16}}>
            <label style={{display:'block', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:8, textTransform:'uppercase', letterSpacing:1}}>Email</label>
            <input type="email" placeholder="admin@immopro.sn" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:14, color:'white', outline:'none', boxSizing:'border-box', fontFamily:'inherit'}} />
          </div>

          <div style={{marginBottom:28}}>
            <label style={{display:'block', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:8, textTransform:'uppercase', letterSpacing:1}}>Mot de passe</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:14, color:'white', outline:'none', boxSizing:'border-box', fontFamily:'inherit'}} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{width:'100%', padding:'14px', background:'linear-gradient(135deg,#1D9E75,#15a878)', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 6px 20px rgba(29,158,117,0.4)', transition:'all 0.2s', fontFamily:'inherit'}}>
            {loading ? '⏳ Connexion...' : 'Se connecter →'}
          </button>

          <div style={{textAlign:'center', marginTop:20, padding:'14px', background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:4}}>Compte par défaut</div>
            <div style={{fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace'}}>admin@immopro.sn / immopro2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
