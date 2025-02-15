
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Quote, Info, ArrowRight } from "lucide-react";
import { PhilosopherIllustration } from "./PhilosopherIllustration";
import { generateWisdom } from "@/utils/wisdomUtils";
import { philosopherData, type PhilosopherName } from "@/constants/philosophers";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AboutDialog } from "./dialogs/AboutDialog";
import { WisdomDialog } from "./dialogs/WisdomDialog";
import { PhilosopherDialog } from "./dialogs/PhilosopherDialog";
import { SuggestionDialog } from "./dialogs/SuggestionDialog";

const placeholderQuestions = ["What vexes thy spirit?", "What counsel dost thou seek?", "What burden weighs upon thy thoughts?", "What wisdom dost thou seek?", "What matter requires contemplation?"];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderQuestions.length);
  return placeholderQuestions[randomIndex];
};

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [reference, setReference] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showPhilosopherDialog, setShowPhilosopherDialog] = useState(false);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [philosopher, setPhilosopher] = useState<PhilosopherName>("Seneca");
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 20,
    });
  }, []);

  const handleGenerateWisdom = async (userInput?: string) => {
    setIsLoading(true);
    try {
      const result = await generateWisdom(philosopher, userInput);
      setWisdom(result.wisdom);
      setReference(result.reference);
      setShowWisdomDialog(true);
      setInput(""); 
      setPlaceholder(getRandomPlaceholder());
    } catch (error) {
      console.error('Error generating wisdom:', error);
      toast({
        title: "Error",
        description: "Failed to generate wisdom",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6 space-y-8">
          <div className="text-center space-y-4" data-aos="fade-down" data-aos-offset="10">
            <PhilosopherIllustration philosopher={philosopher} />
            <h1 className="font-serif text-4xl md:text-5xl text-primary/80 font-medium flex items-center justify-center gap-2">
              {philosopherData[philosopher].displayName} says&hellip;
            </h1>
          </div>

          <Card className="p-6 bg-background/80 backdrop-blur border" data-aos="fade-up" data-aos-offset="10" data-aos-delay="200">
            <Textarea 
              placeholder={placeholder} 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="min-h-[100px] mb-4 font-sans" 
            />
            
            <Button 
              onClick={() => handleGenerateWisdom(input.trim() || undefined)} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : input.trim() ? (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Generate Wisdom
                </>
              ) : (
                <>
                  <Quote className="mr-2 h-4 w-4" />
                  Random Quote
                </>
              )}
            </Button>
          </Card>

          <p className="text-muted-foreground text-lg text-center" data-aos="fade-up" data-aos-offset="10" data-aos-delay="400">
            Ancient wisdom for modern problems
          </p>
        </div>
      </div>

      <div className="absolute top-8 right-8" data-aos="fade-left" data-aos-offset="10" data-aos-delay="600">
        <div className="relative group">
          <Button 
            size="icon" 
            className="h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-shadow p-0 overflow-hidden" 
            onClick={() => setShowPhilosopherDialog(true)}
          >
            <img 
              src={philosopherData[philosopher].imageSrc} 
              alt={philosopherData[philosopher].displayName}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
            />
          </Button>
          <div 
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-background"
            style={{ 
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            }}
          />
        </div>
      </div>

      <footer className="p-4 flex justify-center gap-4" data-aos="fade-up" data-aos-offset="10" data-aos-delay="800">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" onClick={() => setShowAboutDialog(true)}>
          <Info className="h-6 w-6 text-primary" />
        </Button>
        <ThemeToggle />
      </footer>

      <AboutDialog 
        open={showAboutDialog} 
        onOpenChange={setShowAboutDialog} 
      />

      <WisdomDialog 
        open={showWisdomDialog}
        onOpenChange={setShowWisdomDialog}
        wisdom={wisdom}
        reference={reference}
        philosopher={philosopher}
      />

      <PhilosopherDialog 
        open={showPhilosopherDialog}
        onOpenChange={setShowPhilosopherDialog}
        currentPhilosopher={philosopher}
        onPhilosopherSelect={setPhilosopher}
        onSuggestClick={() => {
          setShowSuggestionDialog(true);
          setShowPhilosopherDialog(false);
        }}
      />

      <SuggestionDialog 
        open={showSuggestionDialog}
        onOpenChange={setShowSuggestionDialog}
      />
    </div>
  );
};

export default WisdomGenerator;
