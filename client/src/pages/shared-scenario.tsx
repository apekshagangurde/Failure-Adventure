import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Scenario } from "@shared/schema";

// UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Share2, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SharedScenario() {
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ shareId: string }>("/shared/:shareId");
  const { toast } = useToast();
  const shareId = params?.shareId;
  
  const { data: scenario, isLoading, isError } = useQuery({
    queryKey: ['/api/shared-scenarios', shareId],
    queryFn: () => apiRequest<Scenario>(`/api/shared-scenarios/${shareId}`),
    enabled: !!shareId,
  });
  
  const copyShareLink = () => {
    if (shareId) {
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      });
    }
  };
  
  const startGameWithScenario = () => {
    if (scenario) {
      // Store this scenario in localStorage to be used in the game
      localStorage.setItem('custom_scenario', JSON.stringify(scenario));
      navigate('/');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (isError || !scenario) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't find the shared scenario. It may have been removed or the link is invalid.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/")}>
            Back to Game
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Shared Awkward Scenario</CardTitle>
          <CardDescription>
            {scenario.creatorName 
              ? `Created by ${scenario.creatorName}` 
              : "Play this custom awkward scenario!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-4">Scenario Preview</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Question:</h4>
              <p className="bg-slate-50 p-3 rounded border dark:bg-slate-900">
                {scenario.question}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium mb-2">Choice A:</h4>
                <p className="bg-slate-50 p-3 rounded border dark:bg-slate-900">
                  {scenario.choices.A}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Choice B:</h4>
                <p className="bg-slate-50 p-3 rounded border dark:bg-slate-900">
                  {scenario.choices.B}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            <span className="font-medium">Share this scenario with others</span>
          </div>
          <Button 
            variant="outline" 
            onClick={copyShareLink}
            className="mt-2 mb-4 w-full sm:w-auto"
          >
            Copy Share Link
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial"
            onClick={() => navigate("/")}
          >
            Back to Game
          </Button>
          <Button 
            className="flex-1 sm:flex-initial"
            onClick={startGameWithScenario}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Play This Scenario
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}