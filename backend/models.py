from config import db

class Review(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    review_text = db.Column(db.String, unique = False, nullable = False)
    score = db.Column(db.Double, unique = False, nullable = True)

    def to_json(self):
        return{
            "id" : self.id,
            "reviewText" : self.review_text,
            "score" : round(self.score, 2)
        }
    def only_score(self):
        return self.score

    

    