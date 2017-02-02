module.exports = {
  SESSION_TOKEN_KEY: 'token',
  backend: {
    hapiRemote: false,
    hapiLocal: true
  },
  HAPI: {
    local: {
      url: 'http://169.254.223.10/api/'
    },
    remote: {
      url: 'https://medicalweb.azurewebsites.net/api'
    }
  }
}
