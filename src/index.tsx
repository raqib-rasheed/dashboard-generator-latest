import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
// import './public-path'
import './styles.scss'

const children = (
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
)

const container = document.getElementById('root')
createRoot(container as Element).render(children) // For React 18

// export const AppContext = createContext({ isMicrofrontend: false })
// interface RenderProps {
//   container?: Element
// }

// let root: Root

// function render(props: RenderProps) {
//   const { container } = props
//   root = createRoot(
//     (container
//       ? container.querySelector('#root')
//       : document.getElementById('root')) as Element
//   )
//   root.render(
//     <React.StrictMode>
//       <AppContext.Provider
//         value={{ isMicrofrontend: (window as any).__POWERED_BY_QIANKUN__ }}
//       >
//         <BrowserRouter
//           basename={(window as any).__POWERED_BY_QIANKUN__ ? '/dashboard' : '/'}
//         >
//           <App />
//         </BrowserRouter>
//       </AppContext.Provider>
//     </React.StrictMode>
//   )
// }

// if (!(window as any).__POWERED_BY_QIANKUN__) {
//   render({})
// }

// export async function bootstrap() {}

// export async function mount(props: RenderProps) {
//   render(props)
// }

// export async function unmount(props: RenderProps) {
//   if (root) {
//     root.unmount()
//   }
// }

// export async function update(props: RenderProps) {}

// if (process.env.REACT_AS_MICROFRONTEND) {
//   render({})
// }
