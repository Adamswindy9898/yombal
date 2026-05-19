import React, { useEffect, useState } from 'react';
import { biensAPI, terrainsAPI } from '../services/api';

export default function Carte() {
  const [biens, setBiens] = useState([]);
  const [terrains, setTerrains] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    biensAPI.getAll().then(r => setBiens(r.data));
    terrainsAPI.getAll().then(r => setTerrains(r.data));
  }, []);

  useEffect(() => {
    // Charger Leaflet dynamiquement
    if (window.L) { initMap(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initMap;
    document.head.appendChild(script);
  }, [biens, terrains]);

  const initMap = () => {
    if (!window.L) return;
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl || mapEl._leaflet_id) return;

    const map = window.L.map('leaflet-map').setView([14.7645, -17.3660], 8);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Icône bien
    const iconBien = window.L.divIcon({
      html: '<div style="background:#1D9E75;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">🏠</div>',
      className: '', iconSize: [36, 36], iconAnchor: [18, 18]
    });

    // Icône terrain
    const iconTerrain = window.L.divIcon({
      html: '<div style="background:#f59e0b;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">🌍</div>',
      className: '', iconSize: [36, 36], iconAnchor: [18, 18]
    });

    // Ajouter biens avec coords
    biens.filter(b => b.latitude && b.longitude).forEach(b => {
      window.L.marker([b.latitude, b.longitude], {icon: iconBien})
        .addTo(map)
        .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">🏠 ${b.reference}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px">${b.adresse}, ${b.ville}</div>
          <div style="font-size:13px;color:#1D9E75;font-weight:700">${b.loyer.toLocaleString()} FCFA/mois</div>
          <div style="margin-top:8px"><span style="background:${b.statut==='loue'?'#dbeafe':'#dcfce7'};padding:2px 8px;border-radius:10px;font-size:11px">${b.statut}</span></div>
        </div>`);
    });

    // Ajouter terrains avec coords
    terrains.filter(t => t.latitude && t.longitude).forEach(t => {
      window.L.marker([t.latitude, t.longitude], {icon: iconTerrain})
        .addTo(map)
        .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">🌍 ${t.reference}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px">${t.adresse}, ${t.ville}</div>
          <div style="font-size:13px;color:#f59e0b;font-weight:700">${t.prix.toLocaleString()} FCFA</div>
          <div style="font-size:12px;color:#888">${t.superficie} m²</div>
          <div style="margin-top:8px"><span style="background:#fef9c3;padding:2px 8px;border-radius:10px;font-size:11px">${t.statut}</span></div>
        </div>`);
    });
  };

  const biensSansCoords = biens.filter(b => !b.latitude || !b.longitude);
  const terrainsSansCoords = terrains.filter(t => !t.latitude || !t.longitude);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{margin:0}}>🗺️ Carte interactive</h1>
        <div style={{display:'flex', gap:8}}>
          {['tous','biens','terrains'].map(f => (
            <button key={f} className="btn btn-sm"
              style={{background: filtre===f?'#1D9E75':'white', color: filtre===f?'white':'#555', border:'1.5px solid', borderColor: filtre===f?'#1D9E75':'#e5e7eb'}}>
              {f === 'tous' ? '🏘️ Tous' : f === 'biens' ? '🏠 Biens' : '🌍 Terrains'}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:20}}>
        {/* CARTE */}
        <div className="card" style={{padding:0, overflow:'hidden', height:520}}>
          <div id="leaflet-map" style={{width:'100%', height:'100%'}}></div>
        </div>

        {/* LISTE */}
        <div style={{display:'flex', flexDirection:'column', gap:12, maxHeight:520, overflowY:'auto'}}>
          {biens.filter(b => b.latitude && b.longitude).map(b => (
            <div key={b.id} className="card" style={{padding:14, cursor:'pointer', margin:0}}
              onClick={() => setSelected(b)}>
              <div style={{fontWeight:700, fontSize:13}}>🏠 {b.reference}</div>
              <div style={{fontSize:12, color:'#888'}}>{b.ville}</div>
              <div style={{fontSize:13, color:'#1D9E75', fontWeight:700}}>{b.loyer.toLocaleString()} FCFA</div>
            </div>
          ))}
          {terrains.filter(t => t.latitude && t.longitude).map(t => (
            <div key={t.id} className="card" style={{padding:14, cursor:'pointer', margin:0}}
              onClick={() => setSelected(t)}>
              <div style={{fontWeight:700, fontSize:13}}>🌍 {t.reference}</div>
              <div style={{fontSize:12, color:'#888'}}>{t.ville}</div>
              <div style={{fontSize:13, color:'#f59e0b', fontWeight:700}}>{t.prix.toLocaleString()} FCFA</div>
            </div>
          ))}

          {(biensSansCoords.length > 0 || terrainsSansCoords.length > 0) && (
            <div style={{background:'#fef9c3', borderRadius:10, padding:12, fontSize:12, color:'#854d0e'}}>
              ⚠️ {biensSansCoords.length + terrainsSansCoords.length} bien(s)/terrain(s) sans coordonnées GPS — ajoutez latitude/longitude pour les afficher
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
