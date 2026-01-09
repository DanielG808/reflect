import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const fonts = [
  {
    label: "Sans Serif",
    value: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    label: "Times New Roman",
    value: '"Times New Roman", Times, serif',
  },
  {
    label: "Arial",
    value: "Arial, Helvetica, sans-serif",
  },
];

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
