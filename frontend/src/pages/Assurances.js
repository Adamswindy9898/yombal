import React, { useEffect, useState } from 'react';
import { assurancesAPI } from '../services/api';

const STATUT_BADGE = { actif: 'success', expire: 'danger', suspendu: 'warning' };

export default function Assurances() {
  const [assurances, setAssurances] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client_nom:'', client_telephone:'', vehicule_marque:'', vehicule_modele:'', vehicule_immatriculation:'', compagnie:'', numero_police:'', prime_annuelle:'', date_debut:'', date_expiration:'', statut:'actif', notes:'' });

  const load = () => {
    assurancesAPI.getAll().then(r => setAssurances(r.data));
    assurancesAPI.getAlertes().then(r => setAlertes(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await assurancesAPI.create({ ...form, prime_annuelle: parseFloat(form.prime_annuelle) });
    setShowModal(false);
    setForm({ client_nom:'', client_telephone:'', vehicule_marque:'', vehicule_modele:'', vehicule_immatriculation:'', compagnie:'', numero_police:'', prime_annuelle:'', date_debut:'', date_expiration:'', statut:'actif', notes:'' });
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce contrat ?')) { await assurancesAPI.delete(id); load(); }
  };

  const joursRestants = (dateExp) => {
    const diff = Math.ceil((new Date(dateExp) - new Date()) / (1000*60*60*24));
    if (diff <= 0) return <span className="badge badge-danger">Expiré</span>;
    if (diff <= 30) return <span className="badge badge-warning">{diff}j restants</span>;
    return <span className="badge badge-success">Actif</span>;
  };

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>🚗 Assurances Auto</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouveau contrat</button>
      </div>

      <div className="stats-row" style={{marginBottom:20}}>
        <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{assurances.length}</div><div className="stat-label">Total contrats</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{assurances.filter(a=>a.statut==='actif').length}</div><div className="stat-label">Actifs</div></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><div className="stat-value">{alertes.length}</div><div className="stat-label">Alertes</div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value">{assurances.reduce((s,a)=>s+a.prime_annuelle,0).toLocaleString()}</div><div className="stat-label">Primes/an (FCFA)</div></div>
      </div>

      {alertes.length > 0 && (
        <div className="card" style={{marginBottom:16}}>
          <div className="card-title">⚠️ Contrats à renouveler</div>
          {alertes.map((a,i) => (
            <div key={i} className={`alert-item alert-${a.niveau}`}>
              <div className={`alert-dot dot-${a.niveau}`}></div>
              <div><strong>{a.message}</strong></div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        {assurances.length === 0 && <div className="empty">Aucun contrat enregistré</div>}
        {assurances.length > 0 && (
          <table>
            <thead><tr><th>Client</th><th>Véhicule</th><th>Immatriculation</th><th>Compagnie</th><th>Prime/an</th><th>Expiration</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {assurances.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.client_nom}</strong><br/><small style={{color:'#888'}}>{a.client_telephone}</small></td>
                  <td>{a.vehicule_marque} {a.vehicule_modele}</td>
                  <td><strong>{a.vehicule_immatriculation}</strong></td>
                  <td>{a.compagnie}</td>
                  <td>{a.prime_annuelle.toLocaleString()} FCFA</td>
                  <td>{a.date_expiration}</td>
                  <td>{joursRestants(a.date_expiration)}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nouveau contrat d'assurance</h2>
            <div className="form-row">
              <div className="form-group"><label>Nom client</label><input value={form.client_nom} onChange={e=>setForm({...form,client_nom:e.target.value})} /></div>
              <div className="form-group"><label>Téléphone client</label><input value={form.client_telephone} onChange={e=>setForm({...form,client_telephone:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Marque véhicule</label><input value={form.vehicule_marque} onChange={e=>setForm({...form,vehicule_marque:e.target.value})} placeholder="Toyota" /></div>
              <div className="form-group"><label>Modèle</label><input value={form.vehicule_modele} onChange={e=>setForm({...form,vehicule_modele:e.target.value})} placeholder="Hilux" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Immatriculation</label><input value={form.vehicule_immatriculation} onChange={e=>setForm({...form,vehicule_immatriculation:e.target.value})} placeholder="DK-1234-A" /></div>
              <div className="form-group"><label>Compagnie</label><input value={form.compagnie} onChange={e=>setForm({...form,compagnie:e.target.value})} placeholder="NSIA, Allianz..." /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>N° police</label><input value={form.numero_police} onChange={e=>setForm({...form,numero_police:e.target.value})} /></div>
              <div className="form-group"><label>Prime annuelle (FCFA)</label><input type="number" value={form.prime_annuelle} onChange={e=>setForm({...form,prime_annuelle:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date début</label><input type="date" value={form.date_debut} onChange={e=>setForm({...form,date_debut:e.target.value})} /></div>
              <div className="form-group"><label>Date expiration</label><input type="date" value={form.date_expiration} onChange={e=>setForm({...form,date_expiration:e.target.value})} /></div>
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
