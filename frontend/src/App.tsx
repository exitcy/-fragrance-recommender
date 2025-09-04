import { Routes, Route } from 'react-router-dom'
import { animate } from 'motion'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // Animate page transitions
    animate('body', { opacity: [0, 1] }, { duration: 0.3 })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
