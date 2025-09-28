import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./applayout/AppLayout";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import LoginContainer from "./containers/Login/LoginContainer";
import ProtectedRouter from "./routes/ProtectedRouter";
import StudentDashboard from "./pages/StudentDashboard";
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
        element: <LoginContainer />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRouter>
            <Dashboard />
          </ProtectedRouter>
        ),
      },

      {
        path: "/studentdashboard",
        element: (
          <ProtectedRouter>
            <StudentDashboard />
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
