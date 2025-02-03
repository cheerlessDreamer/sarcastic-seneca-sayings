import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Quote } from "lucide-react";

const WisdomGenerator = () => {
  const [input, setInput] = useState("");
  const [wisdom, setWisdom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateWisdom = async (userInput?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are Seneca, the Stoic philosopher, but with a sarcastic and modern twist. Respond to user input with Stoic-inspired advice that is witty, humorous, and slightly irreverent. Keep responses under 100 words and make them memorable.",
            },
            {
              role: "user",
              content: userInput || "Give me a random piece of sarcastic stoic wisdom about life.",
            },
          ],
        }),
      });

      const data = await response.json();
      setWisdom(data.choices[0].message.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wisdom. Is your API key set?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(wisdom);
    toast({
      title: "Copied!",
      description: "Wisdom has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-sage-800 font-semibold">
            What Would Seneca Do?
          </h1>
          <p className="text-sage-600 text-lg">
            Modern problems require ancient solutions
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur">
          <Textarea
            placeholder="Describe your situation (e.g., 'I'm procrastinating' or 'I'm stressed about work')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] mb-4 font-sans"
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => generateWisdom(input)}
              className="flex-1 bg-sage-600 hover:bg-sage-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate Wisdom
            </Button>
            
            <Button
              onClick={() => generateWisdom()}
              variant="outline"
              className="flex-1 border-sage-200 hover:bg-sage-50"
              disabled={isLoading}
            >
              <Quote className="mr-2 h-4 w-4" />
              Random Quote
            </Button>
          </div>
        </Card>

        {wisdom && (
          <Card className="p-6 bg-white/80 backdrop-blur animate-fade-up">
            <div className="flex justify-between items-start gap-4">
              <p className="font-serif text-lg text-sage-800 italic">
                {wisdom}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WisdomGenerator;