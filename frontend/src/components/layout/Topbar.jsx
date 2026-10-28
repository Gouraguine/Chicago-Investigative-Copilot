import {
  Menu,
  Search,
  Activity,
  Clock3,
  WifiOff,
} from "lucide-react"

import useSystemHealth
  from "../../hooks/useSystemHealth"


function Topbar({ onMenuClick }) {

  const {
    online,
    checking,
  } = useSystemHealth()


  const statusText =
    checking
      ? "Checking System"
      : online
        ? "System Online"
        : "System Offline"


  return (
    <header
      className="
    fixed
    left-0 right-0 top-0
    z-30
    h-16

    border-b
    border-[#1b2838]

    bg-[#090f17]/95
    backdrop-blur

    lg:left-64
    lg:h-[72px]
  "
    >

      <div
        className="
          flex h-full
          items-center
          justify-between
          gap-3
          px-4
          sm:px-7
        "
      >

        <div className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            aria-label="Open navigation"
            onClick={onMenuClick}
            className="
              flex h-9 w-9 shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[#1d2a38]
              bg-[#0d141d]
              text-slate-500
              transition
              hover:border-[#304358]
              hover:text-slate-300
              lg:hidden
            "
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">

          <p
            className="
              hidden
              truncate
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-blue-500
              sm:block
            "
          >
            Chicago Intelligence Environment
          </p>

          <p
            className="
              hidden
              mt-1
              text-xs
              text-slate-600
              sm:block
            "
          >
            Predictive Crime Analysis System
          </p>

          </div>

        </div>


        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <button
            type="button"
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-md
              border
              border-[#1d2a38]
              bg-[#0d141d]
              text-slate-500
              transition
              hover:border-[#304358]
              hover:text-slate-300
            "
          >
            <Search size={16} />
          </button>


          <div
            className="
              hidden
              items-center
              gap-2
              rounded-md
              border
              border-[#1d2a38]
              bg-[#0d141d]
              px-3 py-2
              md:flex
            "
          >

            <Clock3
              size={14}
              className="text-slate-500"
            />

            <span
              className="
                text-[11px]
                text-slate-500
              "
            >
              Analytical Mode
            </span>

          </div>


          <div
            className={`
              hidden
              items-center
              gap-2
              rounded-md
              border
              px-3 py-2
              transition-colors
              duration-300
              sm:flex

              ${
                checking
                  ? `
                    border-amber-500/20
                    bg-amber-500/[0.05]
                  `
                  : online
                    ? `
                      border-emerald-500/20
                      bg-emerald-500/[0.05]
                    `
                    : `
                      border-red-500/20
                      bg-red-500/[0.06]
                    `
              }
            `}
          >

            {online && !checking ? (

              <Activity
                size={14}
                className="
                  text-emerald-400
                "
              />

            ) : (

              <WifiOff
                size={14}
                className={
                  checking
                    ? "text-amber-400"
                    : "text-red-400"
                }
              />

            )}


            <span
              className={`
                text-[10px]
                font-medium
                uppercase
                tracking-[0.1em]

                ${
                  checking
                    ? "text-amber-400"
                    : online
                      ? "text-emerald-400"
                      : "text-red-400"
                }
              `}
            >
              {statusText}
            </span>

          </div>

        </div>

      </div>

    </header>
  )
}


export default Topbar