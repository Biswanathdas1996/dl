import openai # type: ignore
import os
from secretes.openai_secrets import OPENAI_API_KEY
from PIL import Image # type: ignore
import base64

from io import BytesIO


try:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
except Exception as e:
    print(f"Error setting environment variable: {e}")
    
def call_gpt(config, prompt, max_tokens=50):
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."

    try:
        response = openai.ChatCompletion.create(
            # model="gpt-4",
            model=os.environ["X-Ai-Model"],
            messages=[
                {"role": "system", "content": config},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.5,
        )
        result = response.choices[0].message['content'].strip()
        print("GPT Response:", response)
        return result
    except Exception as e:
        return f"An error occurred: {e}"


def extract_image(file_path):
    # Open the image file
    img = Image.open(file_path)
    
    # Convert the image to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    # Create the request payload
    content = [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{img_base64}"
                    }
                }
            ]
    return call_gpt("You are good image reader", content, max_tokens=2048)
