// Separate constants are defined for easy access to know if the widget contains axis or value details or both, or if it doesn't contain any.
// This is helpful in type definitions when defining zod schema, see types/widget.ts file

export const VISUALISATION_WITH_NO_AXIS_OR_VALUE_DETAILS = [
  'table',
  'statistics',
] as const

export const VISUALISATION_WITH_AXIS_DETAILS = [
  'line_chart',
  'bar_chart',
] as const

export const VISUALISATION_WITH_VALUE_DETAILS = [
  'pie_chart',
  'donut_chart',
] as const

export const VISULISATION_WITH_AXIS_AND_VALUE_DETAILS = [
  ...VISUALISATION_WITH_AXIS_DETAILS,
  ...VISUALISATION_WITH_VALUE_DETAILS,
]

export const AVAILABLE_VIZ = [
  ...VISUALISATION_WITH_NO_AXIS_OR_VALUE_DETAILS,
  ...VISUALISATION_WITH_AXIS_DETAILS,
  ...VISUALISATION_WITH_VALUE_DETAILS,
  // "radial_chart",
  // "column_chart"
] as const
