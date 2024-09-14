import { Layout } from 'antd'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import ContentRoutes from './components/content/Content'
import HeaderComponent from './components/header/Header'
import { ErrorFallback } from './refactored/components/ErrorFallback'
import { queryClient } from './refactored/lib/react-query'

const { Content } = Layout

const App: React.FC = () => {
  const contentStyles = {
    // padding: '0px 44px 0px 44px',
    minHeight: 280,
  }
  // const appContext = useContext(AppContext)
  // if (appContext.isMicrofrontend) {
  //   return (
  //     <Layout style={{ margin: 0, background: '#F0F2F8' }}>
  //       <QueryClientProvider client={queryClient}>
  //         <HeaderComponent />
  //         <Content>
  //           <Routes>
  //             <Route
  //               path="/preview-dashboard/:id"
  //               element={<DashboardPreview />}
  //             ></Route>
  //           </Routes>
  //         </Content>
  //       </QueryClientProvider>
  //     </Layout>
  //   )
  // }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout style={{ margin: 0, background: '#F0F2F8' }}>
        <QueryClientProvider client={queryClient}>
          <HeaderComponent />
          <Content style={contentStyles}>
            <ContentRoutes />
          </Content>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
