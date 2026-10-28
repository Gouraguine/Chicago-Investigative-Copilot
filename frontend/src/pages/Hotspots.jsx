import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Crosshair,
  CalendarRange,
  ShieldAlert,
  MapPin,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet"

import MetricCard from "../components/dashboard/MetricCard"
import Panel from "../components/dashboard/Panel"
import StatusBadge from "../components/dashboard/StatusBadge"

import {
  getHotspots,
} from "../services/api"


const RISK_COLORS = {
  HIGH: "#dc4c4c",
  MEDIUM: "#d59a32",
  LOW: "#3e9d72",
}


function Hotspots() {

  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    async function loadHotspots() {

      try {

        setLoading(true)
        setError(null)

        const data = await getHotspots(20)

        setHotspots(data)

      } catch (err) {

        console.error(err)

        setError(
          "Unable to load hotspot intelligence."
        )

      } finally {

        setLoading(false)

      }

    }

    loadHotspots()

  }, [])


  const validHotspots = useMemo(() => {

    return hotspots.filter(
      (hotspot) =>
        Number.isFinite(
          Number(hotspot.grid_lat)
        ) &&
        Number.isFinite(
          Number(hotspot.grid_lon)
        )
    )

  }, [hotspots])


  const highRiskCount = useMemo(() => {

    return hotspots.filter(
      (hotspot) =>
        hotspot.risk_level === "HIGH"
    ).length

  }, [hotspots])


  const forecastWeek =
    hotspots[0]?.week ?? "Unavailable"


  const peakPrediction = useMemo(() => {

    if (!hotspots.length) {
      return 0
    }

    return Math.max(
      ...hotspots.map(
        (hotspot) =>
          Number(
            hotspot.predicted_crimes
          ) || 0
      )
    )

  }, [hotspots])


  const mapCenter = useMemo(() => {

    if (!validHotspots.length) {
      return [41.8781, -87.6298]
    }

    const latitude =
      validHotspots.reduce(
        (sum, hotspot) =>
          sum + Number(hotspot.grid_lat),
        0
      ) / validHotspots.length

    const longitude =
      validHotspots.reduce(
        (sum, hotspot) =>
          sum + Number(hotspot.grid_lon),
        0
      ) / validHotspots.length

    return [
      latitude,
      longitude,
    ]

  }, [validHotspots])


  if (loading) {

    return (
      <div
        className="
          flex min-h-[500px]
          items-center justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              mx-auto mb-4
              h-7 w-7
              animate-spin
              rounded-full
              border-2
              border-slate-800
              border-t-blue-500
            "
          />

          <p
            className="
              text-xs uppercase
              tracking-[0.15em]
              text-slate-600
            "
          >
            Loading hotspot intelligence
          </p>

        </div>

      </div>
    )
  }


  if (error) {

    return (
      <div
        className="
          rounded-lg
          border border-red-500/20
          bg-red-500/[0.06]
          p-5
        "
      >

        <p
          className="
            text-xs font-semibold
            uppercase
            tracking-[0.15em]
            text-red-400
          "
        >
          Hotspot Data Unavailable
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>

      </div>
    )
  }


  return (
    <section>

      {/* HEADER */}

      <div className="mb-7">

        <p className="intel-label">
          Operational Intelligence
        </p>

        <h2 className="page-title">
          Future Hotspot Intelligence
        </h2>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-slate-600
          "
        >
          Ranked geographic areas based on predicted
          crime activity and operational risk.
        </p>

      </div>


      {/* KPI CARDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <MetricCard
          label="Forecast Week"
          value={forecastWeek}
          subtitle="Active prediction window"
          icon={CalendarRange}
          accent="blue"
        />


        <MetricCard
          label="Priority Areas"
          value={hotspots.length}
          subtitle="Areas included in ranking"
          icon={Crosshair}
        />


        <MetricCard
          label="High Risk"
          value={highRiskCount}
          subtitle="Priority areas classified HIGH"
          icon={ShieldAlert}
          accent="red"
        />


        <MetricCard
          label="Peak Prediction"
          value={peakPrediction.toFixed(1)}
          subtitle="Highest predicted activity"
          icon={MapPin}
          accent="amber"
        />

      </div>


      {/* PRIORITY QUEUE */}

      <div className="mt-4">

        <Panel
          title="Priority Hotspot Queue"
          subtitle="Operational ranking by predicted activity"
        >

          <div className="overflow-x-auto">

            <div className="min-w-[760px]">

              {/* TABLE HEADER */}

              <div
                className="
                  grid
                  grid-cols-[70px_1fr_150px_150px_120px]
                  border-b border-[#1b2838]
                  px-4 pb-3
                "
              >

                {[
                  "Rank",
                  "Location",
                  "Prediction",
                  "Coordinates",
                  "Risk",
                ].map((label) => (

                  <p
                    key={label}
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-slate-600
                    "
                  >
                    {label}
                  </p>

                ))}

              </div>


              {/* ROWS */}

              <div className="divide-y divide-[#172330]">

                {hotspots.map((hotspot) => (

                  <div
                    key={
                      `${hotspot.grid_id}-${hotspot.hotspot_rank}`
                    }
                    className="
                      grid
                      grid-cols-[70px_1fr_150px_150px_120px]
                      items-center
                      px-4 py-4
                      transition-colors
                      hover:bg-blue-500/[0.025]
                    "
                  >

                    <span
                      className="
                        font-mono
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      {String(
                        hotspot.hotspot_rank
                      ).padStart(2, "0")}
                    </span>


                    <div>

                      <p
                        className="
                          text-xs
                          font-medium
                          text-slate-300
                        "
                      >
                        Grid {hotspot.grid_id}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          uppercase
                          tracking-[0.1em]
                          text-slate-600
                        "
                      >
                        Forecast area
                      </p>

                    </div>


                    <div>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-200
                        "
                      >
                        {Number(
                          hotspot.predicted_crimes
                        ).toFixed(1)}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-slate-600
                        "
                      >
                        predicted crimes
                      </p>

                    </div>


                    <p
                      className="
                        font-mono
                        text-[10px]
                        text-slate-500
                      "
                    >
                      {Number(
                        hotspot.grid_lat
                      ).toFixed(4)}

                      <br />

                      {Number(
                        hotspot.grid_lon
                      ).toFixed(4)}
                    </p>


                    <div>
                      <StatusBadge
                        level={hotspot.risk_level}
                      />
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </Panel>

      </div>


      {/* MAP + FORECAST CHART */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-2
        "
      >

        {/* MAP */}

        <Panel
          title="Hotspot Location Intelligence"
          subtitle="Geographic distribution of priority areas"
        >

          <div
            className="
              h-[350px]
              sm:h-[400px]
              lg:h-[430px]
              overflow-hidden
              rounded-md
              border border-[#172330]
              bg-[#080d14]
            "
          >

            <MapContainer
              center={mapCenter}
              zoom={11}
              scrollWheelZoom
              style={{
                height: "100%",
                width: "100%",
                background: "#080d14",
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                opacity={0.55}
              />


              {validHotspots.map((hotspot) => {

                const color =
                  RISK_COLORS[
                    hotspot.risk_level
                  ] ?? "#64748b"

                const prediction =
                  Number(
                    hotspot.predicted_crimes
                  ) || 0

                const radius =
                  Math.max(
                    6,
                    Math.min(
                      16,
                      6 + prediction * 0.4
                    )
                  )


                return (

                  <CircleMarker
                    key={
                      `map-${hotspot.grid_id}-${hotspot.hotspot_rank}`
                    }
                    center={[
                      Number(hotspot.grid_lat),
                      Number(hotspot.grid_lon),
                    ]}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.48,
                      opacity: 0.95,
                      weight: 1.5,
                    }}
                  >

                    <Popup>

                      <div
                        style={{
                          minWidth: "180px",
                        }}
                      >

                        <strong>
                          Priority #
                          {hotspot.hotspot_rank}
                        </strong>

                        <div
                          style={{
                            marginTop: "8px",
                          }}
                        >
                          Grid: {hotspot.grid_id}
                        </div>

                        <div>
                          Risk: {hotspot.risk_level}
                        </div>

                        <div>
                          Predicted crimes:{" "}
                          {
                            prediction.toFixed(1)
                          }
                        </div>

                        <div>
                          Week: {hotspot.week}
                        </div>

                      </div>

                    </Popup>

                  </CircleMarker>

                )

              })}

            </MapContainer>

          </div>

        </Panel>


        {/* CHART */}

        <Panel
          title="Predicted Activity Ranking"
          subtitle="Forecast crime volume by priority area"
        >

          <div
            className="
              h-[320px]
              sm:h-[380px]
              lg:h-[500px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={hotspots.slice(0, 10)}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 25,
                  bottom: 5,
                  left: 5,
                }}
              >

                <CartesianGrid
                  stroke="#172330"
                  strokeDasharray="3 3"
                  horizontal={false}
                />


                <XAxis
                  type="number"
                  stroke="#526070"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                />


                <YAxis
                  type="category"
                  dataKey="grid_id"
                  width={100}
                  stroke="#728093"
                  axisLine={false}
                  tickLine={false}
                  fontSize={9}
                  tickFormatter={
                    (value) =>
                      `Grid ${value}`
                  }
                />


                <Tooltip
                  cursor={{
                    fill:
                      "rgba(59, 130, 246, 0.04)",
                  }}
                  contentStyle={{
                    background: "#0b121a",
                    border:
                      "1px solid #1d2a38",
                    borderRadius: "6px",
                    color: "#dbe3ec",
                    fontSize: "12px",
                  }}
                />


                <Bar
                  dataKey="predicted_crimes"
                  fill="#456f99"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={22}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Panel>

      </div>

    </section>
  )
}


export default Hotspots