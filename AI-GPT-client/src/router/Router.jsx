import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';

const Router = () => {

    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <SignInPage/>        
        }
    ])
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default Router;
