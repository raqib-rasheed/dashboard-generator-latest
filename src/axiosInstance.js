import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('csrftoken') // Replace 'csrftoken' with the correct cookie name
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  function (response) {
    if (
      response &&
      response.data &&
      typeof response.data === 'string' &&
      response.data.includes('html')
    ) {
      // eslint-disable-next-line no-undef
      window.location.replace('/accounts/login/')
    }
    return response
  },
  function (error) {
    if (error.response.request.status === 403) {
      // eslint-disable-next-line no-undef
      window.location.replace('/accounts/login/')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
