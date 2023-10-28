import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./assets/css/index.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
)
