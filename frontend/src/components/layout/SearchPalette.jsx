import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  ArrowRight,
  BarChart3,
  Bot,
  Crosshair,
  Map,
  Search,
} from "lucide-react"

import { useNavigate } from "react-router"

import {
  getCrimeTypes,
  getHotspots,
} from "../../services/api"

import { navigation } from "../../config/navigation"


const QUICK_ACTIONS = [
  {
    label: "Ask about common crime types",
    description: "Open Crime Copilot",
    icon: Bot,
    question: "What are the most common crime types?",
  },
  {
    label: "Ask about highest risk areas",
    description: "Open Crime Copilot",
    icon: Bot,
    question: "What are the highest risk areas?",
  },
  {
    label: "Open crime analytics",
    description: "View historical crime patterns",
    icon: BarChart3,
    path: "/analytics",
  },
]


const ICONS = {
  "/": BarChart3,
  "/risk-map": Map,
  "/hotspots": Crosshair,
  "/forecast": BarChart3,
  "/analytics": BarChart3,
  "/copilot": Bot,
}

const SEARCH_ALIASES = [
  {
    terms: ["graph", "graphs", "chart", "charts", "visualization", "visualizations"],
    label: "Crime Analytics",
    description: "View crime graphs and charts",
    icon: BarChart3,
    path: "/analytics",
    type: "navigation",
  },
  {
    terms: ["forecast", "forecasts", "prediction", "predictions"],
    label: "Forecasting",
    description: "View predictive crime charts",
    icon: BarChart3,
    path: "/forecast",
    type: "navigation",
  },
]

const SEARCH_DATA_TIMEOUT = 2000


function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(
        () =>
          reject(
            new Error(
              "Search data request timed out."
            )
          ),
        timeout
      )
    }),
  ])
}


