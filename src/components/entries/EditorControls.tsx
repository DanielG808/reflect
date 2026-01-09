import FontSelector from "./FontSelector";

type EditorControlsProps = {
  font: string;
  onFontChange: (font: string) => void;
};

export default function EditorControls({
  font,
  onFontChange,
}: EditorControlsProps) {
  return (
    <nav>
      <FontSelector value={font} onChange={onFontChange} />
    </nav>
  );
}
