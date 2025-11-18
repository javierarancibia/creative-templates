'use client';

import { useState } from 'react';
import { CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * Stubbed AI copy generation function
 * This can be easily replaced with a real AI API call later
 */
function generateAICopy(description: string): string {
  if (!description.trim()) {
    return 'Please provide a product description to generate ad copy.';
  }

  // Simple template-based generation for now
  const templates = [
    `Boost your ${description} with this high-performing, on-brand ad copy that converts!`,
    `Discover the power of ${description}. Transform your marketing today!`,
    `${description} - Elevate your brand with compelling, results-driven messaging.`,
    `Unlock the potential of ${description}. Drive engagement and sales effortlessly.`,
  ];

  // Use description length to deterministically pick a template
  const index = description.length % templates.length;
  return templates[index];
}

interface AICopyHelperProps {
  /**
   * Callback to apply generated text to selected text layer
   */
  onApplyToSelected?: (text: string) => void;

  /**
   * Whether a text layer is currently selected
   */
  hasSelectedTextLayer: boolean;
}

export function AICopyHelper({ onApplyToSelected, hasSelectedTextLayer }: AICopyHelperProps) {
  const [description, setDescription] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const generated = generateAICopy(description);
    setGeneratedText(generated);
    setIsGenerating(false);
  };

  const handleInsert = () => {
    if (onApplyToSelected && generatedText) {
      onApplyToSelected(generatedText);
    }
  };

  return (
    <>
      <CardHeader>
        <h2 className="text-xl font-semibold">AI Copy Helper</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {/* Input Section */}
          <div>
            <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your product description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Ad Copy'}
          </Button>

          {/* Output Section */}
          {generatedText && (
            <div className="space-y-3">
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Copy
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{generatedText}</p>
                </div>
              </div>

              {/* Insert Button - Only shown when text layer is selected */}
              {hasSelectedTextLayer && onApplyToSelected && (
                <Button
                  variant="outline"
                  onClick={handleInsert}
                  className="w-full"
                >
                  Insert into Selected Text Layer
                </Button>
              )}

              {/* Helper text when no text layer is selected */}
              {!hasSelectedTextLayer && (
                <p className="text-sm text-gray-500 text-center">
                  Select a text layer on the canvas to insert this copy
                </p>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </>
  );
}

