
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Quote, Info, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PhilosopherIllustration } from "./PhilosopherIllustration";
import { ShareButtons } from "./ShareDialog";
import { generateWisdom } from "@/utils/wisdomUtils";
import { philosophers, philosopherData, philosopherDescriptions, type PhilosopherName } from "@/constants/philosophers";
import { PhilosopherCard } from "./PhilosopherCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const placeholderQuestions = ["What vexes thy spirit?", "What counsel dost thou seek?", "What burden weighs upon thy thoughts?", "What wisdom dost thou seek?", "What matter requires contemplation?"];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderQuestions.length);
  return placeholderQuestions[randomIndex];
};

// Generate a random 6-digit reference number
const generateReference = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [reference, setReference] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showPhilosopherDialog, setShowPhilosopherDialog] = useState(false);
  const [philosopher, setPhilosopher] = useState<PhilosopherName>("Seneca");
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());

  const handleGenerateWisdom = async (userInput?: string) => {
    setIsLoading(true);
    try {
      const generatedWisdom = await generateWisdom(philosopher, userInput);
      const newReference = generateReference();
      
      // Save to Supabase
      const { error } = await supabase
        .from('seneca-says')
        .insert({
          philosopher: philosopher,
          philosopher_instructions: philosopherData[philosopher].systemPrompt,
          response: generatedWisdom,
          reference: newReference
        });

      if (error) {
        console.error('Error saving to database:', error);
        toast({
          title: "Error",
          description: "Failed to save wisdom to database",
          variant: "destructive"
        });
        return;
      }

      setWisdom(generatedWisdom);
      setReference(newReference);
      setShowWisdomDialog(true);
      setInput(""); // Clear the input field after generating wisdom
      setPlaceholder(getRandomPlaceholder()); // Set new random placeholder
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

  return <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6 space-y-8">
          <div className="text-center space-y-4">
            <PhilosopherIllustration philosopher={philosopher} />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-semibold flex items-center justify-center gap-2">
              {philosopherData[philosopher].displayName} says&hellip;
            </h1>
          </div>

          <Card className="p-6 bg-background/80 backdrop-blur border">
            <Textarea placeholder={placeholder} value={input} onChange={e => setInput(e.target.value)} className="min-h-[100px] mb-4 font-sans" />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => handleGenerateWisdom(input)} className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Wisdom
              </Button>
              
              <Button onClick={() => handleGenerateWisdom()} variant="outline" className="flex-1" disabled={isLoading}>
                <Quote className="mr-2 h-4 w-4" />
                Random Quote
              </Button>
            </div>
          </Card>

          <p className="text-muted-foreground text-lg text-center">
            Ancient wisdom for modern problems
          </p>
        </div>
      </div>

      {/* FAB for philosopher selection */}
      <div className="fixed bottom-8 right-8">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow" onClick={() => setShowPhilosopherDialog(true)}>
          <Users className="h-6 w-6" />
        </Button>
      </div>

      <footer className="p-4 flex justify-center">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" onClick={() => setShowAboutDialog(true)}>
          <Info className="h-6 w-6 text-muted-foreground" />
        </Button>
      </footer>

      {/* Philosopher Selection Dialog */}
      <Dialog open={showPhilosopherDialog} onOpenChange={setShowPhilosopherDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Choose Your Philosopher</DialogTitle>
            <DialogDescription>
              Select who will dispense wisdom to you
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {philosophers.map(name => <PhilosopherCard key={name} name={name} description={philosopherDescriptions[name]} imageSrc={philosopherData[name].imageSrc} isSelected={philosopher === name} onClick={() => {
            setPhilosopher(name);
            setShowPhilosopherDialog(false);
          }} />)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Wisdom Dialog */}
      <Dialog open={showWisdomDialog} onOpenChange={setShowWisdomDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{philosopherData[philosopher].displayName} says…</DialogTitle>
            {reference && (
              <DialogDescription>
                Reference: #{reference}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
            <p className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
              {wisdom}
            </p>
            <ShareButtons wisdom={wisdom} />
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>About Seneca Says</DialogTitle>
            <DialogDescription>
              Your personal philosophical advisor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Step into the realm of ancient philosophy, where timeless wisdom meets modern challenges. Engage in dialogue with some of history's greatest philosophical minds.
            </p>
            <p className="text-muted-foreground">
              Whether you seek the pragmatic counsel of Seneca, the contemplative insights of Marcus Aurelius, or the serene guidance of Epicurus, their eternal wisdom stands ready to illuminate your path.
            </p>
            <p className="text-muted-foreground">
              Share your thoughts, concerns, or dilemmas, and receive personalized wisdom that bridges millennia to address your contemporary challenges.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};

export default WisdomGenerator;
