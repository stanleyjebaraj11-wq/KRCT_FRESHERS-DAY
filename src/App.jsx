import { useState, useEffect } from 'react'
import FormPage from './pages/FormPage'
import OrganizerPage from './pages/OrganizerPage'
import DisplayPage from './pages/DisplayPage'

function App() {
  const [route, setRoute] = useState('/')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/organizer') {
      setRoute('/organizer')
    } else if (path === '/display' || path === '/screen') {
      setRoute('/display')
    } else {
      setRoute('/')
    }
  }, [])

  if (route === '/organizer') return <OrganizerPage />
  if (route === '/display') return <DisplayPage />
  return <FormPage />
}

export default App