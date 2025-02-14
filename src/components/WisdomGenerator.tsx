import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Quote, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const {
    toast
  } = useToast();
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
    await navigator.clipboard.writeText(wisdom);
    toast({
      title: "Copied!",
      description: "Wisdom has been copied to clipboard"
    });
  };
  const shareWisdom = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          text: wisdom,
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
  return <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground font-semibold">Seneca says...</h1>
          <p className="text-muted-foreground text-lg">
            Modern problems require ancient solutions
          </p>
        </div>

        <Card className="p-6 bg-background/80 backdrop-blur border">
          <Textarea placeholder="Describe your situation (e.g., 'I'm procrastinating' or 'I'm stressed about work')" value={input} onChange={e => setInput(e.target.value)} className="min-h-[100px] mb-4 font-sans" />
          
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

        <Dialog open={showWisdomDialog} onOpenChange={setShowWisdomDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Seneca Says...</DialogTitle>
              <DialogDescription>
                Here's your piece of Stoic wisdom:
              </DialogDescription>
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
                <Button onClick={shareWisdom} variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
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
      </div>
    </div>;
};
export default WisdomGenerator;