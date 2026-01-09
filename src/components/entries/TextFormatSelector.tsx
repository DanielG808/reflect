import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "../ui/Button";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";

const formatOpts = [BoldIcon, ItalicIcon, StrikethroughIcon];

export default function TextFormatSelector() {
  return (
    <ButtonGroup>
      {formatOpts.map((Icon, i) => (
        <Button
          key={i}
          size="sm"
          variant="ghost"
          className="border-input hover:border-input bg-white/40"
        >
          <Icon className="h-5" />
        </Button>
      ))}
    </ButtonGroup>
  );
}
