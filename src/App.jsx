import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./applayout/AppLayout";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import LoginContainer from "./containers/Login/LoginContainer";
import ProtectedRouter from "./routes/ProtectedRouter";
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard from "./component/Dashboard/Dashboard";
import ClassRoom from "./pages/ClassRoom/ClassRoom";
import ProfessorClassRoom from "./pages/ProffClassRoom/ProffClassRoom";
import TaDashboard from "./pages/TaDashboard/TaDashboard";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <LoginContainer /> },
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
      {
        path: "/classroom/:classCode",
        element: (
          <ProtectedRouter>
            <ClassRoom />
          </ProtectedRouter>
        ),
      },
      {
        path: "/professor/class/:classCode",
        element: (
          <ProtectedRouter>
            <ProfessorClassRoom />
          </ProtectedRouter>
        ),
      },
      {
        path: "/ta-dashboard",
        element: (
          <ProtectedRouter>
            <TaDashboard />
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
