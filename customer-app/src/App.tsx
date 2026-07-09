import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import AddCustomerPage from './pages/AddCustomerPage'
import CustomerListPage from './pages/CustomerListPage'
import EditCustomerPage from './pages/EditCustomerPage'
import LoginPage from './pages/LoginPage'
import './App.css'

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  return (
    <BrowserRouter basename={routerBase}>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<CustomerListPage />} />
              <Route path="/add" element={<AddCustomerPage />} />
              <Route path="/edit/:id" element={<EditCustomerPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
