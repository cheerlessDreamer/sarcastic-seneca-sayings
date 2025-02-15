
import { toast } from "@/components/ui/use-toast";
import { PhilosopherName, philosopherData } from "@/constants/philosophers";
import { supabase } from "@/integrations/supabase/client";

export const generateWisdom = async (philosopher: PhilosopherName, userInput?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-wisdom', {
      body: {
        philosopher,
        userInput,
        systemPrompt: philosopherData[philosopher].systemPrompt
      }
    });

    if (error) throw error;
    return { wisdom: data.wisdom, reference: data.reference };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to generate wisdom. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const shareText = (wisdom: string) => {
  return `${wisdom}\n\nGet ancient wisdom for modern problems at https://senecasays.club`;
};
