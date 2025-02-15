
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { PhilosopherCard } from "../PhilosopherCard";
import { philosophers, philosopherData, philosopherDescriptions, type PhilosopherName } from "@/constants/philosophers";

interface PhilosopherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhilosopher: PhilosopherName;
  onPhilosopherSelect: (name: PhilosopherName) => void;
  onSuggestClick: () => void;
}

export const PhilosopherDialog = ({ 
  open, 
  onOpenChange, 
  currentPhilosopher, 
  onPhilosopherSelect,
  onSuggestClick 
}: PhilosopherDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Choose Your Philosopher</DialogTitle>
          <DialogDescription>
            Select who will dispense wisdom to you
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {philosophers.map(name => (
            <PhilosopherCard 
              key={name} 
              name={name} 
              description={philosopherDescriptions[name]} 
              imageSrc={philosopherData[name].imageSrc} 
              isSelected={currentPhilosopher === name} 
              onClick={() => {
                onPhilosopherSelect(name);
                onOpenChange(false);
              }} 
            />
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground hover:text-primary flex items-center gap-2"
            onClick={onSuggestClick}
          >
            <SendHorizonal className="h-4 w-4" />
            Suggest a philosopher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
