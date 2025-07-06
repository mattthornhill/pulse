import React from 'react'
import { Svg, Path, G, Circle, Text } from '@react-pdf/renderer'

interface ServicePointLogoProps {
  width?: number
  height?: number
  color?: string
}

export const ServicePointLogo: React.FC<ServicePointLogoProps> = ({ 
  width = 150, 
  height = 50,
  color = '#FFFFFF'
}) => {
  const scale = width / 150
  
  return (
    <Svg width={width} height={height} viewBox="0 0 150 50">
      <G transform={`scale(${scale})`}>
        {/* Icon part - a stylized location pin with wrench */}
        <Circle cx="15" cy="15" r="12" fill={color} fillOpacity={0.2} />
        <Path
          d="M15 8C11.69 8 9 10.69 9 14C9 18.5 15 26 15 26S21 18.5 21 14C21 10.69 18.31 8 15 8ZM15 16.5C13.62 16.5 12.5 15.38 12.5 14C12.5 12.62 13.62 11.5 15 11.5C16.38 11.5 17.5 12.62 17.5 14C17.5 15.38 16.38 16.5 15 16.5Z"
          fill={color}
        />
        
        {/* Text part */}
        <G transform="translate(35, 8)">
          {/* ServicePoint text */}
          <Path
            d="M0 2.5C0 1.12 1.05 0 2.5 0H4.5C5.88 0 7 1.12 7 2.5C7 3.33 6.58 4.08 5.9 4.5C6.58 4.92 7 5.67 7 6.5C7 7.88 5.88 9 4.5 9H2.5C1.12 9 0 7.88 0 6.5V2.5ZM2 2.5V3.5H4.5C4.78 3.5 5 3.28 5 3V2.5C5 2.22 4.78 2 4.5 2H2.5C2.22 2 2 2.22 2 2.5ZM2 5.5V6.5C2 6.78 2.22 7 2.5 7H4.5C4.78 7 5 6.78 5 6.5V6C5 5.72 4.78 5.5 4.5 5.5H2Z"
            fill={color}
            transform="translate(0, 0)"
          />
          
          {/* Simple text representation for ServicePoint Pro */}
          <Text
            x="0"
            y="14"
            style={{
              fill: color,
              fontSize: 14,
              fontFamily: 'Helvetica-Bold'
            }}
          >
            ServicePoint
          </Text>
          <Text
            x="85"
            y="14"
            style={{
              fill: color,
              fontSize: 12,
              fontFamily: 'Helvetica'
            }}
          >
            Pro
          </Text>
        </G>
      </G>
    </Svg>
  )
}