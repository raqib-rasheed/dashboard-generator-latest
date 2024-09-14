import { SnakeCasedPropertiesDeep } from 'type-fest'
import { z } from 'zod'

import { formatDate } from '~/refactored/utils/formatDate'

import {
  VISUALISATION_WITH_NO_AXIS_OR_VALUE_DETAILS,
  VISUALISATION_WITH_AXIS_DETAILS,
  VISUALISATION_WITH_VALUE_DETAILS,
  AVAILABLE_VIZ,
} from '../const'

import { ConfForFrontendUse } from './conf'

const WidgetTextFilter = z.object({
  variableName: z.string(),
  fieldToBeMapped: z.string(),
  type: z.literal('text'),
  defaultValue: z.string().min(1),
})
const WidgetDateFilter = z.object({
  ...WidgetTextFilter.shape,
  type: z.literal('date'),
  defaultValue: z.date().transform((val) => formatDate(val)),
})
const WidgetDateRangeFilter = z.object({
  ...WidgetTextFilter.shape,
  type: z.literal('date_range'),
  defaultValue: z
    .tuple([z.date(), z.date()])
    .transform((val) => val.map((date) => formatDate(date)).join('_')),
})
const WidgetRangeFilter = z.object({
  ...WidgetTextFilter.shape,
  type: z.literal('range'),
  defaultValue: z
    .tuple([z.number(), z.number()])
    .refine((value) => value[0] < value[1], {
      message: 'Lower value should not be greater than the higher value',
      path: ['defaultValue'],
    })
    .transform((val) => val.join('_')),
})

const WidgetFilter = z.discriminatedUnion('type', [
  WidgetTextFilter,
  WidgetDateFilter,
  WidgetDateRangeFilter,
  WidgetRangeFilter,
])
export type WidgetFilter = z.infer<typeof WidgetFilter>
export type WidgetFilterType = Widget['widgetFilters'][number]['type']

const WidgetWithNoAxisOrValueDetailsSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  connection: z.number(),
  visualisationType: z.enum(VISUALISATION_WITH_NO_AXIS_OR_VALUE_DETAILS),
  sql: z.string().min(1),
  widgetFilters: z.array(WidgetFilter),
})

const WidgetWithAxisDetailsSchema = z.object({
  ...WidgetWithNoAxisOrValueDetailsSchema.shape,
  visualisationType: z.enum(VISUALISATION_WITH_AXIS_DETAILS),
  xAxis: z.string().min(1),
  yAxis: z.array(z.string()).min(1),
})

const WidgetWithValueDetailsSchema = z.object({
  ...WidgetWithAxisDetailsSchema.shape,
  visualisationType: z.enum(VISUALISATION_WITH_VALUE_DETAILS),
  yAxis: z.string().min(1),
})

export const WidgetSchema = z.discriminatedUnion('visualisationType', [
  WidgetWithNoAxisOrValueDetailsSchema,
  WidgetWithAxisDetailsSchema,
  WidgetWithValueDetailsSchema,
])

export type Widget = z.infer<typeof WidgetSchema>

export type VisualisationType = (typeof AVAILABLE_VIZ)[number]
export type Conf = Record<
  string,
  string | string[] | ConfForFrontendUse | undefined // undefined is to be used here, because x_axis and y_axis can be undefined for some visualisations
>

export type BackendWidget = SnakeCasedPropertiesDeep<Widget> & {
  conf: Conf
}

export type ConfWithAxis = {
  conf: ConfForFrontendUse
  x_axis: string
  y_axis: string | string[]
}
