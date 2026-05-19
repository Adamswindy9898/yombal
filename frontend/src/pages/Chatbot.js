import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const SUGGESTIONS = [
  "Qui n'a pas payé le loyer ce mois ?",
  "Combien de terrains sont disponibles ?",
  "Quels contrats d'assurance expirent bientôt ?",
  "Quel est le revenu total du mois ?",
  "Résume la situation du business",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant IA d'ImmoPro. Je connais tous vos biens, locataires, terrains et assurances. Comment puis-je vous aider ?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (texte) => {
    const question = texte || input.trim();
    if (!question) return;
    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chatbot/`, {
        messages: newMessages.filter(m => m.role !== 'assistant' || newMessages.indexOf(m) > 0)
      });
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "❌ Erreur : vérifiez que la clé API Anthropic est configurée dans le fichier .env du backend." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', flexDirection:'column', height:'calc(100vh - 100px)'}}>
      <h1 className="page-title">💬 Chatbot IA</h1>

      {/* Suggestions */}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="btn" style={{background:'white', border:'1px solid #e5e7eb', fontSize:12, color:'#444'}} onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      {/* Zone de chat */}
      <div style={{flex:1, background:'white', borderRadius:12, padding:20, overflowY:'auto', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:16}}>
        {messages.map((m, i) => (
          <div key={i} style={{display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom:16}}>
            {m.role === 'assistant' && (
              <div style={{width:32, height:32, borderRadius:'50%', background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'white', marginRight:10, minWidth:32}}>IA</div>
            )}
            <div style={{
              maxWidth:'75%', padding:'12px 16px', borderRadius:12, fontSize:14, lineHeight:1.6,
              background: m.role === 'user' ? '#1D9E75' : '#f5f6fa',
              color: m.role === 'user' ? 'white' : '#1a1a2e',
              borderBottomRightRadius: m.role === 'user' ? 4 : 12,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
            {m.role === 'user' && (
              <div style={{width:32, height:32, borderRadius:'50%', background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#666', marginLeft:10, minWidth:32}}>👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:32, height:32, borderRadius:'50%', background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'white'}}>IA</div>
            <div style={{background:'#f5f6fa', padding:'12px 16px', borderRadius:12, fontSize:14, color:'#888'}}>⏳ En train de répondre...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{display:'flex', gap:10}}>
        <input
          style={{flex:1, padding:'12px 16px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none'}}
          placeholder="Posez votre question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="btn btn-primary" style={{padding:'12px 24px'}} onClick={() => send()}>Envoyer</button>
      </div>
    </div>
  );
}
