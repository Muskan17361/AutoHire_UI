import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Messages(){
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [convo, setConvo] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/messages/conversations').then(res => {
      setPartners(res.data.partners || []);
    }).catch(()=>{});
  }, []);

  const openConversation = async (partnerId) => {
    setSelectedPartner(partnerId);
    const res = await api.get(`/messages/conversation/${partnerId}`);
    setConvo(res.data || []);
  };

  const sendMessage = async () => {
    if (!selectedPartner || !text) return;
    await api.post('/messages', { to: selectedPartner, text });
    setText('');
    // refresh conversation
    const res = await api.get(`/messages/conversation/${selectedPartner}`);
    setConvo(res.data || []);
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 200 }}>
        <h3>Conversations</h3>
        {partners.length === 0 ? <div>No conversations yet</div> : partners.map(p => (
          <div key={p} style={{ cursor:'pointer', padding:6, borderBottom:'1px solid #eee' }} onClick={() => openConversation(p)}>{p}</div>
        ))}
      </div>
      <div style={{ flex:1 }}>
        <h3>Chat</h3>
        {!selectedPartner ? <div>Select a conversation</div> : (
          <>
            <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
              {convo.map(m => (
                <div key={m._id} style={{ margin:8 }}>
                  <div style={{ fontSize:12, color:'#666' }}>{m.from === (JSON.parse(localStorage.getItem('user'))?.id) ? 'You' : m.from}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

