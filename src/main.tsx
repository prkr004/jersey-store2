import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthModalProvider } from './context/AuthModalContext'
import AuthModal from './components/AuthModal'
import Chatbot from './components/Chatbot'
import { OrdersProvider } from './context/OrdersContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <CartProvider>
            <OrdersProvider>
              <WishlistProvider>
                <BrowserRouter>
                  <App />
                  <Chatbot />
                  <AuthModal />
                </BrowserRouter>
              </WishlistProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)