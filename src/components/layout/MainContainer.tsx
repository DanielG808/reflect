import { cn } from "@/src/lib/utils/cn";

type MainContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MainContainer({
  children,
  className,
}: MainContainerProps) {
  return (
    <section className={cn("w-full h-full", className)}>
      <div className="mx-auto max-w-6xl px-6 h-full">{children}</div>
    </section>
  );
}
