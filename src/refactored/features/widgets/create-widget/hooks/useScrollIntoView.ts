import * as React from 'react'

export function useScrollIntoViewWhenRendered<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [])

  return ref
}
