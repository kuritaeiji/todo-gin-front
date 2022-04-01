export const recordNotFoundError = { status: 404, content: 'record not found' }
export const isRecordNotFoundError = (response) => {
  return response && response.status === recordNotFoundError.status && response.data.content === recordNotFoundError.content
}

export const passwordAuthenticationError = { status: 401, content: 'password is no authenticated' }
export const isPasswordAuthenticationError = (response) => {
  return response && response.status === passwordAuthenticationError.status && response.data.content === passwordAuthenticationError.content
}
