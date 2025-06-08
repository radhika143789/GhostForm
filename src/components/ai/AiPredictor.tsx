
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface PredictionResult {
  prediction: string;
  confidence: number;
  details?: string;
}

export const AiPredictor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // In a real application, you would make an API call to your AI service
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated AI prediction
      const simulatedResult: PredictionResult = {
        prediction: simulateAIPrediction(query, category),
        confidence: Math.round(Math.random() * 30 + 70), // Random confidence between 70-100%
        details: "This prediction is based on pattern analysis of similar data points."
      };
      
      setResult(simulatedResult);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple simulator function - in a real app, this would be your AI model API call
  const simulateAIPrediction = (query: string, category: string): string => {
    if (category === 'security') {
      if (query.toLowerCase().includes('password')) {
        return "This appears to be a security risk. The query contains sensitive password information.";
      } else if (query.toLowerCase().includes('credit')) {
        return "This may contain sensitive financial information. Exercise caution.";
      }
      return "No immediate security concerns detected.";
    } else if (category === 'behavior') {
      if (query.length > 50) {
        return "Based on the detail level, this indicates high user engagement.";
      }
      return "This appears to be a standard user interaction.";
    } else {
      // General category
      const keywords = ['urgent', 'important', 'critical', 'issue', 'problem'];
      const containsUrgentKeywords = keywords.some(keyword => 
        query.toLowerCase().includes(keyword)
      );
      
      if (containsUrgentKeywords) {
        return "This appears to be an urgent matter requiring attention.";
      }
      return "This is likely a routine inquiry.";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Predictor</CardTitle>
        <CardDescription>
          Get AI-powered predictions based on your input
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="general">General Analysis</option>
              <option value="security">Security Assessment</option>
              <option value="behavior">User Behavior</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="query" className="text-sm font-medium">
              Input Text
            </label>
            <Textarea
              id="query"
              placeholder="Enter text for AI analysis..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : "Get Prediction"}
          </Button>
        </form>
        
        {result && (
          <div className="mt-6 p-4 border rounded-md bg-accent/30">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Prediction:</h3>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {result.confidence}% confidence
                </span>
              </div>
              <p className="text-sm">{result.prediction}</p>
              {result.details && (
                <p className="text-xs text-muted-foreground mt-2">{result.details}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
