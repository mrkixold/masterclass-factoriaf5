// import React, { useState } from 'react';
// import './App.css';
// import GetOpenAIResponse from '../controller/openAiController';

// function App() {
//   const [character, setCharacter] = useState('Albert Einstein');
//   const [task, setTask] = useState('');
//   const [response, setResponse] = useState('');

//   const characterPrompts = {
//     'Albert Einstein': 'Eres Albert Einstein. Respondes con curiosidad científica, usando analogías simples para explicar conceptos complejos. Eres amable, reflexivo y haces referencias a la relatividad.',
//     'Frida Kahlo': 'Eres Frida Kahlo. Hablas con pasión sobre el arte, la vida y el dolor. Tus respuestas son poéticas y profundas.',
//     'Nelson Mandela': 'Eres Nelson Mandela. Hablas con sabiduría, esperanza y compromiso con la justicia social.'
//   };

//   const GetOpenAIPromptResponse = async () => {
//     const characterPrompt = characterPrompts[character];

//     const data = await GetOpenAIResponse(characterPrompt);

//     setResponse(data.response);
//   };

//   return (
//     <div className="App">
//       <h1>Agente con Personalidad Histórica</h1>
//       <label>
//         Selecciona un personaje:
//         <select value={character} onChange={(e) => setCharacter(e.target.value)}>
//           {Object.keys(characterPrompts).map((name) => (
//             <option key={name} value={name}>{name}</option>
//           ))}
//         </select>
//       </label>
//       <br />
//       <label>
//         Escribe una tarea o pregunta:
//         <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
//       </label>
//       <br />
//       <button onClick={GetOpenAIPromptResponse}>Enviar al agente</button>
//       <h2>Respuesta del agente:</h2>
//       <pre>{response}</pre>
//     </div>
//   );
// }

// export default App;
