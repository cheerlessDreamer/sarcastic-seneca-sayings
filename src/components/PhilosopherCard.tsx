
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

const wikipediaLinks = {
  "Seneca": "https://en.wikipedia.org/wiki/Seneca_the_Younger",
  "Marcus Aurelius": "https://en.wikipedia.org/wiki/Marcus_Aurelius",
  "Epicurus": "https://en.wikipedia.org/wiki/Epicurus"
} as const;

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
            <a 
              href={wikipediaLinks[name]} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 mt-2 text-sm text-primary font-medium hover:underline"
            >
              Learn more 
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
