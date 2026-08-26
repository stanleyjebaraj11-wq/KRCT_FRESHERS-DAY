import { useState, useEffect } from 'react'
import FormPage from './pages/FormPage'
import OrganizerPage from './pages/OrganizerPage'

function App() {
  const [route, setRoute] = useState('/')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/organizer') {
      setRoute('/organizer')
    } else {
      setRoute('/')
    }
  }, [])

  return route === '/organizer' ? <OrganizerPage /> : <FormPage />
}

export default App