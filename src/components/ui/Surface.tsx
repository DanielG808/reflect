import { cn } from "@/src/lib/utils/cn";

type SurfaceProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  title?: string;
  titleClassName?: string;
};

export default function Surface({
  children,
  className,
  hover = false,
  title,
  titleClassName,
}: SurfaceProps) {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <h3
          className={cn(
            "text-lg font-medium text-accent/80 text-left",
            titleClassName,
          )}
        >
          {title}
        </h3>
      )}

      <div
        className={cn(
          `
          bg-white/15 backdrop-blur-sm
          border border-white/25
          rounded-md
          shadow-sm
          ${hover && "hover:bg-white/25 hover:border-white/35 duration-200 cursor-pointer"}
          `,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
