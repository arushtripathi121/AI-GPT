import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from '../pages/HomePage';
const GoogleWrapper = () => {
  return (
    <GoogleOAuthProvider clientId='309003170638-mck4bv68gmijb8re6recdvjb5oq71s31.apps.googleusercontent.com'>
      <SignInPage />
    </GoogleOAuthProvider>
  )
}

const Router = () => {

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <GoogleWrapper />
    },
    {
      path: '/home',
      element: <HomePage />
    }
  ])
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default Router;
