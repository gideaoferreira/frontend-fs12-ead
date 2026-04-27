import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/route.jsx'

import './assets/swiper.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core'
import 'bootstrap'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
