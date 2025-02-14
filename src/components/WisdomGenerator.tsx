import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Quote, Share2, Twitter, Facebook, Send, Info, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Vivus from 'vivus';

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [philosopher, setPhilosopher] = useState("Seneca");
  const { toast } = useToast();

  useEffect(() => {
    new Vivus('my-svg', {
      duration: 400,
      animTimingFunction: Vivus.EASE,
      file: '/seneca.svg'
    }, () => {
      console.log('Animation completed');
    });
  }, []);

  const shareText = (wisdom: string) => {
    return `${wisdom}\n\nGet your own Stoic wisdom at ${window.location.origin}`;
  };
  const generateWisdom = async (userInput?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are Seneca, the Stoic philosopher, reimagined for the modern world. Your tone should reflect the wisdom and gravity of Stoic philosophy, but with a sharp and sarcastic wit. Avoid overly casual or contemporary phrasing. Instead, use timeless language that feels reflective and thoughtful, with a touch of irony when appropriate. Your responses should be concise (under 100 words), memorable, and rooted in Stoic principles. Your responses should feel like guidance despite being sarcastic."
          }, {
            role: "user",
            content: userInput || "Give me a random piece of sarcastic stoic wisdom about life."
          }]
        })
      });
      const data = await response.json();
      setWisdom(data.choices[0].message.content);
      setShowWisdomDialog(true);
      setInput(""); // Clear the input field after generating wisdom
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wisdom. Is your API key set?",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText(wisdom));
    toast({
      title: "Copied!",
      description: "Wisdom has been copied to clipboard"
    });
  };
  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText(wisdom));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText(wisdom))}&u=${url}`, '_blank');
  };
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(shareText(wisdom));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };
  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText(wisdom),
          title: "Stoic Wisdom"
        });
        toast({
          title: "Shared!",
          description: "Wisdom has been shared successfully"
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setShowShareDialog(true);
        }
      }
    } else {
      setShowShareDialog(true);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full p-6 space-y-8">
          <div className="text-center space-y-4">
            <div id="my-svg" className="mb-8"></div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-semibold flex items-center justify-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="font-serif text-4xl md:text-5xl text-foreground font-semibold px-4 py-2 h-auto flex items-center"
                  >
                    {philosopher}
                    <ChevronDown className="ml-2 h-[1.25em] w-[1.25em]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem onClick={() => setPhilosopher("Seneca")}>
                    Seneca
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Marcus Aurelius (Coming soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Epictetus (Coming soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              says...
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
              <Button onClick={() => generateWisdom(input)} className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Wisdom
              </Button>
              
              <Button onClick={() => generateWisdom()} variant="outline" className="flex-1" disabled={isLoading}>
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

      <footer className="p-4 flex justify-center">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" onClick={() => setShowAboutDialog(true)}>
          <Info className="h-6 w-6 text-muted-foreground" />
        </Button>
      </footer>

      <Dialog open={showWisdomDialog} onOpenChange={setShowWisdomDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seneca says…</DialogTitle>
            
          </DialogHeader>
          <div className="mt-4">
            <p className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
              {wisdom}
            </p>
            <div className="flex gap-3">
              <Button onClick={copyToClipboard} className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer">
                    <Send className="mr-2 h-4 w-4" />
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareViaNative} className="cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    More Options
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Wisdom</DialogTitle>
            <DialogDescription>
              Here's your piece of Stoic wisdom to share:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="font-serif text-xl text-foreground italic mb-4">{wisdom}</p>
            <Button onClick={copyToClipboard} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
