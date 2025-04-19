import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LibraryPage from './pages/LibraryPage'
import AnimeDetailPage from './pages/AnimeDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import { LibraryProvider } from './context/LibraryContext'

function App() {
  return (
    <Router>
      <LibraryProvider>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LibraryProvider>
    </Router>
  )
}

export default App
