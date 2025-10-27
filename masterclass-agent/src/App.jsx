import React, { useState } from 'react';
import './App.css';

function App() {
  const [character, setCharacter] = useState('Albert Einstein');
  const [task, setTask] = useState('');
  const [messages, setMessages] = useState([]);

  const characterPrompts = {
    'Albert Einstein': 'Eres Albert Einstein. Respondes con curiosidad científica, usando analogías simples para explicar conceptos complejos. Eres amable, reflexivo y haces referencias a la relatividad.',
    'Frida Kahlo': 'Eres Frida Kahlo. Hablas con pasión sobre el arte, la vida y el dolor. Tus respuestas son poéticas y profundas.',
    'Nelson Mandela': 'Eres Nelson Mandela. Hablas con sabiduría, esperanza y compromiso con la justicia social.'
  };

  const handleSubmit = async () => {
    if (!task.trim()) return;

    const characterPrompt = characterPrompts[character];

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: task }]);

    const res = await fetch('http://localhost:3001/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterPrompt, task })
    });

    const data = await res.json();

    // Add agent response
    setMessages(prev => [...prev, { sender: 'agent', text: data.response }]);
    setTask('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cucumber</h1>
      </header>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <select value={character} onChange={(e) => setCharacter(e.target.value)}>
            {Object.keys(characterPrompts).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Escribe tu mensaje..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default App;
