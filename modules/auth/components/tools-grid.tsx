import { Button } from "@/components/ui/button";
import {
  LoaderPinwheel,
  Sparkles,
  Bot,
  Brain,
  Search,
  Cpu,
  LucideIcon,
} from "lucide-react";

export default function ToolsGrid() {

  const aiTools: { icon: LucideIcon; label: string; color?: string }[] = [
    { icon: LoaderPinwheel, label: "Open AI", color: "hover:bg-black/80" },
    { icon: Sparkles, label: "Gemini", color: "hover:bg-blue-600/30" },
    { icon: Bot, label: "Grok", color: "hover:bg-blue-500/30" },
    { icon: Brain, label: "Claude", color: "hover:bg-purple-600/30" },
    { icon: Search, label: "Perplexity", color: "hover:bg-green-600/30" },
    { icon: Cpu, label: "DeepSeek", color: "hover:bg-cyan-600/30" },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {aiTools.map((tool, index) => {
        const isLast = index === aiTools.length - 1;
        return (
          <Button
            key={tool.label}
            variant="outline"
            className={`
              rounded-full border-zinc-700 px-4! py-2! text-sm font-medium tracking-wide
              transition-all duration-200
              ${isLast 
                ? "bg-zinc-200 text-black hover:bg-zinc-300 border-zinc-300 hover:text-zinc-800" 
                : "bg-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-zinc-400"}
            `}
          >
            <tool.icon className="mr-1.5 h-4 w-4" />
            {tool.label}
          </Button>
        );
      })}
    </div>
  )
}
