import { lazy } from 'react'

import { CreateConnection } from '~/refactored/features/connections'
import { CreateWidget } from '~/refactored/features/widgets'

const APP = {
  LANDING_PAGE: lazy(() => import('../dashboard/DashboardList')),
  UPSERT_DASHBOARD: lazy(() => import('../dashboard/UpsertDashboard')),
  PREVIEW_DASHBOARD: lazy(() => import('../dashboard/DashboardPreview')),
}

const routes = [
  {
    path: '/',
    element: <APP.LANDING_PAGE />,
    exact: true,
  },
  {
    path: '/upsert-dashboard',
    element: <APP.UPSERT_DASHBOARD />,
    exact: true,
  },
  {
    path: '/preview-dashboard/:id',
    element: <APP.PREVIEW_DASHBOARD />,
    exact: true,
  },
  {
    path: '/upsert-connection',
    element: <CreateConnection />,
    exact: true,
  },
  {
    path: '/upsert-widget',
    element: <CreateWidget />,
    exact: true,
  },
]

export default routes
