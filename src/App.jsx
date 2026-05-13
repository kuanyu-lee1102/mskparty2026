import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import DounanPage from './pages/DounanPage.jsx'
import ZhubeiPage from './pages/ZhubeiPage.jsx'
import StyleExplorationPage from './pages/StyleExplorationPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dounan" element={<DounanPage />} />
      <Route path="/zhubei" element={<ZhubeiPage />} />
      <Route path="/style-exploration" element={<StyleExplorationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
