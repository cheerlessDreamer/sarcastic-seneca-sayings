
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type PhilosopherName } from "@/constants/philosophers";
import { ArrowRight } from "lucide-react";

interface PhilosopherCardProps {
  name: PhilosopherName;
  description: string;
  imageSrc: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

export const PhilosopherCard = ({
  name,
  description,
  imageSrc,
  isSelected,
  isDisabled,
  onClick
}: PhilosopherCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all",
        isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="p-4">
        <div className="flex gap-4 items-start">
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-20 h-20 object-cover rounded-full bg-muted"
          />
          <div className="flex-1">
            <h3 className="font-medium text-lg">
              {name}
              {isDisabled && " (Coming soon)"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-primary font-medium">
              Learn more 
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
