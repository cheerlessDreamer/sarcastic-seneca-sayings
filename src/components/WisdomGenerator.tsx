import { useState } from "react";
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

const placeholderQuestions = ["What vexes thy spirit?", "What counsel dost thou seek?", "What burden weighs upon thy thoughts?", "What wisdom dost thou seek?", "What matter requires contemplation?"];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderQuestions.length);
  return placeholderQuestions[randomIndex];
};

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
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
      setWisdom(generatedWisdom);
      setShowWisdomDialog(true);
      setInput(""); 
      setPlaceholder(getRandomPlaceholder());
    } catch (error) {
      console.error('Error generating wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
          <div className="flex-1 flex flex-col justify-end space-y-6 mb-6">
            {wisdom && (
              <div className="flex items-start gap-4 animate-fade-up">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={philosopherData[philosopher].imageSrc} 
                    alt={philosopher} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 bg-secondary/50 rounded-lg p-4 prose prose-invert">
                  <p className="text-foreground text-lg leading-relaxed m-0">
                    {wisdom}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-muted pt-4">
            <Card className="bg-background border-muted">
              <div className="p-4">
                <Textarea 
                  placeholder={placeholder}
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  className="min-h-[100px] mb-4 bg-background text-foreground border-muted resize-none focus:ring-primary/20" 
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleGenerateWisdom(input)} 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Wisdom
                  </Button>
                  
                  <Button 
                    onClick={() => handleGenerateWisdom()} 
                    variant="outline" 
                    className="flex-1 border-muted hover:bg-secondary" 
                    disabled={isLoading}
                  >
                    <Quote className="mr-2 h-4 w-4" />
                    Random Quote
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90" 
          onClick={() => setShowPhilosopherDialog(true)}
        >
          <Users className="h-6 w-6" />
        </Button>
      </div>

      <footer className="p-4 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-secondary" 
          onClick={() => setShowAboutDialog(true)}
        >
          <Info className="h-6 w-6 text-muted-foreground" />
        </Button>
      </footer>

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

      <Dialog open={showWisdomDialog} onOpenChange={setShowWisdomDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{philosopherData[philosopher].displayName} says…</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
              {wisdom}
            </p>
            <ShareButtons wisdom={wisdom} />
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default WisdomGenerator;
