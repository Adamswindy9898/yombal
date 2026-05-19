import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormulaireContact from '../components/FormulaireContact';

const API_URL = 'http://127.0.0.1:8000/api';
const WHATSAPP = "221776316751";

function whatsappLink(msg) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function Lightbox({ medias, index, onClose }) {
  const [current, setCurrent] = useState(index);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % medias.length);
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + medias.length) % medias.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [medias.length, onClose]);

  const m = medias[current];
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,cursor:'zoom-out'}}>
      <button onClick={onClose} style={{position:'absolute',top:20,right:24,background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:44,height:44,borderRadius:'50%',fontSize:20,cursor:'pointer'}}>✕</button>
      <div style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,0.6)',fontSize:13}}>{current+1}/{medias.length}</div>
      {medias.length>1 && <button onClick={e=>{e.stopPropagation();setCurrent(c=>(c-1+medias.length)%medias.length);}} style={{position:'absolute',left:20,background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:48,height:48,borderRadius:'50%',fontSize:24,cursor:'pointer'}}>‹</button>}
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:'90vw',maxHeight:'85vh'}}>
        {m.type_fichier==='photo' ? <img src={m.url} alt="" style={{maxWidth:'90vw',maxHeight:'85vh',objectFit:'contain',borderRadius:8}} /> : <video src={m.url} controls autoPlay style={{maxWidth:'90vw',maxHeight:'85vh',borderRadius:8}} />}
      </div>
      {medias.length>1 && <button onClick={e=>{e.stopPropagation();setCurrent(c=>(c+1)%medias.length);}} style={{position:'absolute',right:20,background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:48,height:48,borderRadius:'50%',fontSize:24,cursor:'pointer'}}>›</button>}
      {medias.length>1 && (
        <div style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
          {medias.map((_,i)=>(
            <div key={i} onClick={e=>{e.stopPropagation();setCurrent(i);}} style={{width:44,height:44,borderRadius:6,overflow:'hidden',cursor:'pointer',border:i===current?'2px solid #1D9E75':'2px solid transparent',opacity:i===current?1:0.5}}>
              {medias[i].type_fichier==='photo'?<img src={medias[i].url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />:<div style={{width:'100%',height:'100%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>🎥</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Galerie({ typeBien, bienId }) {
  const [medias, setMedias] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => { axios.get(`${API_URL}/media/${typeBien}/${bienId}`).then(r=>setMedias(r.data)).catch(()=>{}); }, [bienId]);
  const photos = medias.filter(m=>m.type_fichier==='photo');
  if (medias.length===0) return <div style={{height:220,background:typeBien==='terrain'?'linear-gradient(135deg,#fef9e7,#fdebd0)':'linear-gradient(135deg,#e0f2fe,#bae6fd)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:56}}>{typeBien==='terrain'?'🌍':'🏠'}</div>;
  if (photos.length>=2) return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'150px 70px',gap:2,height:222}}>
        <div style={{gridRow:'1/3',overflow:'hidden',cursor:'zoom-in',position:'relative'}} onClick={()=>setLightbox(0)}>
          <img src={photos[0].url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
        </div>
        {photos.slice(1,3).map((p,i)=>(
          <div key={i} style={{overflow:'hidden',cursor:'zoom-in',position:'relative'}} onClick={()=>setLightbox(i+1)}>
            <img src={p.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s'}} onMouseEnter={e=>e.target.style.transform='scale(1.08)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
            {i===1&&photos.length>3&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14}}>+{photos.length-3} photos</div>}
          </div>
        ))}
      </div>
      <div style={{padding:'6px 12px',background:'#1a1a2e',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:'rgba(255,255,255,0.7)',fontSize:12}}>📸 {photos.length} photo(s)</span>
        <button onClick={()=>setLightbox(0)} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',padding:'4px 12px',borderRadius:6,fontSize:12,cursor:'pointer',fontWeight:600}}>Voir tout →</button>
      </div>
      {lightbox!==null&&<Lightbox medias={photos} index={lightbox} onClose={()=>setLightbox(null)} />}
    </>
  );
  return (
    <>
      <div style={{height:220,overflow:'hidden',cursor:'zoom-in',position:'relative'}} onClick={()=>setLightbox(0)}>
        <img src={photos[0]?.url||''} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
        <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,0.6)',color:'white',fontSize:12,padding:'4px 10px',borderRadius:20,fontWeight:600}}>🔍 Agrandir</div>
      </div>
      {lightbox!==null&&<Lightbox medias={medias} index={lightbox} onClose={()=>setLightbox(null)} />}
    </>
  );
}

function CardBien({ bien }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div style={{background:'white',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'transform 0.2s,box-shadow 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}>
      <Galerie typeBien="bien" bienId={bien.id} />
      <div style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div><div style={{fontSize:11,color:'#1D9E75',fontWeight:700,textTransform:'uppercase',marginBottom:4}}>{bien.type}</div><div style={{fontSize:16,fontWeight:700,color:'#1a1a2e'}}>{bien.adresse}</div></div>
          <span style={{background:'#dcfce7',color:'#15803d',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,whiteSpace:'nowrap'}}>À louer</span>
        </div>
        <div style={{fontSize:13,color:'#888',marginBottom:10}}>📍 {bien.ville}</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
          {bien.superficie&&<span style={{fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:8,color:'#555'}}>📐 {bien.superficie} m²</span>}
          {bien.nb_pieces&&<span style={{fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:8,color:'#555'}}>🚪 {bien.nb_pieces} pièces</span>}
        </div>
        {bien.description&&<div style={{fontSize:12,color:'#888',marginBottom:12,lineHeight:1.6}}>{bien.description}</div>}
        <div style={{fontSize:24,fontWeight:800,color:'#1D9E75',marginBottom:16}}>{bien.loyer.toLocaleString()} <span style={{fontSize:13,fontWeight:400,color:'#aaa'}}>FCFA/mois</span></div>
        {!showForm ? (
          <div style={{display:'flex',gap:8}}>
            <a href={whatsappLink(`Bonjour ImmoPro ! Je suis intéressé par le ${bien.type} à ${bien.adresse}, ${bien.ville} (${bien.loyer.toLocaleString()} FCFA/mois). Je voudrais louer.`)} target="_blank" rel="noreferrer" style={{flex:1,textAlign:'center',background:'#25D366',color:'white',padding:'11px',borderRadius:10,textDecoration:'none',fontSize:13,fontWeight:700,display:'block'}}>📲 WhatsApp</a>
            <button onClick={()=>setShowForm(true)} style={{flex:1,background:'linear-gradient(135deg,#1D9E75,#15a878)',color:'white',border:'none',borderRadius:10,padding:'11px',fontSize:13,fontWeight:700,cursor:'pointer'}}>📝 Laisser mes coordonnées</button>
          </div>
        ) : (
          <div style={{background:'#f8f9ff',borderRadius:12,padding:16}}>
            <FormulaireContact bienRef={bien.reference} bienNom={`${bien.type} à ${bien.ville}`} onClose={()=>setShowForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function CardTerrain({ terrain }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div style={{background:'white',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'transform 0.2s,box-shadow 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}>
      <Galerie typeBien="terrain" bienId={terrain.id} />
      <div style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div><div style={{fontSize:11,color:'#f59e0b',fontWeight:700,textTransform:'uppercase',marginBottom:4}}>Terrain {terrain.zone}</div><div style={{fontSize:16,fontWeight:700,color:'#1a1a2e'}}>{terrain.adresse}</div></div>
          <span style={{background:'#fef9c3',color:'#854d0e',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,whiteSpace:'nowrap'}}>À vendre</span>
        </div>
        <div style={{fontSize:13,color:'#888',marginBottom:10}}>📍 {terrain.ville}</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
          <span style={{fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:8,color:'#555'}}>📐 {terrain.superficie} m²</span>
          <span style={{fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:8,color:'#555'}}>💡 {Math.round(terrain.prix/terrain.superficie).toLocaleString()} FCFA/m²</span>
        </div>
        {terrain.description&&<div style={{fontSize:12,color:'#888',marginBottom:12,lineHeight:1.6}}>{terrain.description}</div>}
        <div style={{fontSize:24,fontWeight:800,color:'#f59e0b',marginBottom:16}}>{terrain.prix.toLocaleString()} <span style={{fontSize:13,fontWeight:400,color:'#aaa'}}>FCFA</span></div>
        {!showForm ? (
          <div style={{display:'flex',gap:8}}>
            <a href={whatsappLink(`Bonjour ImmoPro ! Je suis intéressé par le terrain à ${terrain.adresse}, ${terrain.ville} (${terrain.superficie}m² — ${terrain.prix.toLocaleString()} FCFA).`)} target="_blank" rel="noreferrer" style={{flex:1,textAlign:'center',background:'#25D366',color:'white',padding:'11px',borderRadius:10,textDecoration:'none',fontSize:13,fontWeight:700,display:'block'}}>📲 WhatsApp</a>
            <button onClick={()=>setShowForm(true)} style={{flex:1,background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'white',border:'none',borderRadius:10,padding:'11px',fontSize:13,fontWeight:700,cursor:'pointer'}}>📝 Me contacter</button>
          </div>
        ) : (
          <div style={{background:'#f8f9ff',borderRadius:12,padding:16}}>
            <FormulaireContact bienRef={terrain.reference} bienNom={`Terrain à ${terrain.ville}`} onClose={()=>setShowForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Vitrine() {
  const [biens, setBiens] = useState([]);
  const [terrains, setTerrains] = useState([]);
  const [onglet, setOnglet] = useState('tous');
  const [filtre, setFiltre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get(`${API_URL}/public/biens`), axios.get(`${API_URL}/public/terrains`)]).then(([b,t])=>{setBiens(b.data);setTerrains(t.data);setLoading(false);});
  }, []);

  const biensFiltres = biens.filter(b=>b.ville?.toLowerCase().includes(filtre.toLowerCase())||b.adresse?.toLowerCase().includes(filtre.toLowerCase())||b.type?.toLowerCase().includes(filtre.toLowerCase()));
  const terrainsFiltres = terrains.filter(t=>t.ville?.toLowerCase().includes(filtre.toLowerCase())||t.adresse?.toLowerCase().includes(filtre.toLowerCase()));

  return (
    <div style={{minHeight:'100vh',background:'#f0f2f8',fontFamily:'Inter,Segoe UI,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg,#0f0c29,#1a1a4e,#1D9E75)',color:'white',padding:'40px 40px 50px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:34,fontWeight:800,marginBottom:6,letterSpacing:-1}}>🏠 Immo<span style={{color:'#4ade80'}}>Pro</span></div>
          <div style={{fontSize:15,opacity:0.75,marginBottom:24}}>Votre partenaire immobilier de confiance au Sénégal</div>
          <div style={{background:'white',borderRadius:14,padding:'6px 6px 6px 20px',display:'flex',gap:10,maxWidth:520,boxShadow:'0 8px 30px rgba(0,0,0,0.2)'}}>
            <input placeholder="🔍 Rechercher par ville, quartier, type..." value={filtre} onChange={e=>setFiltre(e.target.value)} style={{flex:1,border:'none',outline:'none',fontSize:14,color:'#333',background:'transparent'}} />
            <button style={{background:'linear-gradient(135deg,#1D9E75,#15a878)',color:'white',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer'}}>Rechercher</button>
          </div>
          <div style={{display:'flex',gap:16,marginTop:20,flexWrap:'wrap'}}>
            <a href={whatsappLink("Bonjour ImmoPro ! Je voudrais avoir des informations sur vos biens disponibles.")} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#25D366',color:'white',padding:'11px 22px',borderRadius:12,textDecoration:'none',fontSize:14,fontWeight:700}}>📲 WhatsApp — 776 316 751</a>
            <div style={{display:'flex',alignItems:'center',fontSize:13,opacity:0.7}}>📞 +221 77 631 67 51</div>
          </div>
        </div>
      </div>

      <div style={{background:'white',borderBottom:'1px solid #e5e7eb',padding:'14px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',gap:24,alignItems:'center'}}>
          <div style={{fontSize:13,color:'#555'}}><strong style={{color:'#1D9E75',fontSize:18}}>{biens.length}</strong> biens disponibles</div>
          <div style={{width:1,height:20,background:'#e5e7eb'}}></div>
          <div style={{fontSize:13,color:'#555'}}><strong style={{color:'#f59e0b',fontSize:18}}>{terrains.length}</strong> terrains à vendre</div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'30px 40px'}}>
        <div style={{display:'flex',gap:10,marginBottom:28}}>
          {[{key:'tous',label:`🏘️ Tout (${biens.length+terrains.length})`},{key:'biens',label:`🏠 À louer (${biens.length})`},{key:'terrains',label:`🌍 À vendre (${terrains.length})`}].map(o=>(
            <button key={o.key} onClick={()=>setOnglet(o.key)} style={{padding:'10px 22px',borderRadius:12,border:'none',cursor:'pointer',fontSize:13,fontWeight:700,background:onglet===o.key?'linear-gradient(135deg,#1D9E75,#15a878)':'white',color:onglet===o.key?'white':'#555',boxShadow:onglet===o.key?'0 4px 12px rgba(29,158,117,0.3)':'0 1px 4px rgba(0,0,0,0.08)'}}>
              {o.label}
            </button>
          ))}
        </div>

        {loading&&<div style={{textAlign:'center',padding:60,color:'#aaa'}}><div style={{fontSize:40,marginBottom:12}}>⏳</div>Chargement des annonces...</div>}

        {!loading&&(onglet==='tous'||onglet==='biens')&&(
          <div style={{marginBottom:40}}>
            {onglet==='tous'&&<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}><h2 style={{fontSize:20,fontWeight:800,color:'#1a1a2e'}}>🏠 Biens à louer</h2><div style={{height:2,flex:1,background:'linear-gradient(to right,#e5e7eb,transparent)'}}></div></div>}
            {biensFiltres.length===0&&<div style={{textAlign:'center',padding:40,color:'#aaa',background:'white',borderRadius:16}}><div style={{fontSize:40,marginBottom:8}}>🏠</div>Aucun bien disponible</div>}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
              {biensFiltres.map(b=><CardBien key={b.id} bien={b} />)}
            </div>
          </div>
        )}

        {!loading&&(onglet==='tous'||onglet==='terrains')&&(
          <div style={{marginBottom:40}}>
            {onglet==='tous'&&<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}><h2 style={{fontSize:20,fontWeight:800,color:'#1a1a2e'}}>🌍 Terrains à vendre</h2><div style={{height:2,flex:1,background:'linear-gradient(to right,#e5e7eb,transparent)'}}></div></div>}
            {terrainsFiltres.length===0&&<div style={{textAlign:'center',padding:40,color:'#aaa',background:'white',borderRadius:16}}><div style={{fontSize:40,marginBottom:8}}>🌍</div>Aucun terrain disponible</div>}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
              {terrainsFiltres.map(t=><CardTerrain key={t.id} terrain={t} />)}
            </div>
          </div>
        )}

        <div style={{textAlign:'center',padding:32,background:'white',borderRadius:20,boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:22,marginBottom:6}}>📞 Contactez-nous</div>
          <div style={{fontSize:14,color:'#888',marginBottom:20}}>Disponible 7j/7 — Réponse rapide garantie</div>
          <a href={whatsappLink("Bonjour ImmoPro ! Je voudrais avoir des informations.")} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:10,background:'#25D366',color:'white',padding:'14px 32px',borderRadius:14,textDecoration:'none',fontSize:15,fontWeight:700}}>📲 Écrire sur WhatsApp</a>
          <div style={{fontSize:12,color:'#ccc',marginTop:20}}>ImmoPro — Gestion Immobilière & Assurances Auto · Thiès, Sénégal</div>
        </div>
      </div>
    </div>
  );
}
