import "./index.css";
import ReactDOM from "react-dom/client";
import ChatScreen from "./ChatScreen.jsx";
import Home from "./components/Home/Home.jsx";
import Auth from "./components/Auth/Auth.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const App = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat",
        element: (
          <PrivateRoute>
            <ChatScreen />
          </PrivateRoute>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
