import { VISULISATION_WITH_AXIS_AND_VALUE_DETAILS } from '../const'
import { VisualisationType } from '../types'

export function doesWidgetContainAxisValueDetails(
  visualisation: VisualisationType
): visualisation is (typeof VISULISATION_WITH_AXIS_AND_VALUE_DETAILS)[number] {
  return VISULISATION_WITH_AXIS_AND_VALUE_DETAILS.includes(visualisation)
}
