import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { locatairesAPI } from '../services/api';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Paiements() {
  const [locataires, setLocataires] = useState([]);
  const [selected, setSelected] = useState(null);
  const [historique, setHistorique] = useState(null);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ locataire_id:'', montant:'', date_paiement:'', mois:'', mode:'especes', notes:'' });

  useEffect(() => {
    locatairesAPI.getAll().then(r => setLocataires(r.data));
    axios.get(`${API_URL}/paiements/stats`).then(r => setStats(r.data));
  }, []);

  const loadHistorique = (loc) => {
    setSelected(loc);
    axios.get(`${API_URL}/paiements/locataire/${loc.id}`).then(r => setHistorique(r.data));
  };

  const handleSubmit = async () => {
    await axios.post(`${API_URL}/paiements/`, { ...form, locataire_id: parseInt(form.locataire_id), montant: parseFloat(form.montant) });
    setShowModal(false);
    setForm({ locataire_id:'', montant:'', date_paiement:'', mois:'', mode:'especes', notes:'' });
    axios.get(`${API_URL}/paiements/stats`).then(r => setStats(r.data));
    if (selected) loadHistorique(selected);
  };

  const moisActuel = new Date().toISOString().slice(0, 7);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>🧾 Historique des paiements</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Enregistrer un paiement</button>
      </div>

      {stats && (
        <div className="stats-row" style={{marginBottom:20}}>
          <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value">{stats.total_encaisse.toLocaleString()}</div><div className="stat-label">Total encaissé (FCFA)</div></div>
          <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value">{stats.revenu_mensuel_attendu.toLocaleString()}</div><div className="stat-label">Attendu/mois (FCFA)</div></div>
          <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{stats.nb_paiements}</div><div className="stat-label">Paiements enregistrés</div></div>
        </div>
      )}

      {stats && stats.par_mois.length > 0 && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-title">📊 Encaissements par mois</div>
          <div style={{display:'flex', gap:8, alignItems:'flex-end', height:120, padding:'10px 0'}}>
            {stats.par_mois.slice(-6).map((m, i) => {
              const max = Math.max(...stats.par_mois.map(x => x.montant));
              const h = Math.round((m.montant / max) * 100);
              return (
                <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                  <div style={{fontSize:10, color:'#888'}}>{m.montant.toLocaleString()}</div>
                  <div style={{width:'100%', height:`${h}px`, background:'#1D9E75', borderRadius:'4px 4px 0 0', minHeight:4}}></div>
                  <div style={{fontSize:10, color:'#666'}}>{m.mois}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <div className="card-title">👥 Sélectionner un locataire</div>
          {locataires.map(l => (
            <div key={l.id} onClick={() => loadHistorique(l)}
              style={{padding:'10px 12px', borderRadius:8, cursor:'pointer', marginBottom:6, background: selected?.id === l.id ? '#e1f5ee' : '#f9fafb', border: selected?.id === l.id ? '1.5px solid #1D9E75' : '1.5px solid transparent'}}>
              <div style={{fontWeight:600, fontSize:13}}>{l.prenom} {l.nom}</div>
              <div style={{fontSize:11, color:'#888'}}>{l.loyer_mensuel.toLocaleString()} FCFA/mois</div>
            </div>
          ))}
        </div>

        <div className="card">
          {!historique && <div className="empty">Sélectionnez un locataire pour voir son historique</div>}
          {historique && (
            <>
              <div className="card-title">🧾 {historique.locataire}</div>
              <div style={{display:'flex', gap:12, marginBottom:16}}>
                <div style={{background:'#e1f5ee', borderRadius:8, padding:'8px 14px', fontSize:13}}>
                  <div style={{fontWeight:700, color:'#1D9E75'}}>{historique.total_paye.toLocaleString()} FCFA</div>
                  <div style={{fontSize:11, color:'#888'}}>Total payé</div>
                </div>
                <div style={{background:'#f0f9ff', borderRadius:8, padding:'8px 14px', fontSize:13}}>
                  <div style={{fontWeight:700, color:'#0369a1'}}>{historique.nb_paiements}</div>
                  <div style={{fontSize:11, color:'#888'}}>Paiements</div>
                </div>
              </div>
              {historique.paiements.length === 0 && <div className="empty">Aucun paiement enregistré</div>}
              {historique.paiements.map((p, i) => (
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f0f0f0'}}>
                  <div>
                    <div style={{fontSize:13, fontWeight:600}}>{p.mois}</div>
                    <div style={{fontSize:11, color:'#888'}}>{p.date_paiement} — {p.mode}</div>
                  </div>
                  <div style={{fontWeight:700, color:'#1D9E75', fontSize:14}}>{p.montant.toLocaleString()} FCFA</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enregistrer un paiement</h2>
            <div className="form-group"><label>Locataire</label>
              <select value={form.locataire_id} onChange={e => setForm({...form, locataire_id: e.target.value})}>
                <option value="">-- Choisir --</option>
                {locataires.map(l => <option key={l.id} value={l.id}>{l.prenom} {l.nom} — {l.loyer_mensuel.toLocaleString()} FCFA</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Montant (FCFA)</label><input type="number" value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} /></div>
              <div className="form-group"><label>Mois (ex: 2026-04)</label><input type="month" value={form.mois} onChange={e => setForm({...form, mois: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date de paiement</label><input type="date" value={form.date_paiement} onChange={e => setForm({...form, date_paiement: e.target.value})} /></div>
              <div className="form-group"><label>Mode de paiement</label>
                <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>
                  <option value="especes">Espèces</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="cheque">Chèque</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Notes (optionnel)</label>
              <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Remarques..." />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
