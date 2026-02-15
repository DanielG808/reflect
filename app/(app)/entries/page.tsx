import EntriesList from "@/src/components/entries/journal/EntriesList";
import MainContainer from "@/src/components/layout/MainContainer";
import H1 from "@/src/components/ui/H1";

export default function EntriesPage() {
  return (
    <MainContainer
      fullBleed
      className="h-full flex flex-col min-h-0 overflow-hidden"
    >
      <H1 className="text-lg">My Journal:</H1>
      <EntriesList />
    </MainContainer>
  );
}
