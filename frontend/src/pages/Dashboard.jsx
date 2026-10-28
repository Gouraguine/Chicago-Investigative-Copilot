import {
  useEffect,
  useState,
} from "react"

import {
  Database,
  Layers3,
  ShieldAlert,
  CalendarRange,
} from "lucide-react"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import MetricCard from "../components/dashboard/MetricCard"
import Panel from "../components/dashboard/Panel"
import StatusBadge from "../components/dashboard/StatusBadge"

import {
  getSummary,
  getMonthlyTrends,
  getCrimeTypes,
  getRiskDistribution,
  getHotspots,
} from "../services/api"


function Dashboard() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true)
        setError(null)

        const [
          summary,
          trends,
          crimeTypes,
          riskDistribution,
          hotspots,
        ] = await Promise.all([
          getSummary(),
          getMonthlyTrends(),
          getCrimeTypes(8),
          getRiskDistribution(),
          getHotspots(6),
        ])

        setData({
          summary,
          trends,
          crimeTypes,
          riskDistribution,
          hotspots,
        })

      } catch (err) {

        console.error(err)

        setError(
          "Unable to load intelligence data."
        )

      } finally {

        setLoading(false)

      }

    }

    loadDashboard()

  }, [])


  if (loading) {

    return (
      <div
        className="
          flex min-h-[400px]
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
              border-2 border-slate-800
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
            Loading intelligence data
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
          Intelligence Data Unavailable
        </p>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {error}
        </p>
      </div>
    )
  }


  const {
    summary,
    trends,
    crimeTypes,
    riskDistribution,
    hotspots,
  } = data


  const highRisk =
    riskDistribution.find(
      (item) => item.risk_level === "HIGH"
    )?.area_count ?? 0


  const forecastWeek =
    hotspots[0]?.week ?? "Unavailable"


  return (
    <section>

      {/* PAGE HEADER */}

      <div
        className="
          mb-7
          flex flex-col
          gap-4
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >

        <div>

          <p className="intel-label">
            Intelligence Overview
          </p>

          <h2 className="page-title">
            Crime Intelligence Dashboard
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
            Historical activity, geographic risk assessment
            and short-term predictive intelligence.
          </p>

        </div>


        <div
          className="
            rounded-md
            border border-[#1b2838]
            bg-[#0c131c]
            px-4 py-3
            lg:text-right
          "
        >

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-slate-600
            "
          >
            Active Forecast Window
          </p>

          <p
            className="
              mt-1
              font-mono
              text-xs
              text-blue-400
            "
          >
            {forecastWeek}
          </p>

        </div>

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
          label="Total Incidents"
          value={
            Number(
              summary.total_crimes ?? 0
            ).toLocaleString()
          }
          subtitle="Recorded analytical dataset"
          icon={Database}
        />


        <MetricCard
          label="Crime Categories"
          value={
            Number(
              summary.crime_types ?? 0
            ).toLocaleString()
          }
          subtitle="Distinct primary classifications"
          icon={Layers3}
        />


        <MetricCard
          label="High Risk Areas"
          value={
            Number(
              highRisk
            ).toLocaleString()
          }
          subtitle="Areas with the highest risk of crime"
          icon={ShieldAlert}
          accent="red"
        />


        <MetricCard
          label="Forecast Week"
          value={forecastWeek}
          subtitle="Active predictive window"
          icon={CalendarRange}
          accent="amber"
        />

      </div>


      {/* ACTIVITY + RISK */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-3
        "
      >

        <Panel
          title="Crime Activity"
          subtitle="Monthly recorded incident volume"
          className="xl:col-span-2"
        >

          <div className="h-[310px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={trends}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="crimeActivityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#3b82f6"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  stroke="#172330"
                  strokeDasharray="3 3"
                  vertical={false}
                />


                <XAxis
                  dataKey="year_month"
                  stroke="#526070"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  minTickGap={25}
                />


                <YAxis
                  stroke="#526070"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  width={45}
                />


                <Tooltip
                  contentStyle={{
                    background: "#0b121a",
                    border: "1px solid #1d2a38",
                    borderRadius: "6px",
                    color: "#dbe3ec",
                    fontSize: "12px",
                  }}
                  itemStyle={{
                    color: "#60a5fa",
                  }}
                  labelStyle={{
                    color: "#94a3b8",
                    marginBottom: "4px",
                  }}
                />


                <Area
                  type="monotone"
                  dataKey="crime_count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#crimeActivityGradient)"
                  activeDot={{
                    r: 4,
                    fill: "#60a5fa",
                    stroke: "#0c131c",
                    strokeWidth: 2,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </Panel>


        <Panel
          title="Risk Distribution"
          subtitle="Geographic risk classification"
        >

          <div className="space-y-3">

            {riskDistribution.map((item) => (

              <div
                key={item.risk_level}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-md
                  border border-[#172330]
                  bg-[#091018]
                  px-4 py-4
                "
              >

                <div>

                  <StatusBadge
                    level={item.risk_level}
                  />

                  <p
                    className="
                      mt-2
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-slate-600
                    "
                  >
                    Risk classification
                  </p>

                </div>


                <div className="text-right">

                  <p
                    className="
                      text-xl
                      font-semibold
                      text-slate-200
                    "
                  >
                    {Number(
                      item.area_count
                    ).toLocaleString()}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-slate-600
                    "
                  >
                    Areas
                  </p>

                </div>

              </div>

            ))}

          </div>

        </Panel>

      </div>


      {/* CRIME CATEGORIES + HOTSPOTS */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-2
        "
      >

        <Panel
          title="Primary Crime Categories"
          subtitle="Historical incident distribution"
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
                data={crimeTypes}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  bottom: 5,
                  left: 10,
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
                  dataKey="primary_type"
                  width={125}
                  stroke="#728093"
                  axisLine={false}
                  tickLine={false}
                  fontSize={9}
                />


                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.04)",
                  }}
                  contentStyle={{
                    background: "#0b121a",
                    border: "1px solid #1d2a38",
                    borderRadius: "6px",
                    color: "#dbe3ec",
                    fontSize: "12px",
                  }}
                  itemStyle={{
                    color: "#7eb6e8",
                  }}
                />


                <Bar
                  dataKey="crime_count"
                  fill="#355f8a"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={22}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Panel>


        <Panel
          title="Priority Hotspots"
          subtitle="Highest predicted operational risk"
        >

          <div className="space-y-2">

            {hotspots.map((hotspot) => (

              <div
                key={
                  `${hotspot.grid_id}-${hotspot.hotspot_rank}`
                }
                className="
                  grid
                  grid-cols-[38px_minmax(0,1fr)_auto]
                  items-center
                  gap-3
                  rounded-md
                  border border-[#172330]
                  bg-[#091018]
                  px-4 py-3
                  transition-colors
                  hover:border-[#293b50]
                  lg:grid-cols-[38px_minmax(0,1fr)_90px_70px]
                "
              >

                {/* RANK */}

                <div
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded
                    border border-[#1d2a38]
                    bg-[#0d151f]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    {String(
                      hotspot.hotspot_rank
                    ).padStart(2, "0")}
                  </span>
                </div>


                {/* GRID */}

                <div className="min-w-0">

                  <p
                    className="
                      truncate
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
                      truncate
                      font-mono
                      text-[9px]
                      text-slate-600
                    "
                  >
                    {Number(
                      hotspot.grid_lat
                    ).toFixed(4)}

                    {" / "}

                    {Number(
                      hotspot.grid_lon
                    ).toFixed(4)}
                  </p>

                </div>


                {/* PREDICTION */}

                <div
                  className="
                    hidden text-right
                    lg:block
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-300
                    "
                  >
                    {Number(
                      hotspot.predicted_crimes
                    ).toFixed(1)}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      uppercase
                      tracking-[0.1em]
                      text-slate-600
                    "
                  >
                    Predicted
                  </p>

                </div>


                {/* RISK */}

                <div className="flex justify-end">

                  <StatusBadge
                    level={hotspot.risk_level}
                  />

                </div>

              </div>

            ))}

          </div>

        </Panel>

      </div>

    </section>
  )
}


export default Dashboard