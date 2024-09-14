import Icon, {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import React from 'react'

import { ReactComponent as MetricsIcon } from '../../../icons/common/metrics.svg'
interface IWidgetIconProps {
  type: 'bar_chart' | 'line_chart' | 'donut_chart' | 'table' | 'statistics'
  size?: number
}

const iconForWidgets = {
  line_chart: LineChartOutlined,
  table: TableOutlined,
  donut_chart: PieChartOutlined,
  bar_chart: BarChartOutlined,
  radial_chart: PieChartOutlined,
  column_chart: ProjectOutlined,
  pie_chart: PieChartOutlined,
}

export default function WidgetIcon(props: IWidgetIconProps) {
  if (props.type === 'statistics') {
    return <Icon component={MetricsIcon} />
  }
  const CustomIcon = iconForWidgets[props?.type]
  return <CustomIcon size={30} />
}
