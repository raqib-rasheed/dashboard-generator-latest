import Axios from 'axios'
import Cookies from 'js-cookie'

export const axios = Axios.create({
  baseURL: '/api/v0.1',
})

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  function (response) {
    if (
      response &&
      response.data &&
      typeof response.data === 'string' &&
      response?.data?.includes('html')
    ) {
      window.location.replace('/accounts/login/')
    }
    return response.data
  },
  function (error) {
    if (error.response.request.status === 403) {
      window.location.replace('/accounts/login/')
    }
    return Promise.reject(error)
  }
)
