
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>About Seneca Says</DialogTitle>
          <DialogDescription>
            Your personal philosophical advisor
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
        <p className="text-muted-foreground">
            Step into the realm of ancient philosophy, where timeless wisdom meets modern challenges. Be guided by some of history's greatest philosophical minds.
          </p>
          <p className="text-muted-foreground">
            Whether you seek the pragmatic counsel of Seneca, the contemplative insights of Marcus Aurelius, or the serene guidance of Epicurus, their eternal wisdom stands ready to illuminate your path.
          </p>
          <p className="text-muted-foreground">
            Share your thoughts, concerns, or dilemmas, and receive personalised wisdom that bridges millennia to address your contemporary challenges.
          </p>
          <p className="text-muted-foreground">
            Created by <a href="https://dannytaylor.io" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Danny</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
