import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="App">
      <h1>Stock Saarthi</h1>
      <p>{message}</p>
    </div>
  )
}

export default App