
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuggestionDialog = ({ open, onOpenChange }: SuggestionDialogProps) => {
  const [isSending, setIsSending] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    description: '',
    email: ''
  });

  const handleSubmit = async () => {
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
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={handleSubmit} 
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
  );
};
