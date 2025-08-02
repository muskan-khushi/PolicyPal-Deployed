import './index.css'
import ReactDOM from 'react-dom/client'
import ChatScreen from './ChatScreen.jsx'
import Login from "./components/Login/Login.jsx"
import SignUp from "./components/SignUp/SignUp.jsx"
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

const App = () => {
  return (
  <>
  <Outlet />
  </>
  );
}

const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <ChatScreen />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/signup",
          element: <SignUp />
        }
      ],
      errorElement: <Error />
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);