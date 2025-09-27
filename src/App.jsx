import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./applayout/AppLayout";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRouter from "./routes/ProtectedRouter";
import Dashboard from "./component/Dashboard/Dashboard";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRouter>
            <Dashboard />
          </ProtectedRouter>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
