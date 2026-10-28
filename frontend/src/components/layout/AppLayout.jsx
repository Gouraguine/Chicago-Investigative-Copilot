import {
  useState,
} from "react"

import {
  Outlet,
} from "react-router"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"


function AppLayout() {

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false)


  function openMobileSidebar() {
    setMobileSidebarOpen(true)
  }


  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }


  return (
    <div
      className="
        min-h-screen
        bg-[#070b11]
        text-slate-200
      "
    >

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />


      <Topbar
        onMenuClick={openMobileSidebar}
      />


      <main
        className="
          min-h-screen
          pt-16
          transition-all
          lg:pl-64
          lg:pt-[72px]
        "
      >

        <div
          className="
            p-4
            sm:p-5
            md:p-6
            lg:p-7
          "
        >

          <Outlet />

        </div>

      </main>

    </div>
  )
}


export default AppLayout