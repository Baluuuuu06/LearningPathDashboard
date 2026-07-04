import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="152541685870-5d7qun9rqnhm9oo53jtjflu9rrdl1jv7.apps.googleusercontent.com">
      <AuthProvider>
        <App />
        <ToastContainer position="bottom-right" theme="colored" />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
