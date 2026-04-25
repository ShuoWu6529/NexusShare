import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CourseDetail from './pages/CourseDetail'
import CourseCatalog from './pages/CourseCatalog'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
