# backend/seed.py
from app import create_app, db
from app.models import Product

app = create_app()

products = [
    # --- MALE SECTION ---
    {"name": "Men's Navy Linen Shirt", "category": "top", "gender": "male", "color": "Navy", "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400", "pairing_tags": "casual,formal"},
    {"name": "Men's Slim Beige Chinos", "category": "bottom", "gender": "male", "color": "Beige", "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", "pairing_tags": "casual,formal"},
    {"name": "Men's White Leather Sneakers", "category": "shoes", "gender": "male", "color": "White", "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400", "pairing_tags": "casual"},

    # --- FEMALE SECTION ---
    {"name": "Women's Floral Wrap Blouse", "category": "top", "gender": "female", "color": "Pink", "image_url": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400", "pairing_tags": "casual,party"},
    {"name": "Women's High-Waist Denim Skirt", "category": "bottom", "gender": "female", "color": "Blue", "image_url": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400", "pairing_tags": "casual"},
    {"name": "Women's Black Strappy Sandals", "category": "shoes", "gender": "female", "color": "Black", "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", "pairing_tags": "casual,party"},

    # --- KIDS SECTION ---
    {"name": "Kids Yellow Graphic Tee", "category": "top", "gender": "kids", "color": "Yellow", "image_url": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400", "pairing_tags": "casual,playtime"},
    {"name": "Kids Denim Overalls", "category": "bottom", "gender": "kids", "color": "Blue", "image_url": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", "pairing_tags": "casual,playtime"},
    {"name": "Kids Canvas Running Shoes", "category": "shoes", "gender": "kids", "color": "Red", "image_url": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400", "pairing_tags": "casual"}
]

with app.app_context():
    db.drop_all()
    db.create_all()
    for item in products:
        p = Product(**item)
        db.session.add(p)
    db.session.commit()
    print("✅ Database successfully re-seeded with Male, Female, and Kids products!")