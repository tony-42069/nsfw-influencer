# test_setup.py
import pymongo
import fastapi
import langchain

print("All imports successful!")

# Try to connect to MongoDB
try:
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    client.server_info()  # This will raise an exception if we can't connect
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")