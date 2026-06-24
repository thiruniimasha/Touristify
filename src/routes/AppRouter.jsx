import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Details from '../pages/Details'
import Favorites from '../pages/Favorites'
import Home from '../pages/Home'
import Profile from '../pages/Profile'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="attraction/:id" element={<Details />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
