import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Draft from './pages/Draft'
import Results from './pages/Results'
import LeagueDraft from './pages/LeagueDraft'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/results" element={<Results />} />
        <Route path="/league-draft" element={<LeagueDraft />} />
      </Routes>
    </BrowserRouter>
  )
}
