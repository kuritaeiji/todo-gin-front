export const isRecordNotFoundError = (response) => {
  return response && response.status === 404 && response.data.content === 'record not found'
}

export const isPasswordAuthenticationError = (response) => {
  return response && response.status === 401 && response.data.content === 'password is not authenticated'
}
