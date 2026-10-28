import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Crosshair,
  Layers3,
  ShieldAlert,
  MapPin,
} from "lucide-react"

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet"

import Panel from "../components/dashboard/Panel"
import StatusBadge from "../components/dashboard/StatusBadge"

import {
  getRiskAreas,
  getTopRiskAreas,
  getRiskDistribution,
} from "../services/api"


const RISK_COLORS = {
  HIGH: "#dc4c4c",
  MEDIUM: "#d59a32",
  LOW: "#3e9d72",
}


function RiskMap() {

  const [areas, setAreas] = useState([])
  const [topAreas, setTopAreas] = useState([])
  const [distribution, setDistribution] = useState([])

  const [selectedLevel, setSelectedLevel] =
    useState("ALL")

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)


  useEffect(() => {

    async function loadRiskData() {

      try {

        setLoading(true)
        setError(null)

        const [
          riskAreasData,
          topAreasData,
          distributionData,
        ] = await Promise.all([
          getRiskAreas(),
          getTopRiskAreas(10),
          getRiskDistribution(),
        ])

        setAreas(riskAreasData)
        setTopAreas(topAreasData)
        setDistribution(distributionData)

      } catch (err) {

        console.error(err)

        setError(
          "Unable to load geospatial intelligence."
        )

      } finally {

        setLoading(false)

      }

    }

    loadRiskData()

  }, [])


  const filteredAreas = useMemo(() => {

    if (selectedLevel === "ALL") {
      return areas
    }

    return areas.filter(
      (area) =>
        area.risk_level === selectedLevel
    )

  }, [areas, selectedLevel])


  const validAreas = useMemo(() => {

    return filteredAreas.filter(
      (area) =>
        Number.isFinite(
          Number(area.grid_lat)
        ) &&
        Number.isFinite(
          Number(area.grid_lon)
        )
    )

  }, [filteredAreas])


  const mapCenter = useMemo(() => {

    if (!validAreas.length) {
      return [41.8781, -87.6298]
    }

    const latitude =
      validAreas.reduce(
        (sum, area) =>
          sum + Number(area.grid_lat),
        0
      ) / validAreas.length

    const longitude =
      validAreas.reduce(
        (sum, area) =>
          sum + Number(area.grid_lon),
        0
      ) / validAreas.length

    return [
      latitude,
      longitude,
    ]

  }, [validAreas])


  function getRiskCount(level) {

    return (
      distribution.find(
        (item) =>
          item.risk_level === level
      )?.area_count ?? 0
    )

  }


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
            Loading geospatial intelligence
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
          Geospatial Data Unavailable
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

      <div
        className="
          mb-7
          flex flex-col
          gap-5
          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >

        <div>

          <p className="intel-label">
            Geospatial Intelligence
          </p>

          <h2 className="page-title">
            Geographic Risk Analysis
          </h2>

          <p
            className="
              mt-2 max-w-2xl
              text-sm leading-6
              text-slate-600
            "
          >
            Geographic assessment of predicted crime
            activity and operational risk concentration.
          </p>

        </div>


        {/* FILTERS */}

        <div
          className="
            flex flex-wrap
            items-center
            gap-2
          "
        >

          {[
            "ALL",
            "HIGH",
            "MEDIUM",
            "LOW",
          ].map((level) => (

            <button
              key={level}
              type="button"
              onClick={() =>
                setSelectedLevel(level)
              }
              className={`
                rounded-md
                border
                px-3 py-2
                text-[10px]
                font-semibold
                tracking-[0.12em]
                transition

                ${
                  selectedLevel === level
                    ? `
                      border-blue-500/30
                      bg-blue-500/10
                      text-blue-400
                    `
                    : `
                      border-[#1b2838]
                      bg-[#0c131c]
                      text-slate-600
                      hover:border-[#304358]
                      hover:text-slate-300
                    `
                }
              `}
            >
              {level}
            </button>

          ))}

        </div>

      </div>


      {/* SUMMARY */}

      <div
        className="
          mb-4
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <RiskSummary
          label="Mapped Areas"
          value={areas.length}
          icon={Layers3}
          color="blue"
        />

        <RiskSummary
          label="High Risk"
          value={getRiskCount("HIGH")}
          icon={ShieldAlert}
          color="red"
        />

        <RiskSummary
          label="Medium Risk"
          value={getRiskCount("MEDIUM")}
          icon={Crosshair}
          color="amber"
        />

        <RiskSummary
          label="Low Risk"
          value={getRiskCount("LOW")}
          icon={MapPin}
          color="green"
        />

      </div>


      {/* MAP + INTELLIGENCE */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,1fr)_340px]
        "
      >

        {/* MAP */}

        <Panel
          title="Operational Risk Map"
          subtitle={`${validAreas.length} geographic areas displayed`}
        >

          <div
            className="
              relative
              h-[420px]
              sm:h-[500px]
              lg:h-[650px]
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


              {validAreas.map((area) => {

                const color =
                  RISK_COLORS[
                    area.risk_level
                  ] ?? "#64748b"

                const prediction =
                  Number(
                    area.predicted_crimes
                  )

                const radius =
                  Math.max(
                    5,
                    Math.min(
                      15,
                      Number.isFinite(prediction)
                        ? 5 + prediction * 0.35
                        : 5
                    )
                  )


                return (

                  <CircleMarker
                    key={
                      `${area.grid_id}-${area.week}`
                    }
                    center={[
                      Number(area.grid_lat),
                      Number(area.grid_lon),
                    ]}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.42,
                      opacity: 0.9,
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
                          Grid {area.grid_id}
                        </strong>

                        <div
                          style={{
                            marginTop: "8px",
                          }}
                        >
                          Risk: {area.risk_level}
                        </div>

                        <div>
                          Predicted crimes:{" "}
                          {
                            Number.isFinite(
                              prediction
                            )
                              ? prediction.toFixed(2)
                              : "N/A"
                          }
                        </div>

                        <div>
                          Rank: {area.risk_rank}
                        </div>

                        <div>
                          Week: {area.week}
                        </div>

                      </div>

                    </Popup>

                  </CircleMarker>

                )

              })}

            </MapContainer>


            {/* MAP LEGEND */}

            <div
              className="
                absolute
                bottom-4 left-4
                z-[500]
                rounded-md
                border border-[#26374a]
                bg-[#080d14]/95
                px-4 py-3
                shadow-xl
                backdrop-blur
              "
            >

              <p
                className="
                  mb-3
                  text-[9px]
                  font-semibold uppercase
                  tracking-[0.15em]
                  text-slate-500
                "
              >
                Risk Classification
              </p>


              <MapLegend
                level="HIGH"
                color="#dc4c4c"
              />

              <MapLegend
                level="MEDIUM"
                color="#d59a32"
              />

              <MapLegend
                level="LOW"
                color="#3e9d72"
              />

            </div>

          </div>

        </Panel>


        {/* SIDE INTELLIGENCE */}

        <div className="space-y-4">

          <Panel
            title="Risk Overview"
            subtitle="Geographic classification"
          >

            <div className="space-y-3">

              {[
                "HIGH",
                "MEDIUM",
                "LOW",
              ].map((level) => (

                <div
                  key={level}
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

                  <StatusBadge
                    level={level}
                  />

                  <span
                    className="
                      text-lg
                      font-semibold
                      text-slate-200
                    "
                  >
                    {Number(
                      getRiskCount(level)
                    ).toLocaleString()}
                  </span>

                </div>

              ))}

            </div>

          </Panel>


          <Panel
            title="Priority Areas"
            subtitle="Highest predicted risk"
          >

            <div className="space-y-2">

              {topAreas.map(
                (area, index) => (

                  <div
                    key={
                      `${area.grid_id}-${index}`
                    }
                    className="
                      rounded-md
                      border border-[#172330]
                      bg-[#091018]
                      p-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
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


                        <div>

                          <p
                            className="
                              text-xs
                              font-medium
                              text-slate-300
                            "
                          >
                            Grid {area.grid_id}
                          </p>

                          <p
                            className="
                              mt-1
                              font-mono
                              text-[9px]
                              text-slate-600
                            "
                          >
                            {Number(
                              area.grid_lat
                            ).toFixed(4)}

                            {" / "}

                            {Number(
                              area.grid_lon
                            ).toFixed(4)}
                          </p>

                        </div>

                      </div>


                      <StatusBadge
                        level={area.risk_level}
                      />

                    </div>


                    <div
                      className="
                        mt-3
                        flex
                        items-end
                        justify-between
                        border-t
                        border-[#172330]
                        pt-3
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          uppercase
                          tracking-[0.12em]
                          text-slate-600
                        "
                      >
                        Predicted activity
                      </p>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-300
                        "
                      >
                        {Number(
                          area.predicted_crimes
                        ).toFixed(1)}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </Panel>

        </div>

      </div>

    </section>
  )
}


function RiskSummary({
  label,
  value,
  icon: Icon,
  color,
}) {

  const colors = {
    blue: {
      icon: "text-blue-400",
      box: "border-blue-500/20 bg-blue-500/10",
    },

    red: {
      icon: "text-red-400",
      box: "border-red-500/20 bg-red-500/10",
    },

    amber: {
      icon: "text-amber-400",
      box: "border-amber-500/20 bg-amber-500/10",
    },

    green: {
      icon: "text-emerald-400",
      box: "border-emerald-500/20 bg-emerald-500/10",
    },
  }


  const style =
    colors[color] ?? colors.blue


  return (
    <article
      className="
        flex
        items-center
        justify-between
        rounded-lg
        border border-[#1b2838]
        bg-[#0c131c]
        p-4
      "
    >

      <div>

        <p
          className="
            text-[9px]
            font-medium uppercase
            tracking-[0.14em]
            text-slate-600
          "
        >
          {label}
        </p>

        <p
          className="
            mt-2
            text-xl
            font-semibold
            text-slate-200
          "
        >
          {Number(value).toLocaleString()}
        </p>

      </div>


      <div
        className={`
          flex h-9 w-9
          items-center justify-center
          rounded-md
          border
          ${style.box}
        `}
      >

        <Icon
          size={17}
          strokeWidth={1.7}
          className={style.icon}
        />

      </div>

    </article>
  )
}


function MapLegend({
  level,
  color,
}) {

  return (
    <div
      className="
        mt-2
        flex
        items-center
        gap-2
      "
    >

      <span
        className="
          h-2 w-2
          rounded-full
        "
        style={{
          backgroundColor: color,
        }}
      />

      <span
        className="
          text-[9px]
          font-medium
          tracking-[0.1em]
          text-slate-400
        "
      >
        {level}
      </span>

    </div>
  )
}


export default RiskMap