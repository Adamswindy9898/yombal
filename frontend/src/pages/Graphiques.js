import React, { useEffect, useState } from 'react';
import { biensAPI, locatairesAPI, terrainsAPI, assurancesAPI } from '../services/api';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

function BarreProgression({ label, valeur, max, couleur }) {
  const pct = max > 0 ? Math.round((valeur / max) * 100) : 0;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
        <span style={{fontSize:13, color:'#555'}}>{label}</span>
        <span style={{fontSize:13, fontWeight:700}}>{valeur.toLocaleString()} FCFA</span>
      </div>
      <div style={{height:8, background:'#f0f0f5', borderRadius:4, overflow:'hidden'}}>
        <div style={{height:'100%', width:`${pct}%`, background:couleur, borderRadius:4, transition:'width 1s ease'}}></div>
      </div>
    </div>
  );
}

function MiniBarChart({ data, couleur }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.montant));
  return (
    <div style={{display:'flex', gap:4, alignItems:'flex-end', height:80, padding:'0 4px'}}>
      {data.slice(-8).map((d, i) => {
        const h = max > 0 ? Math.max(4, Math.round((d.montant / max) * 72)) : 4;
        return (
          <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
            <div style={{fontSize:9, color:'#aaa', textAlign:'center'}}>{d.montant > 0 ? (d.montant/1000).toFixed(0)+'k' : ''}</div>
            <div style={{width:'100%', height:`${h}px`, background:couleur, borderRadius:'3px 3px 0 0', minHeight:4}}></div>
            <div style={{fontSize:9, color:'#888', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:32}}>{d.mois?.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Graphiques() {
  const [biens, setBiens] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [terrains, setTerrains] = useState([]);
  const [assurances, setAssurances] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    biensAPI.getAll().then(r => setBiens(r.data));
    locatairesAPI.getAll().then(r => setLocataires(r.data));
    terrainsAPI.getAll().then(r => setTerrains(r.data));
    assurancesAPI.getAll().then(r => setAssurances(r.data));
    axios.get(`${API_URL}/paiements/stats`).then(r => setStats(r.data));
  }, []);

  const loues = biens.filter(b => b.statut === 'loue').length;
  const dispos = biens.filter(b => b.statut === 'disponible').length;
  const txOccupation = biens.length > 0 ? Math.round((loues / biens.length) * 100) : 0;
  const revenuMensuel = locataires.filter(l => l.actif).reduce((s, l) => s + l.loyer_mensuel, 0);
  const impayes = locataires.filter(l => l.statut_paiement === 'impaye').length;
  const txPaiement = locataires.length > 0 ? Math.round(((locataires.length - impayes) / locataires.length) * 100) : 0;
  const terrainsVendus = terrains.filter(t => t.statut === 'vendu').length;
  const revenuTerrains = terrains.filter(t => t.statut === 'vendu').reduce((s, t) => s + t.prix, 0);

  const typesBiens = ['appartement','villa','studio','bureau','autre'].map(t => ({
    type: t, count: biens.filter(b => b.type === t).length
  })).filter(t => t.count > 0);

  return (
    <div>
      <h1 className="page-title">📊 Statistiques & Graphiques</h1>

      {/* KPIs principaux */}
      <div className="stats-row" style={{marginBottom:24}}>
        <div className="stat-card" style={{borderLeft:'4px solid #1D9E75'}}>
          <div className="stat-icon">💰</div>
          <div className="stat-value">{revenuMensuel.toLocaleString()}</div>
          <div className="stat-label">Revenus loc./mois (FCFA)</div>
        </div>
        <div className="stat-card" style={{borderLeft:'4px solid #3b82f6'}}>
          <div className="stat-icon">🏠</div>
          <div className="stat-value">{txOccupation}%</div>
          <div className="stat-label">Taux d'occupation</div>
          <div className="stat-change">{loues} loué(s) / {biens.length} total</div>
        </div>
        <div className="stat-card" style={{borderLeft:'4px solid #f59e0b'}}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{txPaiement}%</div>
          <div className="stat-label">Taux de paiement</div>
          <div className="stat-change">{impayes > 0 ? `⚠️ ${impayes} impayé(s)` : '✅ Tout payé'}</div>
        </div>
        <div className="stat-card" style={{borderLeft:'4px solid #8b5cf6'}}>
          <div className="stat-icon">🌍</div>
          <div className="stat-value">{revenuTerrains.toLocaleString()}</div>
          <div className="stat-label">Ventes terrains (FCFA)</div>
          <div className="stat-change">{terrainsVendus} terrain(s) vendu(s)</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}}>

        {/* Occupation des biens */}
        <div className="card">
          <div className="card-title">🏠 Occupation des biens</div>
          <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
            <div style={{position:'relative', width:120, height:120}}>
              <svg viewBox="0 0 36 36" style={{width:120, height:120, transform:'rotate(-90deg)'}}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f5" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1D9E75" strokeWidth="3"
                  strokeDasharray={`${txOccupation} ${100 - txOccupation}`} strokeLinecap="round" />
              </svg>
              <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <div style={{fontSize:22, fontWeight:800, color:'#1D9E75'}}>{txOccupation}%</div>
                <div style={{fontSize:10, color:'#888'}}>occupé</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
            <span style={{background:'#dcfce7', color:'#15803d', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600}}>✅ {loues} loué(s)</span>
            <span style={{background:'#f3f4f6', color:'#555', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600}}>🔑 {dispos} libre(s)</span>
          </div>
        </div>

        {/* Types de biens */}
        <div className="card">
          <div className="card-title">📋 Répartition par type</div>
          {typesBiens.map(t => (
            <BarreProgression key={t.type}
              label={`${t.type.charAt(0).toUpperCase() + t.type.slice(1)} (${t.count})`}
              valeur={t.count * (biens.filter(b => b.type === t.type).reduce((s,b) => s+b.loyer,0) / t.count || 0)}
              max={revenuMensuel || 1}
              couleur="#1D9E75" />
          ))}
          {typesBiens.length === 0 && <div className="empty">Aucun bien enregistré</div>}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}}>

        {/* Historique paiements */}
        <div className="card">
          <div className="card-title">💰 Encaissements par mois</div>
          {stats && stats.par_mois.length > 0 ? (
            <>
              <MiniBarChart data={stats.par_mois} couleur="linear-gradient(180deg,#1D9E75,#15a878)" />
              <div style={{marginTop:12, display:'flex', justifyContent:'space-between', fontSize:12, color:'#888'}}>
                <span>Total encaissé</span>
                <span style={{fontWeight:700, color:'#1D9E75'}}>{stats.total_encaisse.toLocaleString()} FCFA</span>
              </div>
            </>
          ) : <div className="empty">Aucun paiement enregistré</div>}
        </div>

        {/* Terrains */}
        <div className="card">
          <div className="card-title">🌍 Statut des terrains</div>
          {['disponible','negotiation','vendu'].map(s => {
            const count = terrains.filter(t => t.statut === s).length;
            const pct = terrains.length > 0 ? Math.round((count / terrains.length) * 100) : 0;
            const colors = {disponible:'#1D9E75', negotiation:'#f59e0b', vendu:'#8b5cf6'};
            const labels = {disponible:'Disponible', negotiation:'En négociation', vendu:'Vendu'};
            return (
              <div key={s} style={{marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                  <span style={{fontSize:13}}>{labels[s]}</span>
                  <span style={{fontSize:13, fontWeight:700}}>{count} ({pct}%)</span>
                </div>
                <div style={{height:8, background:'#f0f0f5', borderRadius:4}}>
                  <div style={{height:'100%', width:`${pct}%`, background:colors[s], borderRadius:4, transition:'width 1s'}}></div>
                </div>
              </div>
            );
          })}
          {terrains.length === 0 && <div className="empty">Aucun terrain</div>}
        </div>
      </div>

      {/* Assurances */}
      <div className="card">
        <div className="card-title">🚗 Assurances auto</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
          {[
            {label:'Total contrats', val:assurances.length, color:'#1a1a2e'},
            {label:'Actifs', val:assurances.filter(a=>a.statut==='actif').length, color:'#1D9E75'},
            {label:'Primes/an (FCFA)', val:assurances.reduce((s,a)=>s+a.prime_annuelle,0).toLocaleString(), color:'#f59e0b'},
            {label:'À renouveler', val:assurances.filter(a=>{ const j=(new Date(a.date_expiration)-new Date())/(1000*60*60*24); return j<=30; }).length, color:'#ef4444'},
          ].map((item,i) => (
            <div key={i} style={{textAlign:'center', padding:16, background:'#f8f9ff', borderRadius:12}}>
              <div style={{fontSize:22, fontWeight:800, color:item.color}}>{item.val}</div>
              <div style={{fontSize:12, color:'#888', marginTop:4}}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
