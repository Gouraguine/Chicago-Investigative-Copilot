const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"


async function request(
  path,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${path}`,
    options
  )

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    )
  }

  return response.json()
}


export function getSummary() {
  return request("/summary")
}


export function getMonthlyTrends() {
  return request("/trends/monthly")
}


export function getCrimeTypes(limit = 10) {
  return request(
    `/crime-types?limit=${limit}`
  )
}


export function getRiskDistribution() {
  return request(
    "/risk/distribution"
  )
}


export function getHotspots(limit = 10) {
  return request(
    `/hotspots?limit=${limit}`
  )
}


export function getTopRiskAreas(limit = 10) {
  return request(
    `/risk/areas/top?limit=${limit}`
  )
}


export function getCrimeTypeForecast() {
  return request(
    "/forecasts/crime-types"
  )
}

export function getRiskAreas(level = null) {
  const query = level
    ? `?level=${level}`
    : ""

  return request(
    `/risk/areas${query}`
  )
}

export function askCopilot(question) {
  return request(
    "/copilot/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  )
}

export function getHealth() {
  return request(
    "/health"
  )
}