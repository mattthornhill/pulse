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
  'total_revenue': '89a814dc-f6c7-4f81-ab9f-9d314d104f37',
  'total_service_visits': 'd4d4d019-915b-4726-9658-ce759f8720bc',
  'gross_profit_margin': 'beecdfce-9625-4b5e-af85-fccf1090b185',
  'average_ticket': '7ffbbe44-10db-46c3-bac2-2b8a5069086f',
  'total_cost': 'b2b4de50-81fa-464e-898a-3c465aafa174',
  'jobs_completed': 'd92a02fb-c1a1-4cc7-ab64-3b942de1182a',
  'call_to_booking_ratio': '9feef139-e179-4976-a91b-7d7932789cf1',
  'labor_cost_per_hour': '97807d96-cc18-44b3-9a1a-a1d3f79501b7',
  'revenue_per_tech_per_day': 'c5fe23c8-df08-4e18-8ac9-756a92699883',
  'capacity_utilization': '7ae95692-546c-4fa6-aa1c-199390da359b'
}

export function MetabaseModal({ isOpen, onClose, kpiId, kpiName }: MetabaseModalProps) {
  const metabaseUrl = process.env.NEXT_PUBLIC_METABASE_SITE_URL || 'https://bilgy-deep.metabaseapp.com'
  const questionId = metabaseQuestionMap[kpiId]
  
  if (!questionId) {
    return null
  }
  
  // For public embeds - using the UUID format
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