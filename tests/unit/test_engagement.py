# tests/unit/test_engagement.py
import pytest
from src.core.engagement import EngagementSystem

async def test_engagement_initialization(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
        
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    system = EngagementSystem()
    
    assert system.response_times == mock_config["engagement"]["response_time"]
    assert system.daily_limits == mock_config["engagement"]["daily_limits"]

async def test_process_interaction(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
        
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    system = EngagementSystem()
    
    interaction_data = {"user_id": "123", "message": "Hello"}
    result = await system.process_interaction(interaction_data)
    
    assert isinstance(result, dict)
    assert "status" in result
    assert "response" in result
    assert "processed_at" in result