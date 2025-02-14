
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhilosopherName } from "@/constants/philosophers";

interface PhilosopherCardProps {
  name: PhilosopherName;
  description: string;
  imageSrc: string;
  isSelected: boolean;
  isDisabled: boolean;
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
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`w-full p-4 h-auto flex flex-col sm:flex-row items-start gap-4 ${isDisabled ? 'opacity-50' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <img 
        src={imageSrc} 
        alt={name} 
        className="w-16 h-16 object-cover rounded-full"
      />
      <div className="flex flex-col items-start text-left">
        <h3 className="font-medium text-lg">
          {name}
          {isDisabled && " (Coming soon)"}
        </h3>
        <p className={`text-sm mt-1 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
          {description}
        </p>
      </div>
    </Button>
  );
};
