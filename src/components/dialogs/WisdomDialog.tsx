
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareButtons } from "../ShareDialog";
import { philosopherData } from "@/constants/philosophers";
import type { PhilosopherName } from "@/constants/philosophers";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/utils/wisdomUtils";
import { useState, useEffect } from "react";

interface WisdomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wisdom: string;
  reference: number | null;
  philosopher: PhilosopherName;
}

export const WisdomDialog = ({ open, onOpenChange, wisdom, reference, philosopher }: WisdomDialogProps) => {
  const [hasFeedback, setHasFeedback] = useState(false);

  // Reset feedback state when wisdom changes
  useEffect(() => {
    setHasFeedback(false);
  }, [wisdom]);

  const handleFeedback = async (isPositive: boolean) => {
    if (reference === null || hasFeedback) return;
    await submitFeedback(reference, isPositive);
    setHasFeedback(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{philosopherData[philosopher].displayName} says…</DialogTitle>
          {/* {reference && (
            <DialogDescription>
              Reference: #{reference}
            </DialogDescription>
          )} */}
        </DialogHeader>
        <div className="mt-4">
          <p className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
            {wisdom}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <ShareButtons wisdom={wisdom} />
            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFeedback(true)}
                disabled={hasFeedback}
                className={hasFeedback ? "opacity-50" : ""}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFeedback(false)}
                disabled={hasFeedback}
                className={hasFeedback ? "opacity-50" : ""}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
