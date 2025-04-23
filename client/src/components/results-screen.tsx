import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RiEmotionLaughLine, 
  RiTwitterFill, 
  RiInstagramFill, 
  RiFacebookFill, 
  RiRestartLine 
} from "react-icons/ri";

interface ResultsScreenProps {
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  // Function to share on Twitter
  const shareOnTwitter = () => {
    const text = "I just survived some hilariously awkward situations in 'Choose Your Own Failure Adventure'! Try it yourself!";
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  // Function to share on Facebook
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardContent className="p-8 text-center">
          <motion.div 
            className="bg-[#FFD166] inline-block rounded-full p-4 mb-4"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <RiEmotionLaughLine className="text-4xl" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">You Survived!</h2>
          <p className="text-lg mb-6">Congrats on making it through all these awkward situations!</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-xl mb-2">Share Your Results</h3>
            <div className="flex justify-center space-x-4 mt-4">
              <motion.button 
                className="bg-[#1DA1F2] text-white p-3 rounded-full hover:opacity-90"
                onClick={shareOnTwitter}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RiTwitterFill className="text-xl" />
              </motion.button>
              <motion.button 
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white p-3 rounded-full hover:opacity-90"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RiInstagramFill className="text-xl" />
              </motion.button>
              <motion.button 
                className="bg-[#3B5998] text-white p-3 rounded-full hover:opacity-90"
                onClick={shareOnFacebook}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RiFacebookFill className="text-xl" />
              </motion.button>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onRestart} 
              className="bg-[#FF6B6B] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full shadow-md"
            >
              <RiRestartLine className="mr-2" /> Start Over
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsScreen;
