import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import AppBackend from './AppBackend.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBackend />
  </StrictMode>,
)
