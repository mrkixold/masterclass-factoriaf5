import express from 'express';
import cors from 'cors';
import ollama from 'ollama'
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = 'aac1136a0fb743efdf7ca9f56552ebdc';

// 🔍 Búsqueda web real con DuckDuckGo
async function realWebSearch(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.Abstract || 'No se encontró información relevante.';
}

// 🌦️ Consulta de clima con OpenWeather
async function getWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.main && data.weather) {
    return `Temperatura: ${data.main.temp}°C, Clima: ${data.weather[0].description}, Humedad: ${data.main.humidity}%`;
  }
  return 'No se pudo obtener el clima.';
}

// 🧠 Detección de herramienta
async function detectTool(task) {
  console.log('recibido el mensaje para detectar herramienta:', task);
  const prompt = `
Eres un agente inteligente. Tu tarea es decidir si necesitas usar una herramienta externa para resolver la siguiente petición del usuario. 
Si necesitas usar una herramienta, responde con el nombre de la herramienta y lo que necesitas buscar. 
Si no necesitas herramienta, responde con "NO_TOOL".

Ejemplo:
Usuario: ¿Cuál es la temperatura actual en Armilla, Granada?
Respuesta: WEATHER_API: Armilla, Granada

Usuario: ¿Qué opinas sobre el arte moderno?
Respuesta: NO_TOOL

Usuario: ¿Qué pasó en la Revolución Francesa?
Respuesta: WEB_SEARCH: Revolución Francesa
`;

  console.log("iniciando llamada a ollama...")
  const response = await ollama.chat({
    model: 'deepseek-r1:8b',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: task },
    ],
  });

  console.log(response.message.content);
  return response.message.content;
}

// 🧠 Generación de respuesta final
async function generateCharacterResponse(characterPrompt, task, toolResult = null) {
    console.log('recibido el mensaje para devolver la respuesta:', task);
  let userContent = `Pregunta: ${task}.`;
  if (toolResult) {
    userContent += ` Información obtenida: ${toolResult}. Razona paso a paso y responde según tu estilo.`;
  }
  console.log("iniciando llamada a ollama...")
  const response = await ollama.chat({
    model: 'deepseek-r1:8b',
    messages: [
      { role: 'system', content: characterPrompt },
      { role: 'user', content: userContent },
    ],
  });

  console.log(response.message.content);
  return response.message.content;
}

// 🚀 Ruta principal del agente
app.post('/agent', async (req, res) => {
  const { characterPrompt, task } = req.body;

  const toolInstruction = await detectTool(task);
  let toolResult = null;

  console.log('llamando al agente de ollama')
  if (toolInstruction.startsWith('WEB_SEARCH')) {
    const query = toolInstruction.split(':')[1].trim();
    toolResult = await realWebSearch(query);
  } else if (toolInstruction.startsWith('WEATHER_API')) {
    const location = toolInstruction.split(':')[1].trim();
    toolResult = await getWeather(location);
  }

  const finalResponse = await generateCharacterResponse(characterPrompt, task, toolResult);
  res.json({ response: finalResponse });
});

app.listen(3001, () => {
  console.log('Servidor del agente escuchando en http://localhost:3001');
});