import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx'
import Recipe from './pages/Recipe.jsx'
import Ingredients from './pages/Ingredients.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: async () => {
      const req = await fetch('http://localhost:8000/api/fetchData');
      return req.json();
    },
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/recipe/:id",
        element: <Recipe />
      },
      {
        path: "/ingredients",
        element: <Ingredients />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
