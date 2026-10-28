import { NavLink } from "react-router"

import { navigation } from "../../config/navigation"
import chicagoLogo from "../../assets/chigago.png"

function SidebarPanel({ onMobileClose }) {
  return (
    <>

      <div
        className="
          flex h-[72px] items-center
          border-b border-[#1b2838]
          px-5
        "
      >

        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            border border-blue-500/30
            bg-blue-500/10
          "
        >
          <img
            src={chicagoLogo}
            alt="Chicago logo"
            className="h-7 w-7 object-contain"
          />
        </div>


        <div className="ml-3">
          <h1
            className="
              text-[13px]
              font-semibold
              tracking-[0.15em]
              text-slate-100
            "
          >
            CRIME COPILOT
          </h1>

          <p
            className="
              mt-0.5
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-slate-600
            "
          >
            Intelligence Analysis
          </p>
        </div>

      </div>


      <nav
        className="
          flex-1 overflow-y-auto
          px-3 py-6
        "
      >

        {navigation.map((group) => (

          <div
            key={group.section}
            className="mb-7"
          >

            <p
              className="
                mb-2 px-3
                text-[9px]
                font-semibold
                tracking-[0.18em]
                text-slate-600
              "
            >
              {group.section}
            </p>


            <div className="space-y-1">

              {group.items.map((item) => {

                const Icon = item.icon

                return (

                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={onMobileClose}
                    className={({ isActive }) => `
                      group flex items-center gap-3
                      rounded-md
                      border px-3 py-2.5
                      text-[13px]
                      transition-all duration-150

                      ${
                        isActive
                          ? `
                            border-blue-500/20
                            bg-blue-500/[0.08]
                            text-blue-300
                          `
                          : `
                            border-transparent
                            text-slate-500
                            hover:bg-slate-800/40
                            hover:text-slate-300
                          `
                      }
                    `}
                  >

                    {({ isActive }) => (
                      <>
                        <Icon
                          size={17}
                          strokeWidth={1.7}
                          className={
                            isActive
                              ? "text-blue-400"
                              : "text-slate-600 group-hover:text-slate-400"
                          }
                        />

                        <span>
                          {item.name}
                        </span>
                      </>
                    )}

                  </NavLink>

                )

              })}

            </div>

          </div>

        ))}

      </nav>


      <div
        className="
          border-t
          border-[#1b2838]
          px-4 py-3
          text-center
        "
      >
        <p
          className="
            text-[10px]
            font-medium
            text-slate-400
          "
        >
          Réalisé par Salim Gouraguine
        </p>

        <p
          className="
            mt-1
            text-[9px]
            leading-relaxed
            text-slate-600
          "
        >
          M2 Intelligent System Engineering (Data Science)
        </p>
      </div>

    </>
  )
}

function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <aside
        className="
          fixed
          left-0 top-0
          z-40
          hidden
          h-screen
          w-64
          flex-col
          border-r
          border-[#1b2838]
          bg-[#080d14]
          lg:flex
        "
      >
        <SidebarPanel />
      </aside>

      {mobileOpen && (
        <div
          className="
            fixed inset-0
            z-[900]
            lg:hidden
          "
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="
              absolute inset-0
              bg-black/70
              backdrop-blur-sm
            "
          />

          <aside
            className="
              absolute
              bottom-0 left-0 top-0
              flex
              w-[min(82vw,290px)]
              flex-col
              border-r
              border-[#243449]
              bg-[#080d14]
              shadow-2xl
            "
          >
            <SidebarPanel onMobileClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  )
}


export default Sidebar