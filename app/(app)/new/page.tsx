import EntryEditor from "@/src/components/entries/EntryEditor";
import MainContainer from "@/src/components/layout/MainContainer";
import Surface from "@/src/components/ui/Surface";

export default function NewEntryPage() {
  return (
    <MainContainer
      fullBleed
      className="h-full flex flex-col min-h-0 overflow-hidden"
    >
      <Surface
        title="New Entry:"
        containerClassName="w-full flex flex-col flex-1 min-h-0 overflow-hidden"
        className="w-full px-6 py-4 flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <EntryEditor />
      </Surface>
    </MainContainer>
  );
}
