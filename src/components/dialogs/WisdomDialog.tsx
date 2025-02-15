
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareButtons } from "../ShareDialog";
import { philosopherData } from "@/constants/philosophers";
import type { PhilosopherName } from "@/constants/philosophers";

interface WisdomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wisdom: string;
  reference: number | null;
  philosopher: PhilosopherName;
}

export const WisdomDialog = ({ open, onOpenChange, wisdom, reference, philosopher }: WisdomDialogProps) => {
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
          <ShareButtons wisdom={wisdom} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
