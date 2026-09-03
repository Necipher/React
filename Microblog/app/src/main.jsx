import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router'
//Pages
import RootLayout from './Layout/RootLayout'
import MainFeed from './Pages/MainFeed'
import UserProfile from './Pages/UserProfile'
import DirectMessages from './Pages/DirectMessages'
import Notifications from './Pages/Notifications'
import Settings from './Pages/Settings'
//SubPages
import UsersPosts from './Pages/UsersPosts'
import UserLikedPosts from './Pages/UserLikedPosts'
import UserComments from './Pages/UserComments'
import UserFollowers from './Pages/UserFollowers'
import UserFollowing from './Pages/UserFollowing'
import UserMedia from './Pages/UserMedia'
//Context
import { AuthProvider } from './context/AuthContext'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MainFeed />
      },
      {
        path: '/profile',
        element: <UserProfile />,
        children: [
          { index: true, element: <UsersPosts /> },
          { path: 'liked', element: <UserLikedPosts /> },
          { path: 'comments', element: <UserComments /> },
          { path: 'followers', element: <UserFollowers /> },
          { path: 'following', element: <UserFollowing /> },
          { path: 'media', element: <UserMedia /> }
        ]
      },
      {
        path: '/directmessages',
        element: <DirectMessages />
      },
      {
        path: 'notifications',
        element: <Notifications />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
