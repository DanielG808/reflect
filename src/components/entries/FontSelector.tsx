import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { fonts } from "@/src/lib/constants/fonts";

type FontSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <NativeSelect
      className="bg-white/40"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {fonts.map((font) => (
        <NativeSelectOption key={font.label} value={font.value}>
          {font.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
