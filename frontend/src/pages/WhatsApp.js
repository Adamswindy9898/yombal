import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function WhatsApp() {
  const [loyers, setLoyers] = useState({ total: 0, messages: [] });
  const [assurances, setAssurances] = useState({ total: 0, messages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/whatsapp/alertes-loyers`),
      axios.get(`${API_URL}/whatsapp/alertes-assurances`)
    ]).then(([l, a]) => {
      setLoyers(l.data);
      setAssurances(a.data);
      setLoading(false);
    });
  }, []);

  const total = loyers.total + assurances.total;

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>📲 Rappels WhatsApp</h1>
        <div style={{fontSize:13, color:'#888'}}>Cliquez sur un bouton pour envoyer directement</div>
      </div>

      {loading && <div className="card"><div className="empty">⏳ Chargement...</div></div>}

      {!loading && total === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">✅</div>
            Aucun rappel à envoyer — tout est en ordre !
          </div>
        </div>
      )}

      {/* Loyers impayés */}
      {loyers.messages.length > 0 && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-title">💰 Loyers impayés & Baux ({loyers.total})</div>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {loyers.messages.map((m, i) => (
              <div key={i} style={{
                background: m.type === 'loyer_impaye' ? '#fff5f5' : '#fffbeb',
                border: `1px solid ${m.type === 'loyer_impaye' ? '#fed7d7' : '#fde68a'}`,
                borderRadius:12, padding:16
              }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:700, fontSize:14}}>{m.locataire}</div>
                    <div style={{fontSize:12, color:'#888', marginTop:2}}>{m.telephone}</div>
                    {m.type === 'loyer_impaye' && <div style={{fontSize:13, color:'#b91c1c', fontWeight:600, marginTop:4}}>⚠️ Loyer impayé — {m.montant?.toLocaleString()} FCFA</div>}
                    {m.type === 'bail_expire_bientot' && <div style={{fontSize:13, color:'#b45309', fontWeight:600, marginTop:4}}>🗓️ Bail expire dans {m.jours} jours</div>}
                  </div>
                  <a href={m.lien_whatsapp} target="_blank" rel="noreferrer"
                    style={{display:'inline-flex', alignItems:'center', gap:6, background:'#25D366', color:'white', padding:'10px 16px', borderRadius:10, textDecoration:'none', fontSize:13, fontWeight:700, whiteSpace:'nowrap'}}>
                    📲 Envoyer rappel
                  </a>
                </div>
                <div style={{fontSize:12, color:'#666', background:'rgba(0,0,0,0.04)', padding:'8px 12px', borderRadius:8, fontStyle:'italic'}}>
                  "{m.message}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assurances */}
      {assurances.messages.length > 0 && (
        <div className="card">
          <div className="card-title">🚗 Assurances à renouveler ({assurances.total})</div>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {assurances.messages.map((m, i) => (
              <div key={i} style={{background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:16}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:700, fontSize:14}}>{m.client}</div>
                    <div style={{fontSize:12, color:'#888', marginTop:2}}>{m.telephone}</div>
                    <div style={{fontSize:13, color:'#1d4ed8', fontWeight:600, marginTop:4}}>🚗 {m.vehicule} — {m.immatriculation}</div>
                    <div style={{fontSize:12, color:'#888', marginTop:2}}>Expire dans {m.jours} jours</div>
                  </div>
                  <a href={m.lien_whatsapp} target="_blank" rel="noreferrer"
                    style={{display:'inline-flex', alignItems:'center', gap:6, background:'#25D366', color:'white', padding:'10px 16px', borderRadius:10, textDecoration:'none', fontSize:13, fontWeight:700, whiteSpace:'nowrap'}}>
                    📲 Envoyer rappel
                  </a>
                </div>
                <div style={{fontSize:12, color:'#666', background:'rgba(0,0,0,0.04)', padding:'8px 12px', borderRadius:8, fontStyle:'italic'}}>
                  "{m.message}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac'}}>
        <div style={{fontSize:14, fontWeight:700, marginBottom:8, color:'#15803d'}}>💡 Comment ça marche ?</div>
        <div style={{fontSize:13, color:'#166534', lineHeight:1.7}}>
          1. Clique sur <strong>"📲 Envoyer rappel"</strong> à côté d'un client<br/>
          2. WhatsApp s'ouvre avec le message prérempli<br/>
          3. Tu n'as qu'à appuyer sur <strong>Envoyer</strong> dans WhatsApp<br/>
          4. Le client reçoit ton rappel instantanément ✅
        </div>
      </div>
    </div>
  );
}
