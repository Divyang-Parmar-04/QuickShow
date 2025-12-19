import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'

import {RouterProvider} from 'react-router-dom'
import router from './router/router.jsx'
import {store} from "./store/store.js"
import {Provider} from "react-redux"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)
