from typing import Dict, Optional, List
import logging
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.memory import ConversationBufferMemory
from src.utils.config import load_config
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class PersonalityEngine:
    def __init__(self):
        self.config = load_config()["personality"]
        self.traits = self.config["base_traits"]
        self.conversation_style = self.config["conversation_style"]
        
        # Get API key from environment
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            raise ValueError("OpenAI API key not found in environment")
        
        # Initialize LangChain components
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-3.5-turbo",
            api_key=openai_key
        )
        
        # Create personality-specific system prompt
        self.system_prompt = self._create_system_prompt()
        
        # Initialize conversation memory
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Initialize the prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
        ])
        
        # Create the chain
        self.chain = self.prompt | self.llm | StrOutputParser()
    
    def _create_system_prompt(self) -> str:
        """Create a system prompt based on personality traits"""
        prompt = f"""You are a {self.traits['age']} content creator with the following traits:
- Personality: {self.traits['personality']}
- Interests: {', '.join(self.traits['background']['interests'])}

Your communication style is:
- Formality: {self.conversation_style['formality']}
- Humor Level: {self.conversation_style['humor_level']}
- Response Length: {self.conversation_style['response_length']}
- Tone: {self.traits['tone']}

Always maintain consistency with these traits while interacting. Your responses should be:
1. Authentic and aligned with your personality
2. Engaging and relatable
3. Appropriate for your platform and audience
4. Reflective of your core values and interests

Ensure all responses are platform-appropriate and maintain brand consistency.
"""
        return prompt
    
    async def generate_response(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate a personality-driven response"""
        try:
            # Add context to prompt if provided
            input_dict = {"input": prompt}
            if context:
                input_dict.update(context)
            
            # Generate response
            logger.info(f"Generating response for prompt: {prompt}")
            response = self.chain.invoke(input_dict)
            
            # Log interaction
            logger.info("Response generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise
    
    async def update_personality(self, new_traits: Dict) -> None:
        """Update personality traits and refresh system prompt"""
        try:
            # Update traits
            if "base_traits" in new_traits:
                self.traits.update(new_traits.get("base_traits", {}))
            if "conversation_style" in new_traits:
                self.conversation_style.update(new_traits.get("conversation_style", {}))
            
            # Refresh system prompt
            self.system_prompt = self._create_system_prompt()
            
            # Update prompt template
            self.prompt = ChatPromptTemplate.from_messages([
                ("system", self.system_prompt),
                ("human", "{input}"),
            ])
            
            logger.info("Personality traits updated successfully")
        except Exception as e:
            logger.error(f"Error updating personality: {str(e)}")
            raise
    
    async def get_personality_stats(self) -> Dict:
        """Get current personality statistics"""
        return {
            "traits": self.traits,
            "conversation_style": self.conversation_style,
            "memory_size": len(self.memory.chat_memory.messages) if hasattr(self.memory, 'chat_memory') else 0,
            "last_updated": datetime.now().isoformat()
        }