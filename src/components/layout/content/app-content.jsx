import { useEffect } from "react";
import { useState } from "react";
import { Link, Outlet, useMatches } from "react-router-dom"

function AppContent() {
  const [pageTitle, setPageTitle] = useState('')
  const matches = useMatches();

  useEffect(() => {
    setPageTitle(matches[1].handle.title)
  }, [matches])

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <p class="fs-5 text-muted">{pageTitle}</p>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            {pageTitle !== 'Home' && <li class="breadcrumb-item active" aria-current="page">{pageTitle} </li>}
          </ol>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}

export default AppContent
