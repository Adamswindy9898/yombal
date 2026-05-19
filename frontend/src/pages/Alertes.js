import React, { useEffect, useState } from 'react';
import { locatairesAPI } from '../services/api';

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);

  useEffect(() => { locatairesAPI.getAlertes().then(r => setAlertes(r.data)); }, []);

  return (
    <div>
      <h1 className="page-title">🔔 Alertes & Rappels</h1>
      <div className="card">
        {alertes.length === 0 && <div className="empty">Aucune alerte active ✅ Tout est en ordre !</div>}
        {alertes.map((a, i) => (
          <div key={i} className={`alert-item alert-${a.niveau}`}>
            <div className={`alert-dot dot-${a.niveau}`}></div>
            <div>
              <strong>{a.message}</strong>
              <div style={{fontSize:'12px', marginTop:'4px', opacity:0.7}}>Type : {a.type.replace(/_/g, ' ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
