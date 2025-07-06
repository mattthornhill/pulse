import React from 'react'
import { View, Svg, Path } from '@react-pdf/renderer'

interface PDFSparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showArea?: boolean
}

export const PDFSparkline: React.FC<PDFSparklineProps> = ({ 
  data, 
  width = 60, 
  height = 20, 
  color = '#3B82F6',
  showArea = true 
}) => {
  if (!data || data.length < 2) return null

  const padding = 2
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Normalize data
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Create points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * chartWidth + padding
    const y = height - ((value - min) / range) * chartHeight - padding
    return { x, y }
  })

  // Create path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = showArea 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`
    : ''

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {showArea && (
          <Path
            d={areaPath}
            fill={color}
            fillOpacity={0.2}
          />
        )}
        <Path
          d={linePath}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
        {/* Add dots for data points */}
        {points.map((point, i) => (
          <Path
            key={i}
            d={`M ${point.x - 1.5} ${point.y} a 1.5 1.5 0 1 0 3 0 a 1.5 1.5 0 1 0 -3 0`}
            fill={color}
          />
        ))}
      </Svg>
    </View>
  )
}