function SearchPalette({
  open,
  onClose,
}) {

  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [crimeTypes, setCrimeTypes] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState(null)


  useEffect(() => {
    if (!open) {
      return undefined
    }

    inputRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
  }, [open, onClose])


  useEffect(() => {
    if (
      !open ||
      hasLoaded ||
      loading ||
      !query.trim()
    ) {
      return
    }

    let cancelled = false

    async function loadSearchData() {
      setLoading(true)
      setError(null)

      try {
        const responses = await Promise.allSettled([
          withTimeout(
            getCrimeTypes(50),
            SEARCH_DATA_TIMEOUT
          ),
          withTimeout(
            getHotspots(50),
            SEARCH_DATA_TIMEOUT
          ),
        ])

        if (!cancelled) {
          const crimeTypesResponse = responses[0]
          const hotspotsResponse = responses[1]

          setCrimeTypes(
            crimeTypesResponse.status === "fulfilled"
              ? Array.isArray(crimeTypesResponse.value)
                ? crimeTypesResponse.value
                : crimeTypesResponse.value.data ?? []
              : []
          )
          setHotspots(
            hotspotsResponse.status === "fulfilled"
              ? Array.isArray(hotspotsResponse.value)
                ? hotspotsResponse.value
                : hotspotsResponse.value.data ?? []
              : []
          )

          if (
            crimeTypesResponse.status === "rejected" ||
            hotspotsResponse.status === "rejected"
          ) {
            setError(
              "Search data is unavailable. Navigation shortcuts remain available."
            )
          }

          setHasLoaded(true)
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error(loadError)
          setError(
            "Search data could not be loaded."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSearchData()

    return () => {
      cancelled = true
    }
  }, [open, hasLoaded, loading, query])


  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return QUICK_ACTIONS.map((action) => ({
        ...action,
        type: "shortcut",
      }))
    }

    const navigationResults = navigation.flatMap(
      (group) =>
        group.items
          .filter((item) =>
            item.name.toLowerCase().includes(normalizedQuery)
          )
          .map((item) => ({
            label: item.name,
            description: group.section,
            icon: ICONS[item.path] ?? Search,
            path: item.path,
            type: "navigation",
          }))
    )

    const aliasResults = SEARCH_ALIASES.filter((result) =>
      result.terms.some((term) =>
        term.includes(normalizedQuery) ||
        normalizedQuery.includes(term)
      )
    )

    const crimeResults = crimeTypes
      .filter((crime) =>
        String(crime.primary_type ?? "")
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 8)
      .map((crime) => ({
        label: crime.primary_type,
        description: "Crime type",
        icon: BarChart3,
        path: "/analytics",
        type: "crime",
      }))

    const hotspotResults = hotspots
      .filter((hotspot) =>
        [
          hotspot.grid_id,
          hotspot.risk_level,
          hotspot.week,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 8)
      .map((hotspot) => ({
        label: `Grid ${hotspot.grid_id}`,
        description: `${hotspot.risk_level ?? "Unknown"} risk hotspot`,
        icon: Crosshair,
        path: "/hotspots",
        type: "hotspot",
      }))

    return [
      ...navigationResults,
      ...aliasResults,
      ...crimeResults,
      ...hotspotResults,
    ]
  }, [crimeTypes, hotspots, query])


  function closeAfter(action) {
    onClose()
    setQuery("")
    action()
  }


  function selectResult(result) {
    if (result.question) {
      closeAfter(() =>
        navigate("/copilot", {
          state: {
            question: result.question,
          },
        })
      )
      return
    }

    closeAfter(() => navigate(result.path))
  }


  function handleInputKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) =>
        Math.min(current + 1, results.length - 1)
      )
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) =>
        Math.max(current - 1, 0)
      )
    }

    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault()
      selectResult(results[activeIndex])
    }
  }


  if (!open) {
    return null
  }


  return (
    <div
      className="
        fixed inset-0
        z-[1000]
        flex items-start justify-center
        bg-black/70
        px-3 pt-16
        backdrop-blur-sm
        sm:px-6 sm:pt-[14vh]
      "
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="
          w-full
          max-w-2xl
          overflow-hidden
          rounded-lg
          border border-[#25364a]
          bg-[#090f17]
          shadow-2xl
          sm:rounded-xl
        "
      >

        <div
          className="
            flex items-center gap-3
            border-b border-[#1b2838]
            px-4
          "
        >
          <Search
            size={18}
            className="shrink-0 text-slate-500"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search navigation, crimes or hotspots..."
            aria-label="Search navigation, crimes or hotspots"
            aria-controls="search-results"
            aria-activedescendant={
              results[activeIndex]
                ? `search-result-${activeIndex}`
                : undefined
            }
            className="
              min-w-0 flex-1
              bg-transparent
              py-4
              text-sm text-slate-200
              outline-none
              placeholder:text-slate-600
            "
          />

        </div>

        <div
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
        >
          {error && (
            <p className="px-3 py-3 text-xs text-red-400">
              {error}
            </p>
          )}

          {!loading && !results.length && (
            <p className="px-3 py-4 text-xs text-slate-500">
              No matching results.
            </p>
          )}

          {results.map((result, index) => {
            const Icon = result.icon

            return (
              <button
                key={`${result.type}-${result.label}-${index}`}
                id={`search-result-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() =>
                  setActiveIndex(index)
                }
                onClick={() => selectResult(result)}
                className={`
                  flex w-full items-center gap-3
                  rounded-md px-3 py-3
                  text-left transition
                  ${
                    index === activeIndex
                      ? "bg-blue-500/[0.10] text-slate-200"
                      : "text-slate-400 hover:bg-slate-800/50"
                  }
                `}
              >
                <Icon
                  size={16}
                  className={
                    index === activeIndex
                      ? "text-blue-400"
                      : "text-slate-600"
                  }
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">
                    {result.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-600">
                    {result.description}
                  </span>
                </span>

                {index === activeIndex && (
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-blue-400"
                  />
                )}
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}


export default SearchPalette
