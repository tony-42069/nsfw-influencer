# tests/unit/test_personality_extended.py
import pytest
from unittest.mock import Mock, patch
from src.core.personality import PersonalityEngine

@pytest.fixture
def mock_llm_response():
    return "This is a test response that matches the personality."

@pytest.mark.asyncio
async def test_personality_initialization(mock_config, monkeypatch):
    with patch('langchain.chat_models.ChatOpenAI'):
        def mock_load_config():
            return mock_config
        
        monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
        engine = PersonalityEngine()
        
        assert engine.traits == mock_config["personality"]["base_traits"]
        assert engine.conversation_style == mock_config["personality"]["conversation_style"]
        assert isinstance(engine.system_prompt, str)
        assert "personality" in engine.system_prompt.lower()

@pytest.mark.asyncio
async def test_generate_response_with_context(mock_config, mock_llm_response, monkeypatch):
    with patch('langchain.chat_models.ChatOpenAI'), \
         patch('langchain.chains.LLMChain.apredict', return_value=mock_llm_response):
        
        def mock_load_config():
            return mock_config
        
        monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
        engine = PersonalityEngine()
        
        context = {"user_info": {"name": "Test User", "subscription_level": "premium"}}
        response = await engine.generate_response("Hello!", context)
        
        assert response == mock_llm_response
        assert isinstance(response, str)
        assert len(response) > 0

@pytest.mark.asyncio
async def test_update_personality(mock_config, monkeypatch):
    with patch('langchain.chat_models.ChatOpenAI'):
        def mock_load_config():
            return mock_config
        
        monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
        engine = PersonalityEngine()
        
        new_traits = {
            "base_traits": {
                "age": "mid 30s",
                "personality": "energetic, optimistic"
            }
        }
        
        await engine.update_personality(new_traits)
        assert engine.traits["age"] == "mid 30s"
        assert engine.traits["personality"] == "energetic, optimistic"
        assert "mid 30s" in engine.system_prompt

@pytest.mark.asyncio
async def test_get_personality_stats(mock_config, monkeypatch):
    with patch('langchain.chat_models.ChatOpenAI'):
        def mock_load_config():
            return mock_config
        
        monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
        engine = PersonalityEngine()
        
        stats = await engine.get_personality_stats()
        
        assert "traits" in stats
        assert "conversation_style" in stats
        assert "memory_size" in stats
        assert "last_updated" in stats
        assert isinstance(stats["memory_size"], int)