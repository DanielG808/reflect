import { cn } from "@/src/lib/utils/cn";

type SurfaceProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Surface({
  children,
  className,
  hover = false,
}: SurfaceProps) {
  return (
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
  );
}
