'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface MetabaseModalProps {
  isOpen: boolean
  onClose: () => void
  kpiId: string
  kpiName: string
}

// Map KPI IDs to Metabase question IDs
const metabaseQuestionMap: Record<string, string> = {
  'total_revenue': '1', // Replace with actual Metabase question IDs
  'total_service_visits': '2',
  'gross_profit_margin': '3',
  'average_ticket': '4',
  'total_cost': '5',
  'jobs_completed': '6',
  'call_to_booking_ratio': '7',
  'labor_cost_per_hour': '8',
  'revenue_per_tech_per_day': '9',
  'capacity_utilization': '10'
}

export function MetabaseModal({ isOpen, onClose, kpiId, kpiName }: MetabaseModalProps) {
  const metabaseUrl = process.env.NEXT_PUBLIC_METABASE_SITE_URL
  const questionId = metabaseQuestionMap[kpiId]
  
  if (!metabaseUrl || !questionId) {
    return null
  }
  
  // For public embeds
  const embedUrl = `${metabaseUrl}/public/question/${questionId}?bordered=false&titled=false`
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{kpiName} - Detailed View</DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative mt-4">
          <iframe
            src={embedUrl}
            frameBorder="0"
            allowTransparency
            className="absolute inset-0 w-full h-full rounded-lg"
            style={{ background: 'transparent' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}