import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from .ai_service import analyze_clothing_image
from .color_engine import get_matching_colors
from .models import ClothingItem, db

api = Blueprint('api', __name__)

@api.route('/analyze-and-recommend', methods=['POST'])
def analyze_and_recommend():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # 1. Analyze upload with AI
    ai_results = analyze_clothing_image(filepath)
    
    # 2. Derive matching criteria using color theory engine
    matching_colors = get_matching_colors(ai_results['color_family'])

    # 3. Query PostgreSQL catalog for matching outfits
    recommendations = {}
    
    if ai_results['category'] == 'Top':
        recommendations['bottoms'] = ClothingItem.query.filter(
            ClothingItem.category == 'Bottom',
            ClothingItem.color_family.in_(matching_colors)
        ).limit(3).all()

        recommendations['shoes'] = ClothingItem.query.filter(
            ClothingItem.category == 'Shoes'
        ).limit(2).all()

    # Formulate JSON payload
    return jsonify({
        "detected_item": ai_results,
        "recommendations": {
            "bottoms": [{"id": item.id, "name": item.name, "image_url": item.image_url} for item in recommendations.get('bottoms', [])],
            "shoes": [{"id": item.id, "name": item.name, "image_url": item.image_url} for item in recommendations.get('shoes', [])]
        }
    })