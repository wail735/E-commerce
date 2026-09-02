import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="300086591465-r1c57ocvu8lfq9so3qb2k3qa8v91uok8.apps.googleusercontent.com">
      <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
