import React from "react"
import {useState} from "react"

const ReviewList = ({reviewList, updateCallback}) => {
    const [totalScore, setTotalScore] = useState("")
    const [reviewText, setReviewDescription] = useState("")
    const score = -1

    const projectDescription = ["Current Accuracy: 83%. The values range from 0 to 1, 0 being negative and 1 being positive.",
                                 "This is a project studying Sentiment Analysis using Tensorflow and full-stack development. The ML model was trained on book Reviews, movie reviews, and social media posts, and uses embeddings from Google."]

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log("Came to onSubmit")
        const data = {
            reviewText,
            score
        }
        const url = "http://127.0.0.1:5000/add_review"
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status != 200 && response.status != 201) {
            const error_message = await response.json()
            alert(error_message.message)
        } else (
            updateCallback()
        )
        setReviewDescription("")
        updateTotalScore()
    }

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_review/${id}`, options)
            if (response.status == 200) {
                updateCallback()
            } else {
                console.error("Problem in onDelete")
                alert(error)
            }
        } catch (error) {
            console.error("Error in onDelete")
            alert(error)
        }
        updateTotalScore()
    }
    
    const updateTotalScore = async () => {
        const response = await fetch("http://127.0.0.1:5000/get_score")
        const data = await response.json()
        setTotalScore(data.totalScore)
        console.log(data.totalScore)
    }

    return <div>
        <h1>Sentiment Analyzer</h1>
        <br />
        <br />
            <form onSubmit = {onSubmit}>
                <label htmlFor="reviewText"><strong>Add Text:</strong> </label>
                <input type="text" id = "review" value = {reviewText} onChange = {(e) => setReviewDescription(e.target.value)} />
                <button type = "submit">Enter</button>
            </form>
        <br />
        <h3>Overall Sentiment (0 - 1): {totalScore}</h3>
        <br />
        <table>
            <thead>
                <tr>
                    <th>TEXT</th>
                    <th>SCORE</th>
                    <th>(DEL)</th>
                </tr>
            </thead>
            <tbody>
                {reviewList.map((review) => (
                    <tr key = {review.id}>

                        <td id = "text">{review.reviewText}</td>
                        <td><strong>{review.score}</strong></td>
                        <td id = "x">
                            <button id = "x" onClick={() => onDelete(review.id)}><strong>&times;</strong></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <h4>It may take a moment for your result to load.</h4>
        <br />
        <table class = "explanation">
            <tbody>
                <td><p>{projectDescription[0]}</p><p>{projectDescription[1]}</p></td>
            </tbody>
        </table>
    </div>




    } 

    export default ReviewList

    // &times;