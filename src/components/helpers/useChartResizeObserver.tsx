import { useState, useRef, MutableRefObject, useEffect } from 'react'

interface ChartDimensions {
  width: string
  height: string
}

interface UseChartResizeObserverOptions {
  defaultWidth: string | number
  defaultHeight: string | number
  titleRef: MutableRefObject<HTMLHeadingElement | null>
  isDashboard?: boolean
}

const useChartResizeObserver = ({
  defaultWidth,
  defaultHeight,
  titleRef,
  isDashboard = false,
}: UseChartResizeObserverOptions) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [chartDimensions, setChartDimensions] = useState<ChartDimensions>({
    width:
      typeof defaultWidth === 'number' ? `${defaultWidth}px` : defaultWidth,
    height:
      typeof defaultHeight === 'number' ? `${defaultHeight}px` : defaultHeight,
  })

  useEffect(() => {
    if (!isDashboard || !containerRef.current || !titleRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const containerWidth = entry.contentRect.width
          const containerHeight = entry.contentRect.height
          const titleHeight = titleRef.current?.offsetHeight || 0
          const updatedHeight = containerHeight - titleHeight

          setChartDimensions({
            width: `${containerWidth}px`,
            height: `${updatedHeight}px`,
          })
        }
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [isDashboard, titleRef])

  return { containerRef, chartDimensions }
}

export default useChartResizeObserver
