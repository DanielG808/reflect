import EntryEditor from "@/src/components/entries/EntryEditor";
import MainContainer from "@/src/components/layout/MainContainer";
import Surface from "@/src/components/ui/Surface";

export default function NewEntryPage() {
  return (
    <MainContainer>
      <Surface
        title="New Entry:"
        containerClassName="w-full"
        className="w-full p-6"
      >
        <EntryEditor />
      </Surface>
    </MainContainer>
  );
}
