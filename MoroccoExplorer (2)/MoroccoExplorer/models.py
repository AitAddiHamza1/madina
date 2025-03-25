from app import db
from datetime import datetime

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_en = db.Column(db.String(100), nullable=False)
    name_ar = db.Column(db.String(100), nullable=False)
    description_en = db.Column(db.Text, nullable=False)
    description_ar = db.Column(db.Text, nullable=False)
    culture_en = db.Column(db.Text, nullable=False)
    culture_ar = db.Column(db.Text, nullable=False)
    landmarks_en = db.Column(db.Text, nullable=False)
    landmarks_ar = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    population = db.Column(db.Integer)
    region_en = db.Column(db.String(100))
    region_ar = db.Column(db.String(100))

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_en = db.Column(db.String(200), nullable=False)
    title_ar = db.Column(db.String(200), nullable=False)
    content_en = db.Column(db.Text, nullable=False)
    content_ar = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    author = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
