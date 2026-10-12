import axios from './axios'

// Doquito: sin servidor externo. Solo se leen los archivos locales de /mocks (plantillas y presentación de ejemplo).
export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`)
  },
}
