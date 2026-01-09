import FontSelector from "./FontSelector";
import TextFormatSelector from "./TextFormatSelector";

type EditorControlsProps = {
  font: string;
  onFontChange: (font: string) => void;
};

export default function EditorControls({
  font,
  onFontChange,
}: EditorControlsProps) {
  return (
    <nav className="flex items-center space-x-2">
      <FontSelector value={font} onChange={onFontChange} />
      <TextFormatSelector />
    </nav>
  );
}
