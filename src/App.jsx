import { useState } from 'react';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('API Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);

  const getRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that outputs JSON.' },
            { role: 'user', content: `Create a recipe from these ingredients: ${ingredients}. Respond with JSON format: { "preparationMethod": "string", "nutritionalInformations": "string" }` }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const json = JSON.parse(data.choices[0].message.content);
      setResult(json);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">🍽️ GPT Recipe Generator</h1>

      <textarea
        className="w-full max-w-md h-32 p-3 text-black rounded-md"
        placeholder="Enter ingredients (e.g., eggs, tomato, spinach)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <button
        onClick={getRecipe}
        className="bg-blue-600 hover:bg-blue-700 mt-4 px-6 py-2 rounded disabled:opacity-50"
        disabled={loading || !ingredients}
      >
        {loading ? 'Generating...' : 'Get Recipe'}
      </button>

      {error && (
        <div className="bg-red-500 text-white mt-6 p-4 rounded w-full max-w-md">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white text-black mt-6 p-4 rounded w-full max-w-md space-y-4">
          <div>
            <h2 className="font-bold text-lg">Preparation Method</h2>
            <p>{result.preparationMethod}</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">Nutritional Info</h2>
            <p>{result.nutritionalInformations}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;