import statistics
import random

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np

import re
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
stopw = stopwords.words('english')

from flask import request, jsonify
from config import app, db
from models import Review



@app.route("/reviews", methods = ["GET"])
def get_reviews():
    reviews = Review.query.all()
    json_reviews = list(map(lambda x: x.to_json(), reviews))
    return jsonify({"reviews": json_reviews})

@app.route("/get_score", methods = ["GET"])
def get_score():
    reviews = Review.query.all()
    allScores = list(map(lambda x: x.only_score(), reviews))
    avg = round(statistics.mean(allScores), 2)
    return jsonify({"totalScore" : str(avg)})

@app.route("/add_review", methods = ["POST"])
def add_review():
    review_text = request.json.get("reviewText")
    lower = lambda x: x.lower()
    rem_stop =  lambda x: ' '.join([word for word in x.split() if word not in (stopw)])
    rem_dig = lambda x: ' '.join([word for word in x.split() if any(ch.isdigit() for ch in word) == False])
    rem_punct = lambda txt: re.sub(r"[,.:;@#?/!&$]+-", ' ', txt)
    input_text = rem_punct(rem_dig(rem_stop(lower(review_text))))
    input_text = np.array([input_text])

    model = tf.keras.models.load_model(('sentanalysis/posneghub_3_legacy_Adam.keras'),custom_objects={'KerasLayer':hub.KerasLayer})
    score = model.predict(input_text)[0][0]
    rounded_score = round(score, 4)
    
    if not review_text:
        return jsonify({"message" : "please enter a review"}), 400
    
    new_review = Review(review_text = review_text, score = rounded_score)
    try: 
        db.session.add(new_review)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Review Added"}), 201




@app.route("/update_score/<int:review_id>", methods = ["PATCH"])
def update_score(review_id):
    review = Review.query.get(review_id)
    #review.score = blah
    #note that frontend should check if the scores were already calculated
    #review.score = random.random()
    #placeholder above
    db.session.commit()
    return jsonify({"message": "Item score updatede"}), 200




    
@app.route("/delete_review/<int:review_id>", methods = ["DELETE"])
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"message" : "Review not found."}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message" : "Review was deleted"})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)