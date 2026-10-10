export const handleErrors = (errorResponse, setErrors) => {
  const errorMessages = {};
  if (errorResponse && errorResponse.errors) {
    errorResponse.errors.forEach((error) => {
      errorMessages[error.path] = error.msg;
    });
  }
  setErrors(errorMessages);
};