'use client'

interface MetabaseEmbedProps {
  className?: string
}

export function MetabaseEmbed({ 
  className = ''
}: MetabaseEmbedProps) {
  const metabaseUrl = process.env.NEXT_PUBLIC_METABASE_SITE_URL
  const dashboardId = process.env.NEXT_PUBLIC_METABASE_DASHBOARD_ID
  
  if (!metabaseUrl || !dashboardId) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg h-96`}>
        <p className="text-gray-500 dark:text-gray-400">
          Metabase dashboard not configured. Add NEXT_PUBLIC_METABASE_SITE_URL and NEXT_PUBLIC_METABASE_DASHBOARD_ID to your .env.local file.
        </p>
      </div>
    )
  }
  
  // For public embeds with parameters to hide title and borders
  // Adding theme=transparent helps with blending
  const embedUrl = `${metabaseUrl}/public/dashboard/${dashboardId}?bordered=false&titled=false&theme=transparent`
  
  return (
    <div className={`${className} metabase-container flex-1`}>
      <iframe
        src={embedUrl}
        frameBorder="0"
        allowTransparency
        className="border-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}