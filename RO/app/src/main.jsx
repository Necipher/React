import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx'
import Recipe from './pages/Recipe.jsx'
import Ingredients from './pages/Ingredients.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import Favorites from './pages/Favorites.jsx';
import Searched from './pages/Searched.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const page = url.searchParams.get('page') || 1

      const [dataRes, libraryRes] = await Promise.all([
        fetch('http://localhost:8000/api/fetchData'),
        fetch(`http://localhost:8000/api/library?page=${page}`)
      ]);

      return {
        siteData: await dataRes.json(),
        paginated: await libraryRes.json()
      }
    },
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home/search",
        element: <Searched />
      }
      ,
      {
        path: "/recipe/:id",
        element: <Recipe />
      },
      {
        path: "/ingredients",
        element: <Ingredients />
      },
      {
        path: "/myRecipes",
        element: <MyRecipes />
      },
      {
        path: "/favorites",
        element: <Favorites />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
