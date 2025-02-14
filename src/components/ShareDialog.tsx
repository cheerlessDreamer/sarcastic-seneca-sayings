
import { Button } from "@/components/ui/button";
import { Copy, Share2, Twitter, Facebook, Send } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { shareText } from "@/utils/wisdomUtils";

interface ShareDialogProps {
  wisdom: string;
}

export const ShareButtons = ({ wisdom }: ShareDialogProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText(wisdom));
    toast({
      title: "Copied!",
      description: "Wisdom has been copied to clipboard"
    });
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText(wisdom));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText(wisdom))}&u=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(shareText(wisdom));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText(wisdom),
          title: "Stoic Wisdom"
        });
        toast({
          title: "Shared!",
          description: "Wisdom has been shared successfully"
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  return (
    <div className="flex gap-3">
      <Button onClick={copyToClipboard} className="flex-1">
        <Copy className="mr-2 h-4 w-4" />
        Copy to Clipboard
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer">
            <Send className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareViaNative} className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            More Options
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
