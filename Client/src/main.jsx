import './index.css'
import ReactDOM from 'react-dom/client'
import ChatScreen from './ChatScreen.jsx'
import Auth from "./components/Auth/Auth.jsx"
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
          path: "/auth",
          element: <Auth />
        }
      ]
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);