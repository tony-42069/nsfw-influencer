# tests/unit/test_content_manager.py
import pytest
from src.core.content_manager import ContentManager

async def test_content_manager_initialization(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
    
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    manager = ContentManager()
    
    assert manager.post_templates == mock_config["content"]["post_template"]

async def test_generate_content(mock_config, monkeypatch):
    def mock_load_config():
        return mock_config
    
    monkeypatch.setattr("src.utils.config.load_config", mock_load_config)
    manager = ContentManager()
    
    content = await manager.generate_content("standard")
    assert isinstance(content, dict)
    assert "type" in content
    assert "text" in content
    assert "image_url" in content
    assert "created_at" in content