import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { ToastProvider } from "./components/Toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Exercises from "./pages/Exercises";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/workouts"
            element={
              <PrivateRoute>
                <Workouts />
              </PrivateRoute>
            }
          />

          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <Exercises />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;