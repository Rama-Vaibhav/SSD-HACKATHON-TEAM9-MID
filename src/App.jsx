import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./applayout/AppLayout";
import "./App.css";
import Home from "./pages/Home";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
