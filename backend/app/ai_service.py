import cv2
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from .color_engine import get_closest_color_name

# Initialize CLIP Model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

CATEGORIES = ["Top", "Bottom", "Shoes", "Bag", "Jewelry"]
SUBCATEGORIES = ["Oversized Shirt", "T-Shirt", "Jeans", "Cargo Pants", "Trousers", "Sneakers", "Handbag"]

def extract_dominant_color(image_path):
    """Extracts dominant color using OpenCV KMeans."""
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (100, 100))
    
    pixels = image.reshape((-1, 3))
    pixels = np.float32(pixels)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, labels, centers = cv2.kmeans(pixels, 3, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    dominant_rgb = centers[np.bincount(labels.flatten()).argmax()]
    return get_closest_color_name(tuple(map(int, dominant_rgb)))

def analyze_clothing_image(image_path):
    """Zero-shot clothing classification via Fashion-CLIP."""
    raw_image = Image.open(image_path)
    
    # 1. Detect Main Category
    inputs = processor(text=CATEGORIES, images=raw_image, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    category_idx = outputs.logits_per_image.argmax(dim=1).item()
    detected_category = CATEGORIES[category_idx]

    # 2. Detect Subcategory
    inputs_sub = processor(text=SUBCATEGORIES, images=raw_image, return_tensors="pt", padding=True)
    outputs_sub = model(**inputs_sub)
    sub_idx = outputs_sub.logits_per_image.argmax(dim=1).item()
    detected_sub = SUBCATEGORIES[sub_idx]

    # 3. Extract Dominant Color
    dominant_color = extract_dominant_color(image_path)

    return {
        "category": detected_category,
        "subcategory": detected_sub,
        "color_family": dominant_color
    }