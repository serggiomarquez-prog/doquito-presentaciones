import axios from 'axios'
import message from '@/utils/message'

const instance = axios.create({ timeout: 1000 * 300 })

instance.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 400) {
      return Promise.resolve(response.data)
    }

    message.error('Error desconocido.')
    return Promise.reject(response)
  },
  error => {
    if (error && error.response) {
      if (error.response.status >= 400 && error.response.status < 500) {
        return Promise.reject(error.message)
      }
      else if (error.response.status >= 500) {
        return Promise.reject(error.message)
      }
      
      message.error('Error desconocido del servidor.')
      return Promise.reject(error.message)
    }

    message.error('No se pudo conectar o el servidor tardó demasiado.')
    return Promise.reject(error)
  }
)

export default instance