import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="layout-container header-inner">
          <h1 className="app-title">Customer Manager</h1>
          <nav aria-label="Primary" className="main-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              end
            >
              Customer List
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Add Customer
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <div className="layout-container content-padding">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout