import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CustomerFormPage from './pages/CustomerFormPage'
import CustomerListPage from './pages/CustomerListPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/add" element={<CustomerFormPage />} />
          <Route path="/edit/:id" element={<CustomerFormPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
