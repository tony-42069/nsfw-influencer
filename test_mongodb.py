from pymongo import MongoClient
import sys

try:
    client = MongoClient('mongodb://localhost:27017', serverSelectionTimeoutMS=2000)
    # Force a connection to verify server is available
    client.server_info()
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    sys.exit(1) 