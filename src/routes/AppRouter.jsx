import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Details from '../pages/Details'
import Saved from '../pages/Saved'
import Home from '../pages/Home'
import Profile from '../pages/Profile'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="attraction/:id" element={<Details />} />
          <Route path="Saved" element={<Saved />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
