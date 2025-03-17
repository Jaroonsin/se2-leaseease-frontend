import requests

def fetch_image_path(width, height):
    """Fetches the redirected image path from picsum.photos"""
    url = f"https://picsum.photos/{width}/{height}"
    response = requests.get(url, allow_redirects=False)  # Don't follow the redirect
    if 'Location' in response.headers:
        return response.headers['Location']
    return None  # Return None if no redirect location found

# Generate 20 image paths
image_paths = [fetch_image_path(1920, 1080) for i in range(20) ]
print(image_paths)
# Remove None values (in case of any errors)
image_paths = [path for path in image_paths if path]

# Save paths to a file
with open("image_paths.txt", "w") as file:
    for path in image_paths:
        file.write(path + "\n")

print("Fetched 20 image paths and saved to image_paths.txt!")

# Generate 20 image paths
image_paths = [fetch_image_path(960,960) for i in range(20) ]
print(image_paths)
# Remove None values (in case of any errors)
image_paths = [path for path in image_paths if path]

# Save paths to a file
with open("image_paths2.txt", "w") as file:
    for path in image_paths:
        file.write(path + "\n")

print("Fetched 20 image paths and saved to image_paths.txt!")
