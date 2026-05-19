import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function FormulaireContact({ bienRef, bienNom, onClose }) {
  const [form, setForm] = useState({ nom:'', telephone:'', email:'', message:'', bien_ref: bienRef || '' });
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.nom || !form.telephone) return;
    setLoading(true);
    await axios.post(`${API_URL}/contacts/`, form);
    setSucces(true);
    setLoading(false);
  };

  if (succes) return (
    <div style={{textAlign:'center', padding:32}}>
      <div style={{fontSize:48, marginBottom:16}}>✅</div>
      <div style={{fontSize:18, fontWeight:700, color:'#15803d', marginBottom:8}}>Message envoyé !</div>
      <div style={{fontSize:14, color:'#555', marginBottom:20}}>Nous vous contacterons très bientôt sur WhatsApp ou par téléphone.</div>
      {onClose && <button className="btn btn-primary" onClick={onClose}>Fermer</button>}
    </div>
  );

  return (
    <div>
      <h3 style={{fontSize:18, fontWeight:700, marginBottom:6}}>📝 Laisser vos coordonnées</h3>
      {bienNom && <div style={{fontSize:13, color:'#888', marginBottom:20}}>Pour : {bienNom}</div>}

      <div style={{display:'flex', flexDirection:'column', gap:14}}>
        <div>
          <label style={{display:'block', fontSize:12, fontWeight:700, color:'#555', marginBottom:6, textTransform:'uppercase', letterSpacing:0.5}}>Nom complet *</label>
          <input value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Votre nom"
            style={{width:'100%', padding:'12px', border:'2px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box'}} />
        </div>
        <div>
          <label style={{display:'block', fontSize:12, fontWeight:700, color:'#555', marginBottom:6, textTransform:'uppercase', letterSpacing:0.5}}>Téléphone / WhatsApp *</label>
          <input value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})} placeholder="77 XXX XX XX"
            style={{width:'100%', padding:'12px', border:'2px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box'}} />
        </div>
        <div>
          <label style={{display:'block', fontSize:12, fontWeight:700, color:'#555', marginBottom:6, textTransform:'uppercase', letterSpacing:0.5}}>Message (optionnel)</label>
          <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Votre question ou demande..."
            rows={3} style={{width:'100%', padding:'12px', border:'2px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', resize:'none', boxSizing:'border-box'}} />
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.nom || !form.telephone}
          style={{background:'linear-gradient(135deg,#1D9E75,#15a878)', color:'white', border:'none', borderRadius:12, padding:'13px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity: (!form.nom || !form.telephone) ? 0.5 : 1}}>
          {loading ? '⏳ Envoi...' : '📤 Envoyer ma demande'}
        </button>
        <div style={{textAlign:'center', fontSize:12, color:'#aaa'}}>
          Ou contactez-nous directement : <a href="https://wa.me/221776316751" target="_blank" rel="noreferrer" style={{color:'#25D366', fontWeight:700}}>WhatsApp 776 316 751</a>
        </div>
      </div>
    </div>
  );
}
