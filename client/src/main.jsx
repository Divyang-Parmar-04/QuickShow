import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ClerkProvider} from '@clerk/clerk-react'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <RouterProvider router={router}></RouterProvider>
    </ClerkProvider>
  </StrictMode>,
)
