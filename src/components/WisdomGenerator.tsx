
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Quote, Info, ArrowRight, SendHorizonal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PhilosopherIllustration } from "./PhilosopherIllustration";
import { ShareButtons } from "./ShareDialog";
import { generateWisdom } from "@/utils/wisdomUtils";
import { philosophers, philosopherData, philosopherDescriptions, type PhilosopherName } from "@/constants/philosophers";
import { PhilosopherCard } from "./PhilosopherCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AOS from 'aos';
import 'aos/dist/aos.css';

const placeholderQuestions = ["What vexes thy spirit?", "What counsel dost thou seek?", "What burden weighs upon thy thoughts?", "What wisdom dost thou seek?", "What matter requires contemplation?"];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderQuestions.length);
  return placeholderQuestions[randomIndex];
};

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
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [philosopher, setPhilosopher] = useState<PhilosopherName>("Seneca");
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());
  const [isSending, setIsSending] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    description: '',
    email: ''
  });

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
      const generatedWisdom = await generateWisdom(philosopher, userInput);
      const newReference = generateReference();
      
      // Save to Supabase
      const { error } = await supabase
        .from('seneca-says')
        .insert({
          philosopher: philosopher,
          philosopher_instructions: philosopherData[philosopher].systemPrompt,
          response: generatedWisdom,
          reference: newReference,
          request: userInput
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

  const handleSuggestPhilosopher = () => {
    setShowSuggestionDialog(true);
    setShowPhilosopherDialog(false);
  };

  const handleSubmitSuggestion = async () => {
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('seneca-says_philosopher_suggestions')
        .insert({
          name: suggestionForm.name,
          description: suggestionForm.description,
          submitter_email: suggestionForm.email || null
        });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your philosopher suggestion has been submitted.",
      });
      setShowSuggestionDialog(false);
      setSuggestionForm({ name: '', description: '', email: '' });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return <div className="min-h-screen flex flex-col">
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

      {/* FAB for philosopher selection - now sticky in top right */}
      <div className="absolute top-8 right-8" data-aos="fade-left" data-aos-offset="10" data-aos-delay="600">
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
      </div>

      <footer className="p-4 flex justify-center gap-4" data-aos="fade-up" data-aos-offset="10" data-aos-delay="800">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" onClick={() => setShowAboutDialog(true)}>
          <Info className="h-6 w-6 text-primary" />
        </Button>
        <ThemeToggle />
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
          <DialogFooter className="mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-muted-foreground hover:text-primary flex items-center gap-2"
              onClick={handleSuggestPhilosopher}
            >
              <SendHorizonal className="h-4 w-4" />
              Suggest a philosopher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggestion Dialog */}
      <Dialog open={showSuggestionDialog} onOpenChange={setShowSuggestionDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Suggest a Philosopher</DialogTitle>
            <DialogDescription>
              Help us expand our philosophical horizons
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Philosopher Name</Label>
              <Input
                id="name"
                value={suggestionForm.name}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Plato"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                value={suggestionForm.description}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about this philosopher and their teachings..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Your Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={suggestionForm.email}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="To receive updates about your suggestion"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmitSuggestion} 
              disabled={!suggestionForm.name || !suggestionForm.description || isSending}
            >
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 h-4 w-4" />
              )}
              Submit Suggestion
            </Button>
          </DialogFooter>
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
