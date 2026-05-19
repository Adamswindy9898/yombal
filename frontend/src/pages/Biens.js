import React, { useEffect, useState } from 'react';
import { biensAPI } from '../services/api';
import MediaUpload from '../components/MediaUpload';

const STATUTS = { disponible: 'success', loue: 'info', en_vente: 'warning' };
const STATUT_LABELS = { disponible: 'Disponible', loue: 'Loué', en_vente: 'En vente' };

export default function Biens() {
  const [biens, setBiens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(null);
  const [form, setForm] = useState({ reference:'', type:'appartement', adresse:'', ville:'', loyer:'', superficie:'', nb_pieces:'', statut:'disponible', description:'' });

  const load = () => biensAPI.getAll().then(r => setBiens(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await biensAPI.create({ ...form, loyer: parseFloat(form.loyer), superficie: parseFloat(form.superficie) || null, nb_pieces: parseInt(form.nb_pieces) || null });
    setShowModal(false);
    setForm({ reference:'', type:'appartement', adresse:'', ville:'', loyer:'', superficie:'', nb_pieces:'', statut:'disponible', description:'' });
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce bien ?')) { await biensAPI.delete(id); load(); }
  };

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>🏠 Biens immobiliers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un bien</button>
      </div>

      <div className="card">
        {biens.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🏠</div>
            <div>Aucun bien enregistré</div>
          </div>
        )}
        {biens.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Type</th>
                <th>Localisation</th>
                <th>Loyer (FCFA)</th>
                <th>Statut</th>
                <th>Médias</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {biens.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.reference}</strong></td>
                  <td style={{textTransform:'capitalize'}}>{b.type}</td>
                  <td>{b.adresse}, {b.ville}</td>
                  <td>{b.loyer.toLocaleString()}/mois</td>
                  <td><span className={`badge badge-${STATUTS[b.statut]}`}>{STATUT_LABELS[b.statut]}</span></td>
                  <td>
                    <button className="btn btn-sm"
                      style={{background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', fontWeight:700}}
                      onClick={() => setShowMediaModal(b)}>
                      📸 Photos / Vidéos
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL MEDIA */}
      {showMediaModal && (
        <div className="modal-overlay" onClick={() => setShowMediaModal(null)}>
          <div className="modal" style={{width:600}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
              <div>
                <h2 style={{marginBottom:4}}>📸 Médias — {showMediaModal.reference}</h2>
                <div style={{fontSize:13, color:'#888'}}>{showMediaModal.adresse}, {showMediaModal.ville}</div>
              </div>
              <button onClick={() => setShowMediaModal(null)}
                style={{background:'#f0f0f5', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
            </div>
            <div style={{background:'#f8f9ff', borderRadius:12, padding:20}}>
              <div style={{fontSize:13, color:'#555', marginBottom:12}}>
                📌 Formats acceptés : <strong>JPG, PNG, WEBP</strong> pour les photos — <strong>MP4, MOV</strong> pour les vidéos
              </div>
              <MediaUpload typeBien="bien" bienId={showMediaModal.id} label="Photos & Vidéos du bien" />
            </div>
            <div style={{marginTop:20, textAlign:'right'}}>
              <button className="btn btn-primary" onClick={() => setShowMediaModal(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT BIEN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ajouter un bien</h2>
            <div className="form-row">
              <div className="form-group"><label>Référence</label><input value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})} placeholder="IMM-001" /></div>
              <div className="form-group"><label>Type</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option value="appartement">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="bureau">Bureau</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})} placeholder="Rue 12, Quartier..." /></div>
            <div className="form-row">
              <div className="form-group"><label>Ville</label><input value={form.ville} onChange={e=>setForm({...form,ville:e.target.value})} placeholder="Thiès" /></div>
              <div className="form-group"><label>Loyer mensuel (FCFA)</label><input type="number" value={form.loyer} onChange={e=>setForm({...form,loyer:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Superficie (m²)</label><input type="number" value={form.superficie} onChange={e=>setForm({...form,superficie:e.target.value})} /></div>
              <div className="form-group"><label>Nb pièces</label><input type="number" value={form.nb_pieces} onChange={e=>setForm({...form,nb_pieces:e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Description</label>
              <textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:'100%',padding:'10px',border:'2px solid #f0f0f5',borderRadius:10,fontSize:14,fontFamily:'inherit'}} />
            </div>
            <div className="form-group"><label>Statut</label>
              <select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}>
                <option value="disponible">Disponible</option>
                <option value="loue">Loué</option>
                <option value="en_vente">En vente</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
