import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentData from './components/StudentData'

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route (homepage) */}
        <Route path="/"  element={<StudentData />} />
      </Routes>
    </Router>
  )
}

export default App
