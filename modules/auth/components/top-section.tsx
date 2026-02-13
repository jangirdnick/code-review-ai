import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

export default function TopSection() {
  return (
    <div className="space-y-12">
      {/* Nav */}
      <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full border-zinc-600 bg-transparent px-6! gap-0.5 hover:bg-transparent hover:text-zinc-200 text-zinc-200"
            >
              Join <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              className="rounded-full bg-white px-6! gap-0.5 hover:bg-zinc-200 text-black font-medium"
            >
              Doc <ArrowUpRight className="h-4 w-4" />
            </Button>
      </div>

      {/* Hero */}
      <div className="space-y-6 max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100">
              Minutes mein code,
              <br />
              hours mein review – AI
            </h1>
            <p className="text-base md:text-lg text-zinc-400 max-w-xl">
              AI writes code in minutes, but thorough review often takes hours due to bugs and risks. True speed needs smarter reviews – AI.
            </p>
      </div>
    </div>
  )
}
