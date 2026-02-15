export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.details && Array.isArray(error.response.data.details)) {
    return error.response.data.details.join(" ");
  }

  if (typeof error?.response?.data?.error === "string") {
    return error.response.data.error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return "Request failed.";
};
