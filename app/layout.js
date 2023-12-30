//layout.js
"use client"
import './globals.css'

import Navbar from './components/Navbar'
import { AuthContextProvider } from './context/AuthContext'





export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
       <AuthContextProvider>
        <Navbar />
        {children}
        </AuthContextProvider>
        </body>
    </html>
  )
}
