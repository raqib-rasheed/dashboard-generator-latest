import { useNavigate, useSearchParams } from 'react-router-dom'

export function useNavigateBackToRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const redirectUrl = searchParams.get('redirectTo') ?? '/'

  const navigateBackToRedirect = () => {
    navigate(redirectUrl)
  }

  return navigateBackToRedirect
}
