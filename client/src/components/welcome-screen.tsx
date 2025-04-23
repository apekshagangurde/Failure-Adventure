import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-[#FF6B6B]">
            Choose Your Own Failure Adventure
          </h1>
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Person covering face in embarrassment" 
              className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
            />
            <p className="text-xl mb-2">Ready to choose your own awkward adventure?</p>
            <p className="text-gray-600">Make choices and see the hilariously awkward results!</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onStart} 
              className="bg-[#FF6B6B] hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-full text-xl shadow-md transition-all duration-200 ease-in-out w-auto"
            >
              <i className="ri-play-fill mr-2"></i> Start the Adventure
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-gray-500">10 awkward scenarios await!</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeScreen;
