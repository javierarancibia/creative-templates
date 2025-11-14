'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AICopyHelper() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // TODO: Implement AI copy generation
    setTimeout(() => {
      setSuggestions([
        'Sample suggestion 1',
        'Sample suggestion 2',
        'Sample suggestion 3',
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold mb-3">AI Copy Helper</h3>
      <div className="space-y-3">
        <Input
          placeholder="Describe the copy you need..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          variant="primary"
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !prompt}
        >
          {loading ? 'Generating...' : 'Generate Copy'}
        </Button>
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Suggestions:</p>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 rounded border border-gray-200 text-sm cursor-pointer hover:bg-gray-100"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

