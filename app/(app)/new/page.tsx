import EntryEditor from "@/src/components/entries/EntryEditor";
import MainContainer from "@/src/components/layout/MainContainer";
import Surface from "@/src/components/ui/Surface";

export default function NewEntryPage() {
  return (
    <MainContainer className="h-full flex flex-col min-h-0">
      <Surface
        title="New Entry:"
        containerClassName="w-full flex flex-col flex-1 min-h-0"
        className="w-full p-6 flex flex-col flex-1 min-h-0"
      >
        <EntryEditor />
      </Surface>
    </MainContainer>
  );
}
