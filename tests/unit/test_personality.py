# tests/unit/test_personality.py
import pytest
from src.core.personality import PersonalityEngine

async def test_personality_initialization(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
    
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    engine = PersonalityEngine()
    
    assert engine.traits == mock_config["personality"]["base_traits"]
    assert engine.conversation_style == mock_config["personality"]["conversation_style"]

async def test_generate_response(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
    
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    engine = PersonalityEngine()
    
    response = await engine.generate_response("Hello!")
    assert isinstance(response, str)
    assert len(response) > 0