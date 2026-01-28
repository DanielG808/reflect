import { cn } from "@/src/lib/utils/cn";

type MainContainerProps = {
  children: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
};

export default function MainContainer({
  children,
  className,
  fullBleed = false,
}: MainContainerProps) {
  return (
    <section
      className={cn(
        "mx-auto flex justify-center w-2/3 h-full min-h-0",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl p-6 h-full",
          fullBleed && "mx-0 max-w-none px-0 w-full",
          fullBleed && "flex flex-col min-h-0"
        )}
      >
        {children}
      </div>
    </section>
  );
}
