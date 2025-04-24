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
    <div className="fixed inset-0 bg-[#1a1b26] flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="w-full border-b border-gray-800 bg-[#1a1b26] p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            🍽️ GPT Recipe Generator
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full overflow-y-auto bg-[#1a1b26]">
        <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-6">
          {/* Input area */}
          <div className="w-full">
            <textarea
              className="w-full h-36 p-4 text-lg bg-[#24283b] text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-gray-400"
              placeholder="Enter ingredients (e.g., eggs, tomato, spinach)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={getRecipe}
              className="w-full md:w-auto min-w-[200px] px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !ingredients}
            >
              {loading ? 'Generating Recipe...' : 'Get Recipe'}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Recipe result */}
          {result && (
            <div className="w-full bg-[#24283b] border border-gray-700 p-6 rounded-lg space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Preparation Method</h2>
                <p className="text-gray-300 leading-relaxed">{result.preparationMethod}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Nutritional Info</h2>
                <p className="text-gray-300 leading-relaxed">{result.nutritionalInformations}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-[#1a1b26] p-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-400 text-sm">
            Enter your ingredients and get a customized recipe instantly
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;