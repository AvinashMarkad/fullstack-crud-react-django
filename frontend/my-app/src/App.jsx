import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AnimatedNavbar from './components/AnimatedNavbar'
import StudentData from './components/StudentData'
import EmployeesData from './components/EmployeesData'
import HomePage from './components/HomePage'
import Blogs from './components/Blogs'

function App() {
  return (
    <Router>
      {/* Navbar outside Routes so it shows on all pages */}
      <AnimatedNavbar />
      
      <Routes>
        {/* Default route (homepage) */}
        <Route path="/" element={<StudentData />} />
        <Route path="employees-data" element={<EmployeesData />} />
        <Route path="home-page" element={<HomePage />} />
        <Route path="blogs" element={<Blogs />} />
      </Routes>
    </Router>
  )
}

export default App
