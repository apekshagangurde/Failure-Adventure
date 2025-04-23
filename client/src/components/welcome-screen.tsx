import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Images for the image carousel
  const awkwardImages = [
    "https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1517146783983-8e609bde68c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1513301650049-f2bcdb15194b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardContent className="p-8 text-center">
          <motion.h1 
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-transparent bg-clip-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            Choose Your Own Failure Adventure
          </motion.h1>
          
          <motion.div 
            className="mb-8"
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <motion.div
              className="relative w-48 h-48 mx-auto mb-4"
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              {awkwardImages.map((img, index) => (
                <motion.img 
                  key={index}
                  src={img} 
                  alt="Person in an awkward situation" 
                  className="absolute top-0 left-0 w-48 h-48 object-cover rounded-full shadow-lg"
                  initial={{ opacity: index === 0 ? 1 : 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    zIndex: [1, 2, 2, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    delay: index * 3, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.p 
                className="text-xl mb-2 font-bold"
                variants={item}
              >
                Ready to choose your own awkward adventure?
              </motion.p>
              <motion.p 
                className="text-gray-600"
                variants={item}
              >
                Make choices and see the hilariously awkward results!
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={onStart} 
              className="bg-[#FF6B6B] hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-full text-xl shadow-md transition-all duration-200 ease-in-out w-auto"
            >
              <motion.i 
                className="ri-play-fill mr-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              ></motion.i> 
              Start the Adventure
            </Button>
          </motion.div>
          
          <motion.p 
            className="mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            10 random awkward scenarios await!
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeScreen;
