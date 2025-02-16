
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

export const submitFeedback = async (reference: number, isPositive: boolean) => {
  try {
    // Query by id instead of reference
    const { data: wisdomData, error: fetchError } = await supabase
      .from('seneca-says')
      .select('id')
      .eq('reference', reference)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('seneca-says')
      .update({ feedback: isPositive ? 1 : 0 })
      .eq('id', wisdomData.id);

    if (updateError) throw updateError;

    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded.",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to submit feedback. Please try again.",
      variant: "destructive"
    });
    console.error('Error submitting feedback:', error);
  }
};

export const shareText = (wisdom: string) => {
  return `${wisdom}\n\nGet ancient wisdom for modern problems at https://senecasays.club`;
};
