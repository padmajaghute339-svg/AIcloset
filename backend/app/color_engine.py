import webcolors

COLOR_RULES = {
    "White": ["Blue", "Black", "Beige", "Grey", "Red", "Green", "Pink"],
    "Black": ["White", "Beige", "Grey", "Blue", "Red", "Yellow"],
    "Blue": ["White", "Black", "Beige", "Grey"],
    "Beige": ["White", "Black", "Blue", "Brown", "Green"],
    "Red": ["Black", "White", "Blue"],
    "Grey": ["White", "Black", "Blue", "Pink"]
}

def get_closest_color_name(rgb_tuple):
    """Finds the closest human-readable color name for RGB values."""
    min_colors = {}
    for hex_code, name in webcolors.CSS3_HEX_TO_NAMES.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(hex_code)
        rd = (r_c - rgb_tuple[0]) ** 2
        gd = (g_c - rgb_tuple[1]) ** 2
        bd = (b_c - rgb_tuple[2]) ** 2
        min_colors[(rd + gd + bd)] = name
    
    closest_name = min_colors[min(min_colors.keys())]
    
    # Map specific CSS names to broader fashion color families
    if "blue" in closest_name or "cyan" in closest_name: return "Blue"
    if "white" in closest_name or "snow" in closest_name: return "White"
    if "black" in closest_name or "gray" in closest_name: return "Black"
    if "beige" in closest_name or "tan" in closest_name or "wheat" in closest_name: return "Beige"
    if "red" in closest_name or "crimson" in closest_name: return "Red"
    return "White" # Default fallback

def get_matching_colors(base_color):
    """Returns compatible color list based on style theory."""
    return COLOR_RULES.get(base_color, ["Black", "White"])