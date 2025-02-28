import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const PersonalityPage = () => {
  const [personalityConfig, setPersonalityConfig] = useState(null);
  const [personalityTraits, setPersonalityTraits] = useState({
    base_traits: {
      tone: 'conservative',
      personality: 'friendly but firm',
      age: 'middle-aged mother',
      background: {
        interests: [
          'family values',
          'traditional cooking',
          'country lifestyle',
          'patriotism',
          'faith'
        ]
      }
    },
    conversation_style: {
      formality: 'semi-formal',
      humor_level: 'mild',
      response_length: 'medium',
      sarcasm: 'low'
    }
  });
  
  const [sliders, setSliders] = useState({
    formality: 50,      // 0: Very casual, 100: Very formal
    humor: 30,          // 0: Serious, 100: Very humorous
    assertiveness: 70,  // 0: Passive, 100: Very assertive
    warmth: 60,         // 0: Cool/distant, 100: Very warm
    traditionalism: 80  // 0: Progressive, 100: Very traditional
  });
  
  const [prompt, setPrompt] = useState('');
  const [testPrompt, setTestPrompt] = useState('What do you think about modern parenting styles?');
  const [response, setResponse] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);
  const [configError, setConfigError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    loadPersonalityConfig();
  }, []);

  const loadPersonalityConfig = async () => {
    setIsLoadingConfig(true);
    setConfigError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personality/config`);
      
      if (response.data.success) {
        setPersonalityConfig(response.data.config);
        
        // Initialize traits if they exist in the response
        if (response.data.config.traits) {
          setPersonalityTraits({
            base_traits: response.data.config.traits,
            conversation_style: response.data.config.conversation_style
          });
          
          // Set sliders based on conversation style
          const style = response.data.config.conversation_style;
          const newSliders = { ...sliders };
          
          if (style.formality === 'casual') newSliders.formality = 20;
          else if (style.formality === 'semi-formal') newSliders.formality = 50;
          else if (style.formality === 'formal') newSliders.formality = 80;
          
          if (style.humor_level === 'none') newSliders.humor = 0;
          else if (style.humor_level === 'mild') newSliders.humor = 30;
          else if (style.humor_level === 'moderate') newSliders.humor = 60;
          else if (style.humor_level === 'high') newSliders.humor = 90;
          
          setSliders(newSliders);
        }
      } else {
        setConfigError(response.data.message || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading personality config:', error);
      setConfigError('Error connecting to the server');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setSliders({
      ...sliders,
      [name]: parseInt(value)
    });
    
    // Update personality traits based on sliders
    const newPersonalityTraits = { ...personalityTraits };
    
    // Formality
    if (value <= 30) {
      newPersonalityTraits.conversation_style.formality = 'casual';
    } else if (value <= 70) {
      newPersonalityTraits.conversation_style.formality = 'semi-formal';
    } else {
      newPersonalityTraits.conversation_style.formality = 'formal';
    }
    
    // Humor level
    if (name === 'humor') {
      if (value <= 20) {
        newPersonalityTraits.conversation_style.humor_level = 'none';
      } else if (value <= 50) {
        newPersonalityTraits.conversation_style.humor_level = 'mild';
      } else if (value <= 80) {
        newPersonalityTraits.conversation_style.humor_level = 'moderate';
      } else {
        newPersonalityTraits.conversation_style.humor_level = 'high';
      }
    }
    
    // Assertiveness affects personality tone
    if (name === 'assertiveness') {
      if (value <= 30) {
        newPersonalityTraits.base_traits.tone = 'gentle';
      } else if (value <= 60) {
        newPersonalityTraits.base_traits.tone = 'balanced';
      } else if (value <= 85) {
        newPersonalityTraits.base_traits.tone = 'confident';
      } else {
        newPersonalityTraits.base_traits.tone = 'assertive';
      }
    }
    
    // Traditionalism affects background interests
    if (name === 'traditionalism' && value >= 75) {
      if (!newPersonalityTraits.base_traits.background.interests.includes('traditional values')) {
        newPersonalityTraits.base_traits.background.interests.push('traditional values');
      }
    }
    
    setPersonalityTraits(newPersonalityTraits);
  };

  const handleInterestToggle = (interest) => {
    const newPersonalityTraits = { ...personalityTraits };
    const interests = newPersonalityTraits.base_traits.background.interests;
    
    if (interests.includes(interest)) {
      // Remove interest
      newPersonalityTraits.base_traits.background.interests = interests.filter(i => i !== interest);
    } else {
      // Add interest
      newPersonalityTraits.base_traits.background.interests.push(interest);
    }
    
    setPersonalityTraits(newPersonalityTraits);
  };

  const updatePersonality = async () => {
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/personality/update`, personalityTraits);
      
      if (response.data.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        loadPersonalityConfig(); // Refresh the config
      } else {
        setError(response.data.message || 'Failed to update personality');
      }
    } catch (error) {
      console.error('Error updating personality:', error);
      setError('Error connecting to the server');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/personality/generate`, {
        prompt: prompt
      });
      
      if (response.data.success) {
        setResponse(response.data.response);
      } else {
        setError(response.data.message || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };
  
  const testPersonality = async () => {
    if (!testPrompt.trim()) return;
    
    setIsTesting(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/personality/generate`, {
        prompt: testPrompt
      });
      
      if (response.data.success) {
        setTestResponse(response.data.response);
      } else {
        setError(response.data.message || 'Failed to generate test response');
      }
    } catch (error) {
      console.error('Error generating test response:', error);
      setError('Error connecting to the server');
    } finally {
      setIsTesting(false);
    }
  };
  
  const getSliderLabelText = (name, value) => {
    switch (name) {
      case 'formality':
        if (value <= 30) return 'Casual';
        if (value <= 70) return 'Semi-formal';
        return 'Formal';
      
      case 'humor':
        if (value <= 20) return 'Serious';
        if (value <= 50) return 'Mild humor';
        if (value <= 80) return 'Moderate humor';
        return 'Very humorous';
        
      case 'assertiveness':
        if (value <= 30) return 'Gentle';
        if (value <= 60) return 'Balanced';
        if (value <= 85) return 'Confident';
        return 'Very assertive';
        
      case 'warmth':
        if (value <= 30) return 'Reserved';
        if (value <= 60) return 'Friendly';
        if (value <= 85) return 'Warm';
        return 'Very nurturing';
        
      case 'traditionalism':
        if (value <= 30) return 'Modern';
        if (value <= 60) return 'Balanced';
        if (value <= 85) return 'Traditional';
        return 'Very traditional';
        
      default:
        return `${value}%`;
    }
  };

  const interestOptions = [
    'family values', 'traditional cooking', 'country lifestyle', 'patriotism', 
    'faith', 'homesteading', 'gun rights', 'freedom of speech', 'conservative politics',
    'small business', 'farming', 'hunting', 'crafts', 'children'
  ];

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Personality Settings</h1>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={updatePersonality}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={loadPersonalityConfig}
            disabled={isLoadingConfig}
          >
            {isLoadingConfig ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {updateSuccess && (
        <div className="alert alert-success">
          Personality updated successfully!
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Personality Traits</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6>Core Traits</h6>
                <div className="mb-3">
                  <label htmlFor="basePersonality" className="form-label">Base Personality</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="basePersonality"
                    value={personalityTraits.base_traits.personality}
                    onChange={(e) => setPersonalityTraits({
                      ...personalityTraits,
                      base_traits: {
                        ...personalityTraits.base_traits,
                        personality: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="ageDescription" className="form-label">Age/Life Stage Description</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="ageDescription"
                    value={personalityTraits.base_traits.age}
                    onChange={(e) => setPersonalityTraits({
                      ...personalityTraits,
                      base_traits: {
                        ...personalityTraits.base_traits,
                        age: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h6>Personality Sliders</h6>
                
                {Object.entries(sliders).map(([name, value]) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label d-flex justify-content-between">
                      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                      <span className="text-muted">{getSliderLabelText(name, value)}</span>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      id={name} 
                      name={name}
                      min="0" 
                      max="100" 
                      value={value}
                      onChange={handleSliderChange}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-3">
                <h6>Interests & Background</h6>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {interestOptions.map(interest => (
                    <div key={interest} className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`interest-${interest}`}
                        checked={personalityTraits.base_traits.background.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                      />
                      <label className="form-check-label" htmlFor={`interest-${interest}`}>
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Test Personality</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="testPrompt" className="form-label">Test Prompt</label>
                <select 
                  className="form-select mb-2"
                  onChange={(e) => setTestPrompt(e.target.value)}
                >
                  <option value="What do you think about modern parenting styles?">About parenting</option>
                  <option value="How do you feel about the Second Amendment?">About gun rights</option>
                  <option value="What's your opinion on traditional gender roles?">About gender roles</option>
                  <option value="What values do you think are most important to teach children?">About values</option>
                  <option value="What's your favorite thing about country living?">About country lifestyle</option>
                </select>
                <textarea 
                  id="testPrompt" 
                  className="form-control" 
                  rows="2"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a test prompt..."
                ></textarea>
              </div>
              
              <button 
                className="btn btn-info w-100"
                onClick={testPersonality}
                disabled={isTesting || !testPrompt.trim()}
              >
                {isTesting ? 'Testing...' : 'Test Response'}
              </button>
              
              {testResponse && (
                <div className="mt-3 border p-3 bg-light" style={{ whiteSpace: 'pre-line' }}>
                  {testResponse}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Generate Custom Response</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="prompt" className="form-label">Custom Prompt</label>
                  <textarea 
                    id="prompt" 
                    className="form-control" 
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a custom prompt..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? 'Generating...' : 'Generate Response'}
                </button>
              </form>
              
              {response && (
                <div className="mt-4">
                  <h6>Response:</h6>
                  <div className="border p-3 bg-light" style={{ whiteSpace: 'pre-line' }}>
                    {response}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Current Configuration</h5>
            </div>
            <div className="card-body">
              {configError && (
                <div className="alert alert-danger">
                  {configError}
                </div>
              )}
              
              {isLoadingConfig ? (
                <p className="text-muted">Loading configuration...</p>
              ) : personalityConfig ? (
                <div className="border p-3 bg-light" style={{ maxHeight: '500px', overflow: 'auto' }}>
                  <pre className="mb-0">{JSON.stringify(personalityConfig, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-muted">
                  No configuration loaded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityPage; 