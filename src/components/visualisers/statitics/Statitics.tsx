import { Empty, Statistic as AntdStatistic } from 'antd'
import * as React from 'react'

import { getStatsDataAndValidation } from '~/refactored/features/widgets/create-widget/utils'

import { ErrorElement } from '../ErrorElement'

interface iStatisticProps {
  title: string
  data: any[]
  prefix: string
  suffix: string
  style?: React.CSSProperties | undefined
  className?: string
  yField: string
  conf: any
  error: any
}
export default function Statistic({
  title,
  data,
  prefix,
  suffix,
  style,
  className,
  conf,
  error,
}: iStatisticProps) {
  const {
    yField,
    statData,
    isStatsVisualizationPossible,
    multipleFieldsExist,
  } = getStatsDataAndValidation({
    visualisationData: data,
  })

  return (
    <div
      className={className ? `${className} statsWidget` : 'statsWidget'}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : multipleFieldsExist ? (
        <Empty description="You are trying to visualize multiple rows in a statistics card, which is not possible. Try visualizing a single numeric field!" />
      ) : !isStatsVisualizationPossible ? (
        <Empty description="You are trying to visualize a field which is not numeric. Try visualizing a single numeric field!" />
      ) : (
        <AntdStatistic
          valueStyle={style ? style : {}}
          title={title}
          value={statData}
          prefix={yField ? conf?.[yField]?.prefix : prefix}
          suffix={yField ? conf?.[yField]?.suffix : suffix}
          precision={yField ? parseInt(conf?.[yField]?.decimal_places) : 0}
        />
      )}
    </div>
  )
}
