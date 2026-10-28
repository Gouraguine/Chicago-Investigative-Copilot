import {
  Routes,
  Route,
} from "react-router"

import AppLayout from "./components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import RiskMap from "./pages/RiskMap"
import Hotspots from "./pages/Hotspots"
import Forecast from "./pages/Forecast"
import Analytics from "./pages/Analytics"
import Copilot from "./pages/Copilot"


function App() {

  return (
    <Routes>

      <Route element={<AppLayout />}>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/risk-map"
          element={<RiskMap />}
        />

        <Route
          path="/hotspots"
          element={<Hotspots />}
        />

        <Route
          path="/forecast"
          element={<Forecast />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/copilot"
          element={<Copilot />}
        />

      </Route>

    </Routes>
  )
}


export default App