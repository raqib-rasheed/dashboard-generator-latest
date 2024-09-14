import { Spin } from 'antd'
import * as React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'

// import Table from '../widgets/table/Table'
import BarChart from '../visualisers/bar-charts/BarChart'
import ColumnChart from '../visualisers/column-chart/ColumnChart'
import DonutChart from '../visualisers/donut-chart/DonutChart'
import LineChart from '../visualisers/line-chart/LineChart'
import PieChart from '../visualisers/pie-chart/PieChart'
import RadialChart from '../visualisers/radial-chart/RadialChart'
import Statistic from '../visualisers/statitics/Statitics'
import ReactTable from '../visualisers/table/ReactTable'
// import { AppContext } from '../..'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

interface iLayout {
  x: number
  y: number
  w: number
  h: number
  i: string
  isBounded?: boolean
  isDraggable?: boolean
  isResizable?: boolean
  maxH?: number
  maxW?: number
  minH?: number
  minW?: number
  moved?: boolean
  resizeHandles?: () => void
  static?: boolean
}

interface iLayoutProps {
  onLayoutChange: (currentLayout: iLayout[]) => void
  dashboard: {
    question: any
    x?: number
    y?: number
    w?: number
    h?: number
    i: string
    minW?: number
    minH?: number
    style?: React.CSSProperties | undefined
    className?: string
    closeIcon?: Element
  }[]
  colorTheme?: string[]
}

export default function Dashboard(props: iLayoutProps) {
  // const appContext = React.useContext(AppContext)
  const layoutChangedRef = React.useRef(false)
  const DEFAULT_CARD_SIZE = 1
  const DEFAULT_GRID_SIZE = 1
  const componentMap = {
    statistics: Statistic,
    line_chart: LineChart,
    table: ReactTable,
    donut_chart: DonutChart,
    bar_chart: BarChart,
    radial_chart: RadialChart,
    column_chart: ColumnChart,
    pie_chart: PieChart,
  }

  return (
    <ResponsiveReactGridLayout
      // className={appContext.isMicrofrontend ? 'negativeMargin' : ''}
      measureBeforeMount={false}
      onLayoutChange={(e) => {
        layoutChangedRef.current = true
        layoutChangedRef.current && props.onLayoutChange(e as iLayout[])
      }}
      style={{
        minHeight: '100%',
        backgroundImage:
          'linear-gradient(to right, rgba(194,191,191,0.2) 1px, transparent 1px),linear-gradient(to bottom, rgba(194,191,191,0.2) 1px, transparent 1px)',
        backgroundSize: '13.8837px 10px',
      }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 }}
    >
      {props?.dashboard?.map((item: any, key: any) => {
        const Component = (componentMap as any)[(item.question as any).type]
        return (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #f0f0f0',
              padding: '16px 16px 20px',
              borderRadius: '3px',
            }}
            className="gridItemContainer"
            data-grid={{
              i: item?.i ?? key,
              x: item.x ? item.x : 0,
              y: item.y ? item.y : 0,
              w: item.w ? item.w : DEFAULT_CARD_SIZE,
              h: item.h ? item.h : DEFAULT_CARD_SIZE,
              minH: item.minH ? item.minH : DEFAULT_GRID_SIZE,
              minW: item.minW ? item.minW : DEFAULT_GRID_SIZE,
              isResizable: item?.isResizable,
              resizeHanldles: ['se'],
              static: item?.static,
            }}
            key={key}
          >
            {item?.question?.isLoading ? (
              <div className="spinContainer">
                <Spin />
              </div>
            ) : (
              <>
                {item?.closeIcon && item?.closeIcon}
                <Component
                  isDashboard={true}
                  error={item.question.error}
                  colorTheme={props?.colorTheme}
                  width="100%"
                  height="100%"
                  className={item.className}
                  style={item.style}
                  {...item.question}
                />
              </>
            )}
          </div>
        )
      })}
    </ResponsiveReactGridLayout>
  )
}
