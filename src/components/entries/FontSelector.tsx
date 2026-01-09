import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const fonts = ["sans serif", "times new Roman", "Arial"];

export default function FontSelector() {
  return (
    <NativeSelect className="bg-white/40">
      {fonts.map((font) => (
        <NativeSelectOption key={font} value={font}>
          {font}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
