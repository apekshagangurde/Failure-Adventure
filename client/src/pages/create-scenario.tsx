import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createScenarioSchema } from "@shared/schema";
import type { CreateScenario } from "@shared/schema";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// UI components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Share2 } from "lucide-react";

export default function CreateScenario() {
  const [activeTab, setActiveTab] = useState("question");
  const [createdScenario, setCreatedScenario] = useState<null | any>(null);
  const [creatorName, setCreatorName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form setup with validation
  const form = useForm<CreateScenario>({
    resolver: zodResolver(createScenarioSchema),
    defaultValues: {
      question: "",
      choices: {
        A: "",
        B: ""
      },
      responses: {
        A: "",
        B: ""
      },
      images: {
        A: "https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        B: "https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      creatorName: ""
    }
  });
  
  // Handle API call to create scenario
  const mutation = useMutation({
    mutationFn: (data: CreateScenario) => {
      return apiRequest("/api/custom-scenarios", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    onSuccess: (data) => {
      setCreatedScenario(data);
      toast({
        title: "Scenario created!",
        description: "Your awkward scenario has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create your scenario. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: CreateScenario) => {
    // Add creator name if provided
    if (creatorName) {
      data.creatorName = creatorName;
    }
    
    // Submit to API
    mutation.mutate(data);
  };
  
  // Handle copying share link to clipboard
  const copyShareLink = () => {
    if (createdScenario?.shareId) {
      const shareUrl = `${window.location.origin}/shared/${createdScenario.shareId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      });
    }
  };
  
  // Helper to navigate between form tabs
  const goToNextTab = () => {
    if (activeTab === "question") setActiveTab("choices");
    else if (activeTab === "choices") setActiveTab("responses");
    else if (activeTab === "responses") setActiveTab("preview");
  };
  
  const goToPreviousTab = () => {
    if (activeTab === "preview") setActiveTab("responses");
    else if (activeTab === "responses") setActiveTab("choices");
    else if (activeTab === "choices") setActiveTab("question");
  };
  
  // If scenario has been created, show success screen
  if (createdScenario) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center mb-2">
              <CheckCircle className="text-green-500 mr-2" />
              <CardTitle>Scenario Created Successfully!</CardTitle>
            </div>
            <CardDescription>
              Your awkward scenario has been added to the game. Share it with friends or play it yourself!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Scenario:</h3>
              <p className="text-lg mb-3">{createdScenario.question}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-3 bg-white dark:bg-slate-800">
                  <h4 className="font-medium mb-1">Choice A:</h4>
                  <p>{createdScenario.choices.A}</p>
                </div>
                <div className="border rounded-lg p-3 bg-white dark:bg-slate-800">
                  <h4 className="font-medium mb-1">Choice B:</h4>
                  <p>{createdScenario.choices.B}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="mr-2 h-5 w-5" />
                Share Your Scenario
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Copy this link to share your custom scenario with friends:
              </p>
              <div className="flex items-center mt-2">
                <Input 
                  value={`${window.location.origin}/shared/${createdScenario.shareId}`}
                  readOnly
                  className="mr-2"
                />
                <Button onClick={copyShareLink}>
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Game
            </Button>
            <Button onClick={() => {
              setCreatedScenario(null);
              form.reset();
            }}>
              Create Another
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Own Awkward Scenario</CardTitle>
          <CardDescription>
            Make a hilarious awkward scenario to add to the game and share with friends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="question">Question</TabsTrigger>
                  <TabsTrigger value="choices">Choices</TabsTrigger>
                  <TabsTrigger value="responses">Responses</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                {/* Question Tab */}
                <TabsContent value="question">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Awkward Scenario Question</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe an awkward situation (e.g., 'You accidentally send a text meant for your friend to your crush. What do you do?')"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This is the awkward situation that players will be presented with.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Creator Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name or nickname"
                          value={creatorName}
                          onChange={(e) => setCreatorName(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Add your name so others know who created this scenario.
                      </FormDescription>
                    </FormItem>
                    
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertTitle>Pro Tip!</AlertTitle>
                      <AlertDescription>
                        The best scenarios have no "right" answer - both choices should be equally awkward or confusing!
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!form.getValues("question")}
                      >
                        Next: Choices
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Choices Tab */}
                <TabsContent value="choices">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="choices.A"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Choice A</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="First awkward option (e.g., 'Pretend it was meant for them and play it cool')"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="choices.B"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Choice B</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Second awkward option (e.g., 'Send 10 follow-up texts to explain the mistake')"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!form.getValues("choices.A") || !form.getValues("choices.B")}
                      >
                        Next: Responses
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Responses Tab */}
                <TabsContent value="responses">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="responses.A"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response for Choice A</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What hilariously happens if they choose A (e.g., 'They actually believe you, and now you're committed to the lie...')"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Make this funny and awkward - what's the cringey outcome?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="responses.B"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response for Choice B</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What hilariously happens if they choose B (e.g., 'Your flood of explanatory texts makes everything 10x more awkward...')"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Make this funny and awkward - what's the cringey outcome?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!form.getValues("responses.A") || !form.getValues("responses.B")}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Preview Tab */}
                <TabsContent value="preview">
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border dark:bg-slate-900">
                      <h3 className="font-semibold text-xl mb-4">Scenario Preview</h3>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Question:</h4>
                        <p className="bg-white p-3 rounded border dark:bg-slate-800">
                          {form.getValues("question") || "No question provided yet"}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium mb-2">Choice A:</h4>
                          <p className="bg-white p-3 rounded border dark:bg-slate-800">
                            {form.getValues("choices.A") || "No choice provided yet"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Choice B:</h4>
                          <p className="bg-white p-3 rounded border dark:bg-slate-800">
                            {form.getValues("choices.B") || "No choice provided yet"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Response A:</h4>
                          <p className="bg-white p-3 rounded border dark:bg-slate-800">
                            {form.getValues("responses.A") || "No response provided yet"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Response B:</h4>
                          <p className="bg-white p-3 rounded border dark:bg-slate-800">
                            {form.getValues("responses.B") || "No response provided yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        disabled={!form.formState.isValid || mutation.isPending}
                      >
                        {mutation.isPending ? "Creating..." : "Create Scenario"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}