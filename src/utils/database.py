# src/utils/database.py
import json
from pathlib import Path
from pymongo import MongoClient
from typing import Dict, Any

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self._load_config()
        self._initialize_connection()

    def _load_config(self):
        config_path = Path(__file__).parent.parent.parent / 'config' / 'system_config.json'
        with open(config_path) as f:
            self.config = json.load(f)['database']

    def _initialize_connection(self):
        """Initialize MongoDB connection"""
        self.client = MongoClient(self.config['uri'])
        self.db = self.client[self.config['database']]
        
        # Initialize collections if they don't exist
        for collection_name in self.config['collections'].values():
            if collection_name not in self.db.list_collection_names():
                self.db.create_collection(collection_name)

    def store_conversation(self, conversation_data: Dict[str, Any]) -> str:
        """Store a conversation in the database"""
        collection = self.db[self.config['collections']['conversations']]
        result = collection.insert_one(conversation_data)
        return str(result.inserted_id)

    def store_content(self, content_data: Dict[str, Any]) -> str:
        """Store content history in the database"""
        collection = self.db[self.config['collections']['content_history']]
        result = collection.insert_one(content_data)
        return str(result.inserted_id)

    def store_interaction(self, interaction_data: Dict[str, Any]) -> str:
        """Store user interaction in the database"""
        collection = self.db[self.config['collections']['user_interactions']]
        result = collection.insert_one(interaction_data)
        return str(result.inserted_id)

    def store_metrics(self, metrics_data: Dict[str, Any]) -> str:
        """Store metrics in the database"""
        collection = self.db[self.config['collections']['metrics']]
        result = collection.insert_one(metrics_data)
        return str(result.inserted_id)

    def get_conversation_history(self, user_id: str) -> list:
        """Retrieve conversation history for a user"""
        collection = self.db[self.config['collections']['conversations']]
        return list(collection.find({'user_id': user_id}))

    def close(self):
        """Close the database connection"""
        if self.client:
            self.client.close()