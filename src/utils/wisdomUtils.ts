
import { toast } from "@/components/ui/use-toast";
import { PhilosopherName, philosopherData } from "@/constants/philosophers";

export const generateWisdom = async (philosopher: PhilosopherName, userInput?: string) => {
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
          content: philosopherData[philosopher].systemPrompt
        }, {
          role: "user",
          content: userInput || "Give me a random piece of wisdom about life."
        }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to generate wisdom. Is your API key set?",
      variant: "destructive"
    });
    throw error;
  }
};

export const shareText = (wisdom: string) => {
  return `${wisdom}\n\nGet ancient wisdom for modern problems at https://senecasays.club}`;
};
