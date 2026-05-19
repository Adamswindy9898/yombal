import React, { useEffect, useState } from 'react';
import { locatairesAPI } from '../services/api';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

function Etoiles({ note, onNote }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{display:'flex', gap:2}}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{fontSize:22, cursor: onNote ? 'pointer' : 'default', color: i <= (hover || note) ? '#f59e0b' : '#e5e7eb', transition:'color 0.1s'}}
          onMouseEnter={() => onNote && setHover(i)}
          onMouseLeave={() => onNote && setHover(0)}
          onClick={() => onNote && onNote(i)}>★</span>
      ))}
    </div>
  );
}

function scoreLabel(score) {
  if (score >= 4.5) return { label: 'Excellent', color: '#15803d', bg: '#dcfce7' };
  if (score >= 3.5) return { label: 'Bon', color: '#1d4ed8', bg: '#dbeafe' };
  if (score >= 2.5) return { label: 'Moyen', color: '#b45309', bg: '#fef9c3' };
  return { label: 'Mauvais', color: '#b91c1c', bg: '#fee2e2' };
}

export default function Notation() {
  const [locataires, setLocataires] = useState([]);
  const [notations, setNotations] = useState({});
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ note_paiement: 5, note_entretien: 5, note_comportement: 5, commentaire: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    locatairesAPI.getAll().then(r => {
      setLocataires(r.data);
      r.data.forEach(l => {
        axios.get(`${API_URL}/notations/${l.id}`).then(res => {
          setNotations(prev => ({ ...prev, [l.id]: res.data }));
        }).catch(() => {});
      });
    });
  }, []);

  const scoreMoyen = (n) => {
    if (!n || !n.length) return null;
    const last = n[n.length - 1];
    return ((last.note_paiement + last.note_entretien + last.note_comportement) / 3).toFixed(1);
  };

  const handleSubmit = async () => {
    await axios.post(`${API_URL}/notations/`, { ...form, locataire_id: selected.id });
    const res = await axios.get(`${API_URL}/notations/${selected.id}`);
    setNotations(prev => ({ ...prev, [selected.id]: res.data }));
    setShowModal(false);
    setForm({ note_paiement: 5, note_entretien: 5, note_comportement: 5, commentaire: '' });
  };

  return (
    <div>
      <h1 className="page-title">⭐ Notation des locataires</h1>
      <div className="card">
        {locataires.length === 0 && <div className="empty"><div className="empty-icon">⭐</div>Aucun locataire</div>}
        <table>
          <thead><tr><th>Locataire</th><th>Téléphone</th><th>Score global</th><th>Paiement</th><th>Entretien</th><th>Comportement</th><th>Actions</th></tr></thead>
          <tbody>
            {locataires.map(l => {
              const notes = notations[l.id] || [];
              const score = scoreMoyen(notes);
              const s = score ? scoreLabel(parseFloat(score)) : null;
              const last = notes[notes.length - 1];
              return (
                <tr key={l.id}>
                  <td><strong>{l.prenom} {l.nom}</strong></td>
                  <td>{l.telephone}</td>
                  <td>
                    {score ? (
                      <span style={{background: s.bg, color: s.color, padding:'4px 12px', borderRadius:20, fontWeight:700, fontSize:13}}>
                        ★ {score} — {s.label}
                      </span>
                    ) : <span style={{color:'#ccc', fontSize:12}}>Non noté</span>}
                  </td>
                  <td>{last ? <Etoiles note={last.note_paiement} /> : '—'}</td>
                  <td>{last ? <Etoiles note={last.note_entretien} /> : '—'}</td>
                  <td>{last ? <Etoiles note={last.note_comportement} /> : '—'}</td>
                  <td>
                    <button className="btn btn-sm" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'white'}}
                      onClick={() => { setSelected(l); setShowModal(true); }}>
                      ⭐ Noter
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>⭐ Noter — {selected.prenom} {selected.nom}</h2>
            <div style={{display:'flex', flexDirection:'column', gap:20, marginBottom:20}}>
              {[
                {key:'note_paiement', label:'💰 Ponctualité des paiements'},
                {key:'note_entretien', label:'🏠 Entretien du bien'},
                {key:'note_comportement', label:'🤝 Comportement général'},
              ].map(({key, label}) => (
                <div key={key}>
                  <div style={{fontSize:13, fontWeight:600, marginBottom:8}}>{label}</div>
                  <Etoiles note={form[key]} onNote={v => setForm({...form, [key]: v})} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Commentaire (optionnel)</label>
              <textarea rows={3} value={form.commentaire} onChange={e => setForm({...form, commentaire: e.target.value})}
                style={{width:'100%', padding:'10px', border:'2px solid #f0f0f5', borderRadius:10, fontSize:14, fontFamily:'inherit'}}
                placeholder="Ex: Toujours ponctuel, prend soin du logement..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer la note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
