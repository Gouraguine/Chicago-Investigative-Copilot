import {
  LayoutDashboard,
  Map,
  Crosshair,
  ChartNoAxesCombined,
  ChartColumn,
  Bot,
} from "lucide-react"


export const navigation = [
  {
    section: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: "OPERATIONS",
    items: [
      {
        name: "Risk Map",
        path: "/risk-map",
        icon: Map,
      },
      {
        name: "Future Hotspots",
        path: "/hotspots",
        icon: Crosshair,
      },
      {
        name: "Forecasting",
        path: "/forecast",
        icon: ChartNoAxesCombined,
      },
    ],
  },

  {
    section: "INTELLIGENCE",
    items: [
      {
        name: "Crime Analytics",
        path: "/analytics",
        icon: ChartColumn,
      },
    ],
  },

  {
    section: "COPILOT",
    items: [
      {
        name: "AI Analyst",
        path: "/copilot",
        icon: Bot,
      },
    ],
  },
]