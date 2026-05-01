import logo from "@/assets/axio-logo.png";
import { cn } from "@/lib/utils";

export const Logo = ({ className, withWordmark = true, dark = false }: { className?: string; withWordmark?: boolean; dark?: boolean }) => {
  if (withWordmark) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <img src={logo} alt="Axio Funded" className="h-10 w-10 object-contain" loading="eager" />
        <div className="leading-tight">
          <div className={cn("font-extrabold tracking-widest text-base", dark ? "text-white" : "text-foreground")}>AXIO</div>
          <div className="text-[10px] tracking-[0.3em] text-gold font-semibold">FUNDED</div>
        </div>
      </div>
    );
  }
  return <img src={logo} alt="Axio Funded" className={cn("object-contain", className)} />;
};
