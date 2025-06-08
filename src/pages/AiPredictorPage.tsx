
import React from 'react';
import { AiPredictor } from '@/components/ai/AiPredictor';

export default function AiPredictorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Predictor</h1>
        <p className="text-muted-foreground">
          Use our AI to predict outcomes and analyze information. Enter text into the predictor below to get started.
        </p>
      </div>
      
      <AiPredictor />
      
      <div className="mt-8 p-6 border rounded-lg bg-accent/10">
        <h2 className="font-semibold mb-3">How it works</h2>
        <p className="text-sm text-muted-foreground">
          Our AI predictor analyzes the input text and generates predictions based on identified patterns.
          It can help assess security risks, analyze user behavior, or provide general insights based on the text content.
          Choose a category to focus the prediction on your specific needs.
        </p>
      </div>
    </div>
  );
}
