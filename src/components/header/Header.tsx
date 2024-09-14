import { Layout } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { useWidgetStore } from '~/refactored/stores/create-widget'
const { Header } = Layout

export default function HeaderComponent() {
  const { pathname } = useLocation()
  const resetVisualisationStore = useWidgetStore('resetVisualisationStore')

  return !pathname?.includes('/preview-dashboard') ? (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0 1rem',
        width: '100%',
        marginBottom: '40px',
      }}
    >
      <Link
        to="/"
        onClick={() => {
          const leavingCreateWidgetPage = pathname.includes('/upsert-widget')
          if (leavingCreateWidgetPage) {
            resetVisualisationStore()
          }
        }}
      >
        <div
          style={{
            float: 'left',
            width: 200,
            color: '#fff',
          }}
        >
          Dashboard generator
        </div>
      </Link>
    </Header>
  ) : (
    <></>
  )
}
