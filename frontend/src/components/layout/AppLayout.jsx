import {
  useState,
} from "react"

import {
  Outlet,
} from "react-router"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import SearchPalette from "./SearchPalette"


function AppLayout() {

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false)
  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false)


  function openMobileSidebar() {
    setMobileSidebarOpen(true)
  }


  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }


  function openSearch() {
    setSearchOpen(true)
  }


  function closeSearch() {
    setSearchOpen(false)
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
        onSearchClick={openSearch}
      />

      <SearchPalette
        open={searchOpen}
        onClose={closeSearch}
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