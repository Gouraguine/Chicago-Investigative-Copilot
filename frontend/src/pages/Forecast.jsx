import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  CalendarRange,
  ChartNoAxesCombined,
  Layers3,
  TrendingUp,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import MetricCard from "../components/dashboard/MetricCard"
import Panel from "../components/dashboard/Panel"

import {
  getCrimeTypeForecast,
} from "../services/api"


const BAR_COLORS = [
  "#4f83b5",
  "#4779a7",
  "#406f99",
  "#39658b",
  "#335b7d",
  "#2d516f",
]


function Forecast() {

  const [forecasts, setForecasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    async function loadForecast() {

      try {

        setLoading(true)
        setError(null)

        const data =
          await getCrimeTypeForecast()

        setForecasts(data)

      } catch (err) {

        console.error(err)

        setError(
          "Unable to load predictive intelligence."
        )

      } finally {

        setLoading(false)

      }

    }


    loadForecast()

  }, [])


  const forecastWeek =
    forecasts[0]?.week ?? "Unavailable"


  const topForecast =
    forecasts[0] ?? null


  const totalPredicted = useMemo(() => {

    return forecasts.reduce(
      (total, item) =>
        total +
        (
          Number(
            item.predicted_crimes
          ) || 0
        ),
      0
    )

  }, [forecasts])


  const chartData = useMemo(() => {

    return forecasts
      .slice(0, 10)
      .map((item) => ({
        ...item,
        predicted_crimes:
          Number(
            item.predicted_crimes
          ) || 0,
      }))

  }, [forecasts])


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
            Loading predictive intelligence
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
            text-xs font-semibold uppercase
            tracking-[0.15em]
            text-red-400
          "
        >
          Forecast Data Unavailable
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
          Predictive Intelligence
        </p>

        <h2 className="page-title">
          Crime Forecasting
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
          Short-term predicted crime activity by
          primary classification and forecast priority.
        </p>

      </div>


      {/* KPI */}

      <div
        className="
          grid grid-cols-1 gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <MetricCard
          label="Forecast Window"
          value={forecastWeek}
          subtitle="Active prediction period"
          icon={CalendarRange}
        />


        <MetricCard
          label="Crime Categories"
          value={forecasts.length}
          subtitle="Categories included in forecast"
          icon={Layers3}
        />


        <MetricCard
          label="Top Prediction"
          value={
            topForecast?.primary_type ??
            "Unavailable"
          }
          subtitle="Highest predicted category"
          icon={TrendingUp}
          accent="amber"
        />


        <MetricCard
          label="Predicted Activity"
          value={
            totalPredicted.toFixed(1)
          }
          subtitle="Combined forecast volume"
          icon={ChartNoAxesCombined}
          accent="blue"
        />

      </div>


      {/* MAIN FORECAST */}

      <div
        className="
          mt-4
          grid grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,1fr)_340px]
        "
      >

        <Panel
          title="Predicted Crime Volume"
          subtitle="Top forecast classifications"
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
                data={chartData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 10,
                  left: 15,
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
                  width={145}
                  stroke="#728093"
                  axisLine={false}
                  tickLine={false}
                  fontSize={9}
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
                  formatter={(value) => [
                    Number(value).toFixed(1),
                    "Predicted crimes",
                  ]}
                />


                <Bar
                  dataKey="predicted_crimes"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={24}
                >

                  {chartData.map(
                    (entry, index) => (

                      <Cell
                        key={
                          entry.primary_type
                        }
                        fill={
                          BAR_COLORS[
                            index %
                            BAR_COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Panel>


        {/* INTELLIGENCE SUMMARY */}

        <div className="space-y-4">

          <Panel
            title="Forecast Intelligence"
            subtitle="Current analytical window"
          >

            <div className="space-y-5">

              <IntelField
                label="Forecast Week"
                value={forecastWeek}
              />

              <IntelField
                label="Leading Category"
                value={
                  topForecast?.primary_type ??
                  "Unavailable"
                }
              />

              <IntelField
                label="Leading Prediction"
                value={
                  topForecast
                    ? `≈ ${Math.round(
                        Number(topForecast.predicted_crimes)
                      ).toLocaleString()} incidents`
                    : "Unavailable"
                }
              />

              <IntelField
                label="Categories Analyzed"
                value={forecasts.length}
              />

            </div>

          </Panel>


          <Panel
            title="Forecast Scope"
            subtitle="Interpretation"
          >

            <p
              className="
                text-xs
                leading-6
                text-slate-500
              "
            >
              Forecast values represent predicted
              short-term activity by primary crime
              classification.
            </p>

            <div
              className="
                mt-4
                border-t border-[#172330]
                pt-4
              "
            >

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                Analytical Use
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                Use rankings to compare predicted
                activity across crime categories
                within the active forecast window.
              </p>

            </div>

          </Panel>

        </div>

      </div>


      {/* FORECAST RANKING */}

      <div className="mt-4">

        <Panel
          title="Forecast Ranking"
          subtitle="Predicted crime categories ordered by priority"
        >

          <div className="overflow-x-auto">

            <div className="min-w-[700px]">

              <div
                className="
                  grid
                  grid-cols-[80px_1fr_180px_180px]
                  border-b border-[#1b2838]
                  px-4 pb-3
                "
              >

                {[
                  "Rank",
                  "Crime Classification",
                  "Predicted Activity",
                  "Forecast Week",
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


              <div
                className="
                  divide-y
                  divide-[#172330]
                "
              >

                {forecasts.map((forecast) => (

                  <div
                    key={
                      `${forecast.rank}-${forecast.primary_type}`
                    }
                    className="
                      grid
                      grid-cols-[80px_1fr_180px_180px]
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
                        forecast.rank
                      ).padStart(2, "0")}
                    </span>


                    <p
                      className="
                        text-xs
                        font-medium
                        text-slate-300
                      "
                    >
                      {forecast.primary_type}
                    </p>


                    <div>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-blue-300
                        "
                      >
                        {Number(
                          forecast.predicted_crimes
                        ).toFixed(1)}
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
                        Crimes
                      </p>

                    </div>


                    <p
                      className="
                        font-mono
                        text-[10px]
                        text-slate-500
                      "
                    >
                      {forecast.week}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </Panel>

      </div>

    </section>
  )
}


function IntelField({
  label,
  value,
}) {

  return (
    <div
      className="
        flex
        items-end
        justify-between
        gap-4
        border-b border-[#172330]
        pb-3
        last:border-none
        last:pb-0
      "
    >

      <p
        className="
          text-[9px]
          font-medium uppercase
          tracking-[0.12em]
          text-slate-600
        "
      >
        {label}
      </p>


      <p
        className="
          text-right
          text-xs
          font-medium
          text-slate-300
        "
      >
        {value}
      </p>

    </div>
  )
}


export default Forecast