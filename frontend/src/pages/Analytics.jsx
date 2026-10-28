import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Database,
  Layers3,
  CalendarDays,
  TrendingUp,
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

import {
  getSummary,
  getMonthlyTrends,
  getCrimeTypes,
} from "../services/api"


function Analytics() {

  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState([])
  const [crimeTypes, setCrimeTypes] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    async function loadAnalytics() {

      try {

        setLoading(true)
        setError(null)

        const [
          summaryData,
          trendsData,
          crimeTypesData,
        ] = await Promise.all([
          getSummary(),
          getMonthlyTrends(),
          getCrimeTypes(20),
        ])

        setSummary(summaryData)
        setTrends(trendsData)
        setCrimeTypes(crimeTypesData)

      } catch (err) {

        console.error(err)

        setError(
          "Unable to load historical intelligence."
        )

      } finally {

        setLoading(false)

      }

    }


    loadAnalytics()

  }, [])


  const highestMonth = useMemo(() => {

    if (!trends.length) {
      return null
    }

    return trends.reduce(
      (highest, current) => {

        return Number(current.crime_count) >
          Number(highest.crime_count)
          ? current
          : highest

      }
    )

  }, [trends])


  const topCrimeType =
    crimeTypes[0] ?? null


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
            Loading historical intelligence
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
          Analytics Data Unavailable
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>

      </div>
    )
  }


  return (
    <section>

      {/* PAGE HEADER */}

      <div className="mb-7">

        <p className="intel-label">
          Historical Intelligence
        </p>

        <h2 className="page-title">
          Crime Analytics
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
          Historical crime patterns, classification
          distribution and incident activity across
          the analytical dataset.
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
          label="Total Incidents"
          value={
            Number(
              summary?.total_crimes ?? 0
            ).toLocaleString()
          }
          subtitle="Historical records analyzed"
          icon={Database}
        />


        <MetricCard
          label="Crime Categories"
          value={
            Number(
              summary?.crime_types ?? 0
            ).toLocaleString()
          }
          subtitle="Distinct primary classifications"
          icon={Layers3}
        />


        <MetricCard
          label="Top Crime Type"
          value={
            topCrimeType?.primary_type ??
            "Unavailable"
          }
          subtitle={
            topCrimeType
              ? `${Number(
                  topCrimeType.crime_count
                ).toLocaleString()} incidents`
              : "No data available"
          }
          icon={TrendingUp}
          accent="amber"
        />


        <MetricCard
          label="Peak Month"
          value={
            highestMonth?.year_month ??
            "Unavailable"
          }
          subtitle={
            highestMonth
              ? `${Number(
                  highestMonth.crime_count
                ).toLocaleString()} incidents`
              : "No historical data"
          }
          icon={CalendarDays}
        />

      </div>


      {/* HISTORICAL ACTIVITY */}

      <div className="mt-4">

        <Panel
          title="Historical Crime Activity"
          subtitle="Recorded monthly incident volume"
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

              <AreaChart
                data={trends}
                margin={{
                  top: 10,
                  right: 20,
                  bottom: 5,
                  left: 5,
                }}
              >

                <defs>

                  <linearGradient
                    id="analyticsGradient"
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
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  minTickGap={25}
                />


                <YAxis
                  stroke="#526070"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  width={50}
                />


                <Tooltip
                  contentStyle={{
                    background: "#0b121a",
                    border: "1px solid #1d2a38",
                    borderRadius: "6px",
                    color: "#dbe3ec",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    "Incidents",
                  ]}
                />


                <Area
                  type="monotone"
                  dataKey="crime_count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#analyticsGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </Panel>

      </div>


      {/* CRIME TYPE ANALYSIS */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,1fr)_370px]
        "
      >

        <Panel
          title="Crime Classification Analysis"
          subtitle="Incident volume by primary crime type"
        >

          <div
            className="
              h-[520px]
              sm:h-[600px]
              xl:h-[640px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={crimeTypes.slice(0, 15)}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 25,
                  bottom: 5,
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
                  width={150}
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
                    Number(value).toLocaleString(),
                    "Incidents",
                  ]}
                />


                <Bar
                  dataKey="crime_count"
                  fill="#3f6f9d"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={22}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Panel>


        {/* CLASSIFICATION RANKING */}

        <Panel
          title="Classification Ranking"
          subtitle="Leading historical crime types"
        >

          <div className="space-y-2">

            {crimeTypes
              .slice(0, 10)
              .map((crime, index) => (

                <div
                  key={crime.primary_type}
                  className="
                    rounded-md
                    border border-[#172330]
                    bg-[#091018]
                    px-4 py-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className="
                          font-mono
                          text-[10px]
                          text-slate-600
                        "
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>


                      <p
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-slate-300
                        "
                      >
                        {crime.primary_type}
                      </p>

                    </div>


                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-200
                      "
                    >
                      {Number(
                        crime.crime_count
                      ).toLocaleString()}
                    </p>

                  </div>


                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      border-t border-[#172330]
                      pt-3
                    "
                  >

                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-slate-600
                      "
                    >
                      Dataset share
                    </span>


                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-blue-400
                      "
                    >
                      {Number(
                        crime.percentage ?? 0
                      ).toFixed(2)}%
                    </span>

                  </div>

                </div>

              ))}

          </div>

        </Panel>

      </div>


      {/* HISTORICAL CLASSIFICATION TABLE */}

      <div className="mt-4">

        <Panel
          title="Historical Classification Records"
          subtitle="Incident volume and dataset contribution"
        >

          <div className="overflow-x-auto">

            <div className="min-w-[700px]">

              <div
                className="
                  grid
                  grid-cols-[70px_1fr_190px_160px]
                  border-b border-[#1b2838]
                  px-4 pb-3
                "
              >

                {[
                  "Rank",
                  "Classification",
                  "Recorded Incidents",
                  "Dataset Share",
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

                {crimeTypes.map(
                  (crime, index) => (

                    <div
                      key={
                        `record-${crime.primary_type}`
                      }
                      className="
                        grid
                        grid-cols-[70px_1fr_190px_160px]
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
                          text-slate-500
                        "
                      >
                        {String(
                          index + 1
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
                          {crime.primary_type}
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
                          Primary classification
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
                            crime.crime_count
                          ).toLocaleString()}
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
                          Incidents
                        </p>

                      </div>


                      <div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-blue-400
                          "
                        >
                          {Number(
                            crime.percentage ?? 0
                          ).toFixed(2)}%
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
                          Dataset share
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </Panel>

      </div>


      {/* ANALYTICAL SUMMARY */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-3
        "
      >

        {/* LEADING CLASSIFICATION */}

        <Panel
          title="Leading Classification"
          subtitle="Highest historical incident volume"
        >

          <div className="py-2">

            <p
              className="
                text-2xl
                font-semibold
                text-slate-100
              "
            >
              {topCrimeType?.primary_type ??
                "Unavailable"}
            </p>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              {topCrimeType
                ? `${Number(
                    topCrimeType.crime_count
                  ).toLocaleString()} recorded incidents`
                : "No classification data available"}
            </p>


            {topCrimeType && (

              <div
                className="
                  mt-5
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
                  Dataset Contribution
                </p>

                <p
                  className="
                    mt-2
                    text-lg
                    font-semibold
                    text-blue-400
                  "
                >
                  {Number(
                    topCrimeType.percentage ?? 0
                  ).toFixed(2)}%
                </p>

              </div>

            )}

          </div>

        </Panel>


        {/* PEAK PERIOD */}

        <Panel
          title="Peak Historical Period"
          subtitle="Highest monthly incident volume"
        >

          <div className="py-2">

            <p
              className="
                font-mono
                text-2xl
                font-semibold
                text-slate-100
              "
            >
              {highestMonth?.year_month ??
                "Unavailable"}
            </p>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              Highest recorded monthly activity
              within the available historical data.
            </p>


            {highestMonth && (

              <div
                className="
                  mt-5
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
                  Recorded Incidents
                </p>

                <p
                  className="
                    mt-2
                    text-lg
                    font-semibold
                    text-slate-200
                  "
                >
                  {Number(
                    highestMonth.crime_count
                  ).toLocaleString()}
                </p>

              </div>

            )}

          </div>

        </Panel>


        {/* DATA COVERAGE */}

        <Panel
          title="Dataset Coverage"
          subtitle="Historical analytical scope"
        >

          <div className="space-y-4 py-2">

            <AnalyticsField
              label="Start Date"
              value={
                summary?.start_date ??
                "Unavailable"
              }
            />

            <AnalyticsField
              label="End Date"
              value={
                summary?.end_date ??
                "Unavailable"
              }
            />

            <AnalyticsField
              label="Crime Types"
              value={
                Number(
                  summary?.crime_types ?? 0
                ).toLocaleString()
              }
            />

            <AnalyticsField
              label="Total Incidents"
              value={
                Number(
                  summary?.total_crimes ?? 0
                ).toLocaleString()
              }
            />

          </div>

        </Panel>

      </div>

    </section>
  )
}


function AnalyticsField({
  label,
  value,
}) {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b border-[#172330]
        pb-3
        last:border-none
        last:pb-0
      "
    >

      <span
        className="
          text-[9px]
          font-medium
          uppercase
          tracking-[0.13em]
          text-slate-600
        "
      >
        {label}
      </span>


      <span
        className="
          text-right
          text-xs
          font-medium
          text-slate-300
        "
      >
        {value}
      </span>

    </div>
  )
}


export default Analytics