import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import store from "./redux/store.js";

import './index.css'
import { Toaster } from "./components_temp/ui/sonner.jsx"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <div>
    <Provider store={store}>
      <Toaster />
      <App />
    </Provider>

  </div>,
)
