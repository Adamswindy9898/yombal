import React, { useEffect, useState } from 'react';
import { locatairesAPI, biensAPI } from '../services/api';

const PAIEMENT_LABELS = { paye: 'Payé', impaye: 'Impayé', en_retard: 'En retard' };
const PAIEMENT_BADGES = { paye: 'success', impaye: 'danger', en_retard: 'warning' };
const API_URL = 'http://127.0.0.1:8000/api';

export default function Locataires() {
  const [locataires, setLocataires] = useState([]);
  const [biens, setBiens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom:'', prenom:'', telephone:'', email:'', cni:'', bien_id:'', date_entree:'', date_fin_bail:'', loyer_mensuel:'', caution:'', statut_paiement:'paye', notes:'' });

  const load = () => { locatairesAPI.getAll().then(r => setLocataires(r.data)); biensAPI.getAll().then(r => setBiens(r.data)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await locatairesAPI.create({ ...form, bien_id: parseInt(form.bien_id), loyer_mensuel: parseFloat(form.loyer_mensuel), caution: parseFloat(form.caution) || 0 });
    setShowModal(false);
    setForm({ nom:'', prenom:'', telephone:'', email:'', cni:'', bien_id:'', date_entree:'', date_fin_bail:'', loyer_mensuel:'', caution:'', statut_paiement:'paye', notes:'' });
    load();
  };

  const togglePaiement = async (loc) => {
    const nouveau = loc.statut_paiement === 'paye' ? 'impaye' : 'paye';
    await locatairesAPI.update(loc.id, { statut_paiement: nouveau });
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce locataire ?')) { await locatairesAPI.delete(id); load(); }
  };

  const getBienRef = (id) => { const b = biens.find(b => b.id === id); return b ? b.reference : '-'; };
  const openPDF = (url) => window.open(url, '_blank');

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>👥 Locataires</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un locataire</button>
      </div>
      <div className="card">
        {locataires.length === 0 && <div className="empty">Aucun locataire enregistré</div>}
        {locataires.length > 0 && (
          <table>
            <thead><tr><th>Nom</th><th>Téléphone</th><th>Bien</th><th>Loyer (FCFA)</th><th>Fin bail</th><th>Paiement</th><th>Documents</th><th>Actions</th></tr></thead>
            <tbody>
              {locataires.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.prenom} {l.nom}</strong></td>
                  <td>{l.telephone}</td>
                  <td>{getBienRef(l.bien_id)}</td>
                  <td>{l.loyer_mensuel.toLocaleString()}</td>
                  <td>{l.date_fin_bail || '-'}</td>
                  <td><span className={`badge badge-${PAIEMENT_BADGES[l.statut_paiement]}`} style={{cursor:'pointer'}} onClick={() => togglePaiement(l)}>{PAIEMENT_LABELS[l.statut_paiement]}</span></td>
                  <td>
                    <button className="btn btn-sm" style={{background:'#e0f2fe',color:'#0369a1',marginRight:4}} onClick={() => openPDF(`${API_URL}/pdf/quittance/${l.id}`)}>📄 Quittance</button>
                    <button className="btn btn-sm" style={{background:'#f0fdf4',color:'#166534'}} onClick={() => openPDF(`${API_URL}/pdf/bail/${l.id}`)}>📋 Bail</button>
                  </td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ajouter un locataire</h2>
            <div className="form-row">
              <div className="form-group"><label>Prénom</label><input value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} /></div>
              <div className="form-group"><label>Nom</label><input value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Téléphone</label><input value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>CNI</label><input value={form.cni} onChange={e=>setForm({...form,cni:e.target.value})} /></div>
              <div className="form-group"><label>Bien associé</label>
                <select value={form.bien_id} onChange={e=>setForm({...form,bien_id:e.target.value})}>
                  <option value="">-- Choisir --</option>
                  {biens.map(b => <option key={b.id} value={b.id}>{b.reference} - {b.ville}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date entrée</label><input type="date" value={form.date_entree} onChange={e=>setForm({...form,date_entree:e.target.value})} /></div>
              <div className="form-group"><label>Fin de bail</label><input type="date" value={form.date_fin_bail} onChange={e=>setForm({...form,date_fin_bail:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Loyer mensuel (FCFA)</label><input type="number" value={form.loyer_mensuel} onChange={e=>setForm({...form,loyer_mensuel:e.target.value})} /></div>
              <div className="form-group"><label>Caution (FCFA)</label><input type="number" value={form.caution} onChange={e=>setForm({...form,caution:e.target.value})} /></div>
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
