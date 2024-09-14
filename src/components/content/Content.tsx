import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import contents from './routes'
import SkeletonForRoutes from './SkeletonForRoutes'

const PAGE_404 = lazy(() => import('./Page404'))
const ContentRoutes = () => {
  return (
    <Suspense fallback={<SkeletonForRoutes />}>
      <Routes>
        {contents.map((page) => {
          // eslint-disable-next-line react/jsx-props-no-spreading
          return <Route key={page.path} {...page} />
        })}
        <Route path="*" element={<PAGE_404 />} />
      </Routes>
    </Suspense>
  )
}

export default ContentRoutes
