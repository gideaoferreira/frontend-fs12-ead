import { Outlet } from "react-router-dom"

function AppContent() {
    return (
    <div className="container">
      <Outlet />
    </div>
  )
}

export default AppContent
