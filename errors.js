export const recordNotFoundError = { status: 404, content: 'record not found' }
export const isRecordNotFoundError = ({ response }) => {
  return response && response.status === recordNotFoundError.status && response.data.content === recordNotFoundError.content
}

export const passwordAuthenticationError = { status: 401, content: 'password is no authenticated' }
export const isPasswordAuthenticationError = ({ response }) => {
  return response && response.status === passwordAuthenticationError.status && response.data.content === passwordAuthenticationError.content
}

export const uniqueUserError = { status: 400, content: 'not unique user' }
export const isUniqueUserError = ({ response }) => {
  return response && response.status === uniqueUserError.status && response.data.content === uniqueUserError.content
}

export const validationError = { status: 400, content: 'validation error' }
export const isValidationError = ({ response }) => {
  return response && response.status === validationError.status && response.data.content === validationError.content
}

export const emailClientError = { status: 500, content: 'email client error' }
export const isEmailClientError = ({ response }) => {
  return response && response.status === emailClientError.status && response.data.content === emailClientError.content
}

export const jwtExpiredError = { status: 401, content: 'jwt expired error' }
export const isJwtExpiredError = ({ response }) => {
  return response && response.status === jwtExpiredError.status && response.data.content === jwtExpiredError.content
}

export const alreadyActivatedUserError = { status: 401, content: 'alreay activated user' }
export const isAlreadyActivatedUserError = ({ response }) => {
  return response && response.status === alreadyActivatedUserError.status && response.data.content === alreadyActivatedUserError.content
}
