import React, { useEffect, useState } from 'react';
import { biensAPI, locatairesAPI } from '../services/api';

export default function Dashboard() {
  const [biens, setBiens] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    biensAPI.getAll().then(r => setBiens(r.data));
    locatairesAPI.getAll().then(r => setLocataires(r.data));
    locatairesAPI.getAlertes().then(r => setAlertes(r.data));
  }, []);

  const loues = biens.filter(b => b.statut === 'loue').length;
  const impayes = locataires.filter(l => l.statut_paiement === 'impaye').length;
  const revenuTotal = locataires.filter(l => l.actif).reduce((s, l) => s + l.loyer_mensuel, 0);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-icon">🏠</div><div className="stat-value">{biens.length}</div><div className="stat-label">Biens total</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{loues}</div><div className="stat-label">Biens loués</div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{locataires.filter(l=>l.actif).length}</div><div className="stat-label">Locataires actifs</div></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><div className="stat-value">{impayes}</div><div className="stat-label">Loyers impayés</div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value">{revenuTotal.toLocaleString()}</div><div className="stat-label">Revenus/mois (FCFA)</div></div>
      </div>
      <div className="card">
        <div className="card-title">🔔 Alertes actives ({alertes.length})</div>
        {alertes.length === 0 && <div className="empty">Aucune alerte pour le moment ✅</div>}
        {alertes.map((a, i) => (
          <div key={i} className={`alert-item alert-${a.niveau}`}>
            <div className={`alert-dot dot-${a.niveau}`}></div>
            <div><strong>{a.message}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}
