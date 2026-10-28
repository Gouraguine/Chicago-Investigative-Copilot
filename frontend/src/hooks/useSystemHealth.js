import {
  useEffect,
  useState,
} from "react"

import {
  getHealth,
} from "../services/api"


function useSystemHealth() {

  const [online, setOnline] =
    useState(false)

  const [checking, setChecking] =
    useState(true)


  useEffect(() => {

    let active = true


    async function checkHealth() {

      try {

        const response =
          await getHealth()


        if (!active) {
          return
        }


        setOnline(
          response?.status === "healthy"
        )

      } catch {

        if (!active) {
          return
        }

        setOnline(false)

      } finally {

        if (active) {
          setChecking(false)
        }

      }

    }


    checkHealth()


    const interval =
      setInterval(
        checkHealth,
        5000
      )


    return () => {

      active = false

      clearInterval(
        interval
      )

    }

  }, [])


  return {
    online,
    checking,
  }
}


export default useSystemHealth