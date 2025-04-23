import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RiEmotionLaughLine, 
  RiTwitterFill, 
  RiInstagramFill, 
  RiFacebookFill, 
  RiRestartLine,
  RiFileCopyLine,
  RiCheckLine,
  RiShareLine,
  RiMedalLine
} from "react-icons/ri";
import { UserChoice } from "@/lib/types";
import { determinePersonalityResult, getFunnyQuote } from "@/lib/personality-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ResultsScreenProps {
  onRestart: () => void;
  userChoices: UserChoice[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart, userChoices }) => {
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("personality");
  const resultSummaryRef = useRef<HTMLDivElement>(null);

  // Count the choices
  const choicesACount = userChoices.filter(choice => choice.choice === 'A').length;
  const choicesBCount = userChoices.filter(choice => choice.choice === 'B').length;
  
  // Get personality result
  const personalityResult = determinePersonalityResult(choicesACount, choicesBCount);
  const funnyQuote = getFunnyQuote(choicesACount, choicesBCount);

  // Function to share on Twitter
  const shareOnTwitter = () => {
    const text = `I got "${personalityResult.title}" in Choose Your Own Failure Adventure! ${funnyQuote} Try it yourself!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  // Function to share on Facebook
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  // Function to share on Instagram (opens a dialog with copyable text)
  const shareOnInstagram = () => {
    const textToCopy = `I got "${personalityResult.title}" in Choose Your Own Failure Adventure!\n\n${funnyQuote}\n\nPlay it yourself at: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsTextCopied(true);
        setTimeout(() => setIsTextCopied(false), 2000);
        alert("Caption copied to clipboard! Open Instagram to create a story or post.");
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  // Function to copy result text to clipboard
  const copyResultToClipboard = () => {
    if (!resultSummaryRef.current) return;
    
    const textToCopy = `My Choose Your Own Failure Adventure Results:\n\n` +
      `${personalityResult.title}\n${personalityResult.description}\n\n` +
      `${funnyQuote}\n\n` +
      `My choices:\n` +
      userChoices.map((choice, index) => 
        `${index + 1}. ${choice.question} I chose: ${choice.choiceText}`
      ).join('\n') +
      `\n\nTry it yourself at: ${window.location.href}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsTextCopied(true);
        setTimeout(() => setIsTextCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <motion.div 
            className="bg-[#FFD166] inline-block rounded-full p-4 mb-4"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <RiEmotionLaughLine className="text-3xl" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-transparent bg-clip-text">
            You Survived!
          </h2>
          
          <p className="text-lg mb-4">Congrats on navigating {userChoices.length} awkward situations!</p>
          
          <Tabs defaultValue="personality" className="mb-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="personality">Result</TabsTrigger>
              <TabsTrigger value="choices">Your Choices</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="personality" key="personality">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={resultSummaryRef}
                >
                  <div className="bg-gradient-to-r from-[#FFF3E6] to-[#E6F9F7] p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <RiMedalLine className="text-xl text-[#FFD166] mr-2" />
                      <h3 className="font-bold text-xl">Your Awkwardness Profile:</h3>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-[#FF6B6B] mb-2">{personalityResult.title}</h4>
                    
                    <div className="flex justify-center mb-4">
                      <motion.img 
                        src={personalityResult.imageUrl}
                        alt={personalityResult.title}
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <p className="text-gray-700 mb-4">{personalityResult.description}</p>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200 italic mb-2">
                      "{funnyQuote}"
                    </div>
                    
                    <div className="flex justify-center gap-2 mt-3">
                      <Badge className="bg-[#FF6B6B]">{choicesACount} A choices</Badge>
                      <Badge className="bg-[#4ECDC4]">{choicesBCount} B choices</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={copyResultToClipboard}
                    className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 mb-4 border border-gray-300"
                  >
                    {isTextCopied ? (
                      <><RiCheckLine className="mr-2" /> Copied to clipboard!</>
                    ) : (
                      <><RiFileCopyLine className="mr-2" /> Copy result as text</>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="choices" key="choices">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold text-xl mb-3">Your Journey:</h3>
                  
                  <div className="max-h-60 overflow-y-auto mb-4 pr-1">
                    <Accordion type="single" collapsible className="w-full">
                      {userChoices.map((choice, index) => (
                        <AccordionItem value={`choice-${index}`} key={index} className="border-b border-gray-200">
                          <AccordionTrigger className="py-3 text-left">
                            <div className="flex items-start">
                              <span className="bg-[#FFD166] text-black w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium">{choice.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-8">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm mb-2">
                                <span className="font-bold">You chose:</span> {choice.choiceText}
                              </p>
                              <p className="text-sm text-gray-700 italic mb-2">{choice.responseText}</p>
                              <div className="flex justify-center">
                                <img 
                                  src={choice.imageUrl} 
                                  alt={`Response to choice ${choice.choice}`} 
                                  className="w-16 h-16 object-cover rounded-md" 
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="share" key="share">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold text-xl mb-3">Share Your Results:</h3>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <motion.button 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90"
                      onClick={shareOnTwitter}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RiTwitterFill className="text-2xl" />
                      <span className="text-xs">Twitter</span>
                    </motion.button>
                    
                    <motion.button 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90"
                      onClick={shareOnInstagram}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RiInstagramFill className="text-2xl" />
                      <span className="text-xs">Instagram</span>
                    </motion.button>
                    
                    <motion.button 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#3B5998] text-white hover:opacity-90"
                      onClick={shareOnFacebook}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RiFacebookFill className="text-2xl" />
                      <span className="text-xs">Facebook</span>
                    </motion.button>
                  </div>
                  
                  <Button 
                    onClick={copyResultToClipboard}
                    className="w-full mb-2"
                  >
                    {isTextCopied ? (
                      <><RiCheckLine className="mr-2" /> Copied to clipboard!</>
                    ) : (
                      <><RiShareLine className="mr-2" /> Copy for sharing</>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2"
          >
            <Button 
              onClick={onRestart} 
              className="w-full bg-[#FF6B6B] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full shadow-md"
            >
              <RiRestartLine className="mr-2" /> Start A New Adventure
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsScreen;
