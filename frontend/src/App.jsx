import { useState, useEffect } from 'react'
import ReviewList from './ReviewList'
import './App.css'

function App() {

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    const response = await fetch("http://127.0.0.1:5000/reviews")
    const data = await response.json()
    setReviews(data.reviews)
    console.log(data.reviews)
  }

  const onUpdate = () => {

    fetchReviews()
  }

  return (<>
  <ReviewList reviewList = {reviews} updateCallback = {onUpdate}/>
  </>
  );
}

export default App
