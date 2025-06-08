
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shield, AlertTriangle, CircleCheck } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useToast } from "@/components/ui/use-toast";

interface RiskFactor {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  description: string;
  improvement: string;
  fixed: boolean;
}

const initialRiskFactors: RiskFactor[] = [
  {
    id: "1",
    name: "Data Exposure Range",
    score: 65,
    maxScore: 100,
    description: "Your personal data is exposed across 28 websites, which is above the recommended limit.",
    improvement: "Remove your data from non-essential services and older accounts.",
    fixed: false
  },
  {
    id: "2",
    name: "Sensitive Data Protection",
    score: 80,
    maxScore: 100,
    description: "Most of your sensitive data is well-protected, but there are some areas for improvement.",
    improvement: "Enable additional protection for your home address and phone number.",
    fixed: false
  },
  {
    id: "3",
    name: "Public Profile Risk",
    score: 40,
    maxScore: 100,
    description: "Your public profiles contain more personal information than recommended.",
    improvement: "Review and minimize personal details on social media and professional networks.",
    fixed: false
  },
  {
    id: "4",
    name: "Data Breach Vulnerability",
    score: 75,
    maxScore: 100,
    description: "Your email has been found in 2 data breaches in the past year.",
    improvement: "Change passwords for affected accounts and enable 2FA where available.",
    fixed: false
  },
  {
    id: "5",
    name: "Cross-Platform Data Correlation",
    score: 50,
    maxScore: 100,
    description: "Your data can be easily correlated across different platforms, increasing identification risk.",
    improvement: "Use different usernames and segmented email addresses for different services.",
    fixed: false
  }
];

// Data for radar chart
const createRadarData = (riskFactors: RiskFactor[]) => {
  return riskFactors.map(factor => ({
    subject: factor.name,
    score: factor.fixed ? 90 : factor.score,
    fullMark: factor.maxScore
  }));
};

export default function RiskAssessment() {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>(initialRiskFactors);
  const [radarData, setRadarData] = useState(createRadarData(initialRiskFactors));
  const { toast } = useToast();

  const overallScore = Math.round(
    riskFactors.reduce((acc, factor) => acc + (factor.fixed ? 90 : factor.score), 0) / riskFactors.length
  );

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low", color: "bg-green-100 text-green-800" };
    if (score >= 60) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    if (score >= 40) return { level: "High", color: "bg-orange-100 text-orange-800" };
    return { level: "Critical", color: "bg-red-100 text-red-800" };
  };

  const fixRiskFactor = (id: string) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, fixed: true } : factor
      )
    );
    
    // Update radar chart data
    setRadarData(createRadarData(
      riskFactors.map(factor => 
        factor.id === id ? { ...factor, fixed: true } : factor
      )
    ));
    
    toast({
      title: "Risk Factor Addressed",
      description: "The recommended improvement has been applied.",
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
        <p className="text-muted-foreground">Analyze and improve your data privacy risk factors</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Privacy Risk Score</CardTitle>
            <CardDescription>Your current privacy protection level</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={
                      overallScore >= 80 ? "#22c55e" : 
                      overallScore >= 60 ? "#eab308" : 
                      overallScore >= 40 ? "#f97316" : 
                      "#ef4444"
                    }
                    strokeWidth="10" 
                    strokeDasharray={`${overallScore * 2.83} 283`} 
                    strokeDashoffset="0" 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">out of 100</span>
                </div>
              </div>
              
              <Badge className={getRiskLevel(overallScore).color + " mt-4 px-3 py-1 text-sm"}>
                {getRiskLevel(overallScore).level} Risk
              </Badge>
              
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Your overall privacy risk is {getRiskLevel(overallScore).level.toLowerCase()}. 
                There are {riskFactors.filter(f => !f.fixed).length} risk factors that can be improved.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Analysis</CardTitle>
            <CardDescription>Breakdown of your privacy risk factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8446ff"
                    fill="#8446ff"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8">Detailed Risk Factors</h2>
      
      <div className="space-y-4">
        {riskFactors.map(factor => (
          <Card key={factor.id} className={factor.fixed ? "border-green-200 bg-green-50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {factor.fixed ? 
                    <CircleCheck className="h-5 w-5 mr-2 text-green-600" /> : 
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />}
                  {factor.name}
                </CardTitle>
                <Badge className={getRiskLevel(factor.score).color}>
                  {getRiskLevel(factor.score).level} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Score: {factor.fixed ? 90 : factor.score}/{factor.maxScore}</span>
                    <span className="text-sm text-muted-foreground">
                      {factor.fixed ? "Fixed" : "Needs improvement"}
                    </span>
                  </div>
                  <Progress 
                    value={factor.fixed ? 90 : factor.score} 
                    className={factor.fixed ? "bg-green-100" : ""}
                  />
                </div>
                
                <p className="text-sm">{factor.description}</p>
                
                {!factor.fixed && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-start">
                      <Search className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Recommended Improvement</p>
                        <p className="text-sm text-amber-700">{factor.improvement}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {factor.fixed ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <Shield className="h-4 w-4 mr-1" />
                    This risk factor has been addressed
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => fixRiskFactor(factor.id)}
                  >
                    Fix This Risk
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
