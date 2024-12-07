import { Badge } from "@/components/ui/badge"
import { DeviceStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: DeviceStatus
  className?: string
}

const statusConfig = {
  available: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20',
    label: 'Available'
  },
  dispatched: {
    color: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20',
    label: 'Dispatched'
  },
  repair: {
    color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20',
    label: 'In Repair'
  },
  retired: {
    color: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-400/10 dark:text-slate-400 dark:border-slate-400/20',
    label: 'Retired'
  },
  missing: {
    color: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20',
    label: 'Missing'
  }
} as const

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium border rounded-full px-2.5 py-0.5',
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  )
} 