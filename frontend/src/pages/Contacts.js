import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  const load = () => axios.get(`${API_URL}/contacts/`).then(r => setContacts(r.data));
  useEffect(() => { load(); }, []);

  const marquerTraite = async (id) => {
    await axios.put(`${API_URL}/contacts/${id}/traite`);
    load();
  };

  const nouveaux = contacts.filter(c => c.statut === 'nouveau');
  const traites = contacts.filter(c => c.statut === 'traite');

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>📝 Demandes clients</h1>
        <a href={`${API_URL}/rapport/mensuel`} target="_blank" rel="noreferrer"
          className="btn btn-primary">
          🖨️ Rapport mensuel PDF
        </a>
      </div>

      {nouveaux.length > 0 && (
        <div className="card" style={{borderLeft:'4px solid #ef4444'}}>
          <div className="card-title">🔴 Nouvelles demandes ({nouveaux.length})</div>
          <table>
            <thead><tr><th>Nom</th><th>Téléphone</th><th>Email</th><th>Bien</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {nouveaux.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.nom}</strong></td>
                  <td>
                    <a href={`https://wa.me/221${c.telephone.replace(/\s/g,'').replace('+221','')}`}
                      target="_blank" rel="noreferrer"
                      style={{color:'#25D366', fontWeight:700, textDecoration:'none'}}>
                      📲 {c.telephone}
                    </a>
                  </td>
                  <td>{c.email || '—'}</td>
                  <td>{c.bien_ref || '—'}</td>
                  <td style={{maxWidth:200, fontSize:12, color:'#666'}}>{c.message || '—'}</td>
                  <td style={{fontSize:12, color:'#888'}}>{c.date_contact}</td>
                  <td>
                    <button className="btn btn-sm" style={{background:'#dcfce7', color:'#15803d'}}
                      onClick={() => marquerTraite(c.id)}>✅ Traité</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="card">
          <div className="empty"><div className="empty-icon">📝</div>Aucune demande client pour le moment</div>
        </div>
      )}

      {traites.length > 0 && (
        <div className="card">
          <div className="card-title">✅ Demandes traitées ({traites.length})</div>
          <table>
            <thead><tr><th>Nom</th><th>Téléphone</th><th>Bien</th><th>Date</th></tr></thead>
            <tbody>
              {traites.map(c => (
                <tr key={c.id} style={{opacity:0.6}}>
                  <td>{c.nom}</td>
                  <td>{c.telephone}</td>
                  <td>{c.bien_ref || '—'}</td>
                  <td style={{fontSize:12}}>{c.date_contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
