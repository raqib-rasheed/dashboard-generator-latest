import { capitalize } from 'lodash'

export const chartDefaultOptions = (title: string) => ({
  zoom: {
    enabled: false,
  },
  dataLabels: {
    enabled: false,
  },
  toolbar: {
    show: false,
  },
  title: {
    text: capitalize(title),
  },
  width: '100%',
  height: '100%',
})
