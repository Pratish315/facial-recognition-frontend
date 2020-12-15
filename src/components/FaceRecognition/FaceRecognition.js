import React from 'react';

const FaceRecognition = ({imagePrediction}) =>{
    return (
        <div className= 'center ma'>
            <div className = 'absolute mt2'>
            <img width = '500px' height = 'auto' alt='imagePrediction' src = {imagePrediction} />
            </div>
        </div>
    )
}

export default FaceRecognition