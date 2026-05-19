import React, { useEffect, useState } from 'react';
import { terrainsAPI } from '../services/api';
import MediaUpload from '../components/MediaUpload';

const STATUTS = { disponible: 'success', negotiation: 'warning', vendu: 'danger' };
const STATUT_LABELS = { disponible: 'Disponible', negotiation: 'Négociation', vendu: 'Vendu' };
const ZONES = { residentielle: 'Résidentielle', commerciale: 'Commerciale', agricole: 'Agricole', autre: 'Autre' };

export default function Terrains() {
  const [terrains, setTerrains] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filtre, setFiltre] = useState('tous');
  const [form, setForm] = useState({ reference:'', adresse:'', ville:'', superficie:'', prix:'', statut:'disponible', zone:'residentielle', description:'', latitude:'', longitude:'' });

  const load = () => terrainsAPI.getAll().then(r => setTerrains(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await terrainsAPI.create({ ...form, superficie: parseFloat(form.superficie), prix: parseFloat(form.prix), latitude: parseFloat(form.latitude) || null, longitude: parseFloat(form.longitude) || null });
    setShowModal(false);
    setForm({ reference:'', adresse:'', ville:'', superficie:'', prix:'', statut:'disponible', zone:'residentielle', description:'', latitude:'', longitude:'' });
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce terrain ?')) { await terrainsAPI.delete(id); load(); setSelected(null); }
  };

  const filtres = terrains.filter(t => filtre === 'tous' || t.statut === filtre);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>🌍 Terrains</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un terrain</button>
      </div>

      <div className="stats-row" style={{marginBottom:20}}>
        <div className="stat-card"><div className="stat-icon">🌍</div><div className="stat-value">{terrains.length}</div><div className="stat-label">Total terrains</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{terrains.filter(t=>t.statut==='disponible').length}</div><div className="stat-label">Disponibles</div></div>
        <div className="stat-card"><div className="stat-icon">🤝</div><div className="stat-value">{terrains.filter(t=>t.statut==='negotiation').length}</div><div className="stat-label">En négociation</div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value">{terrains.filter(t=>t.statut==='vendu').length}</div><div className="stat-label">Vendus</div></div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:16}}>
        {['tous','disponible','negotiation','vendu'].map(f => (
          <button key={f} className="btn" style={{background: filtre===f ? '#1D9E75':'white', color: filtre===f ? 'white':'#333', border:'1px solid #e5e7eb', fontSize:12}} onClick={() => setFiltre(f)}>
            {f === 'tous' ? 'Tous' : STATUT_LABELS[f]}
          </button>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap:20}}>
        <div className="card">
          {filtres.length === 0 && <div className="empty">Aucun terrain trouvé</div>}
          {filtres.length > 0 && (
            <table>
              <thead><tr><th>Référence</th><th>Localisation</th><th>Superficie</th><th>Prix (FCFA)</th><th>Zone</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {filtres.map(t => (
                  <tr key={t.id} style={{cursor:'pointer', background: selected?.id === t.id ? '#f0fdf4' : 'white'}} onClick={() => setSelected(t)}>
                    <td><strong>{t.reference}</strong></td>
                    <td>{t.adresse}, {t.ville}</td>
                    <td>{t.superficie} m²</td>
                    <td>{t.prix.toLocaleString()}</td>
                    <td><span style={{fontSize:12, color:'#666'}}>{ZONES[t.zone] || t.zone}</span></td>
                    <td><span className={`badge badge-${STATUTS[t.statut]}`}>{STATUT_LABELS[t.statut]}</span></td>
                    <td><button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleDelete(t.id); }}>Supprimer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <div style={{fontWeight:700, fontSize:15}}>📍 {selected.reference} — {selected.ville}</div>
              <button onClick={() => setSelected(null)} style={{background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#888'}}>✕</button>
            </div>
            <div style={{fontSize:13, color:'#666', marginBottom:4}}>📐 {selected.superficie} m² — {ZONES[selected.zone]}</div>
            <div style={{fontSize:13, color:'#1D9E75', fontWeight:700, marginBottom:4}}>💰 {selected.prix.toLocaleString()} FCFA</div>
            <div style={{fontSize:13, color:'#888', marginBottom:4}}>💡 {Math.round(selected.prix/selected.superficie).toLocaleString()} FCFA/m²</div>
            {selected.description && <div style={{fontSize:13, color:'#888', marginTop:8, fontStyle:'italic'}}>{selected.description}</div>}
            <MediaUpload typeBien="terrain" bienId={selected.id} label="Photos & Vidéos du terrain" />
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ajouter un terrain</h2>
            <div className="form-row">
              <div className="form-group"><label>Référence</label><input value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})} placeholder="TER-001" /></div>
              <div className="form-group"><label>Zone</label>
                <select value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})}>
                  <option value="residentielle">Résidentielle</option>
                  <option value="commerciale">Commerciale</option>
                  <option value="agricole">Agricole</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})} placeholder="Quartier..." /></div>
            <div className="form-row">
              <div className="form-group"><label>Ville</label><input value={form.ville} onChange={e=>setForm({...form,ville:e.target.value})} placeholder="Thiès" /></div>
              <div className="form-group"><label>Statut</label>
                <select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}>
                  <option value="disponible">Disponible</option>
                  <option value="negotiation">Négociation</option>
                  <option value="vendu">Vendu</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Superficie (m²)</label><input type="number" value={form.superficie} onChange={e=>setForm({...form,superficie:e.target.value})} /></div>
              <div className="form-group"><label>Prix total (FCFA)</label><input type="number" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Description</label>
              <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:'100%',padding:'10px',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:14}} />
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
