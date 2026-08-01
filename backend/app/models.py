from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ClothingItem(db.Model):
    __tablename__ = 'clothing_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # e.g., Top, Bottom, Shoes, Accessory
    subcategory = db.Column(db.String(50))              # e.g., Jeans, Oversized Shirt, Sneakers
    color_family = db.Column(db.String(30), nullable=False) # e.g., White, Blue, Black
    hex_code = db.Column(db.String(7))
    pattern = db.Column(db.String(30), default='Solid')
    image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RecommendedOutfit(db.Model):
    __tablename__ = 'recommended_outfits'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    top_id = db.Column(db.Integer, db.ForeignKey('clothing_items.id'))
    bottom_id = db.Column(db.Integer, db.ForeignKey('clothing_items.id'))
    shoes_id = db.Column(db.Integer, db.ForeignKey('clothing_items.id'))
    accessory_id = db.Column(db.Integer, db.ForeignKey('clothing_items.id'))
    occasion = db.Column(db.String(50), default='Casual')