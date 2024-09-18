import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [city, setCity] = useState('')
  const [temperature, setTemperature] = useState('')
  const [sunsetTime, setSunsetTime] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.get(`http://localhost:3000/weather?address=${city}`)
      const data = response.data
      setCity(data.cityName)
      setTemperature(data.temperature)
      setSunsetTime(data.sunsetTime)
      setImage(data.image)
      setError('')
    } catch (err) {
      console.error('Error fetching data: ' + err)
      setError('Erreur lors de la récupération des données.')
    }
  }

  return (
    <>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit} className='form'>
        <input 
          type="text" 
          placeholder="Entrez une ville" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
        />
        <button type="submit">Voir</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {city && (
        <div>
          <h3>Ville: {city}</h3>
          <h3>Température: {temperature} °C</h3>
          <h3>Coucher de soleil: {sunsetTime}</h3>
        </div>
      )}

      {image && (
        <div style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', height: '200px', width: '100%' }}>
          {/* Image as background */}
        </div>
      )}
    </>
  )
}

export default App
