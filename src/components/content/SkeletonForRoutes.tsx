import { Skeleton } from 'antd'
import { useLocation } from 'react-router-dom'

import { DashboardPreviewLoader } from '../dashboard/DashboardPreview'

export default function SkeletonForRoutes() {
  const { pathname } = useLocation()
  const currentPath = pathname?.split('/')[1]
  const skeletons = [
    {
      path: '/',
      element: <Skeleton />,
    },
    {
      path: 'upsert-dashboard',
      element: <Skeleton />,
    },
    {
      path: 'preview-dashboard',
      element: <DashboardPreviewLoader />,
    },
    {
      path: 'upsert-connection',
      element: <Skeleton />,
    },
    {
      path: 'upsert-widget',
      element: <Skeleton />,
    },
  ]

  return (
    skeletons?.find((item) => item.path?.includes(currentPath))?.element ?? (
      <Skeleton />
    )
  )
}
