import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import AuthModal from './components/AuthModal'
import Chatbot from './components/Chatbot'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
              <Chatbot />
              <AuthModal />
            </BrowserRouter>
          </CartProvider>
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)