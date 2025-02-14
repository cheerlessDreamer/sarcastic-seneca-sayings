import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Quote, Info, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PhilosopherIllustration } from "./PhilosopherIllustration";
import { ShareButtons } from "./ShareDialog";
import { generateWisdom } from "@/utils/wisdomUtils";
import { philosophers, philosopherData, type PhilosopherName } from "@/constants/philosophers";

const philosopherDescriptions = {
  "Seneca": "A witty and pragmatic Stoic who served as advisor to emperors. Known for his sharp insights and occasional irony in teaching life's hardest lessons.",
  "Marcus Aurelius": "The philosopher-emperor of Rome, whose private meditations reveal a deeply contemplative and duty-bound nature. Stern yet compassionate in his wisdom.",
  "Epictetus": "A former slave who became one of Stoicism's greatest teachers. Direct and practical in his approach, with a focus on personal responsibility."
} as const;

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showPhilosopherDialog, setShowPhilosopherDialog] = useState(false);
  const [philosopher, setPhilosopher] = useState<PhilosopherName>("Seneca");

  const handleGenerateWisdom = async (userInput?: string) => {
    setIsLoading(true);
    try {
      const generatedWisdom = await generateWisdom(philosopher, userInput);
      setWisdom(generatedWisdom);
      setShowWisdomDialog(true);
      setInput(""); // Clear the input field after generating wisdom
    } catch (error) {
      console.error('Error generating wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6 space-y-8">
          <div className="text-center space-y-4">
            <PhilosopherIllustration philosopher={philosopher} />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-semibold flex items-center justify-center gap-2">
              {philosopherData[philosopher].displayName} says...
            </h1>
          </div>

          <Card className="p-6 bg-background/80 backdrop-blur border">
            <Textarea 
              placeholder="Describe your situation (e.g., 'I'm procrastinating' or 'I'm stressed about work')" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="min-h-[100px] mb-4 font-sans" 
            />
            
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
            Get sarcastic Stoic wisdom for your modern problems
          </p>
        </div>
      </div>

      {/* FAB for philosopher selection */}
      <div className="fixed bottom-8 right-8">
        <Button 
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setShowPhilosopherDialog(true)}
        >
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Your Philosopher</DialogTitle>
            <DialogDescription>
              Select who will dispense wisdom to you
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {philosophers.map((name) => (
              <div key={name} className="space-y-2">
                <Button
                  variant={philosopher === name ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setPhilosopher(name);
                    setShowPhilosopherDialog(false);
                  }}
                  disabled={name !== "Seneca" && name !== "Marcus Aurelius"}
                >
                  {name}
                  {name === "Epictetus" && " (Coming soon)"}
                </Button>
                <p className="text-sm text-muted-foreground px-2">
                  {philosopherDescriptions[name]}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Wisdom Dialog */}
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

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>About Seneca Says</DialogTitle>
            <DialogDescription>
              Your personal Stoic advisor with a twist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Seneca Says is a modern take on ancient Stoic wisdom. It combines the timeless teachings of Stoicism with a dash of sarcasm to help you navigate life's challenges.
            </p>
            <p className="text-muted-foreground">
              Powered by AI, this tool channels the spirit of Seneca, the renowned Stoic philosopher, to provide witty and wisdom-filled responses to your modern-day problems.
            </p>
            <p className="text-muted-foreground">
              Whether you're procrastinating, stressed, or just need some philosophical perspective, Seneca is here to offer his ancient wisdom with a contemporary twist.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WisdomGenerator;
