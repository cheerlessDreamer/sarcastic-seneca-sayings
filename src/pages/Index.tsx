import WisdomGenerator from "@/components/WisdomGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("OPENAI_API_KEY"));
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("OPENAI_API_KEY", apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "You can now generate Stoic wisdom!",
      });
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="font-serif text-3xl text-sage-800 font-semibold">
            Enter OpenAI API Key
          </h1>
          <p className="text-sage-600">
            To generate Stoic wisdom, please enter your OpenAI API key
          </p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={saveApiKey}
              className="w-full bg-sage-600 hover:bg-sage-700"
            >
              Save API Key
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <WisdomGenerator />;
};

export default Index;