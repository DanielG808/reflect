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
    <nav
      className="
        flex h-9 items-stretch gap-2
        [&_select]:h-full
        [&_button]:h-full
        [&_button]:py-0
        [&_button]:leading-none
        [&_svg]:h-4
        [&_svg]:w-4
        [&_svg]:shrink-0
      "
    >
      <FontSelector value={font} onChange={onFontChange} />
      <TextFormatSelector />
    </nav>
  );
}
