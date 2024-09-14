import { useLocation } from 'react-router-dom'
/**
 * Use this hook to generate redirectTo param, whenever redirection to same page is required
 * Return value should be used in search params, for useNavigateBackToRedirect hook to work properly
 * @returns redirectTo string to be used in search params
 */
export function useGenerateRedirectParam() {
  const location = useLocation()
  const redirectTo = `redirectTo=${location.pathname}${location.search}`
  return redirectTo
}
