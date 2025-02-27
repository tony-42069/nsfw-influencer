from openai import OpenAI
from dotenv import load_dotenv
import os
import sys

try:
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables")
        sys.exit(1)
    
    # Initialize client
    client = OpenAI(api_key=api_key)
    
    # Test with a simple completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello!"}
        ]
    )
    
    # Print response
    print("OpenAI API connection successful!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"OpenAI API connection failed: {e}")
    sys.exit(1) 