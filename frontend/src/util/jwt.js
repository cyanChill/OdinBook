// Return time in milliseconds for when token will expire
export const tokenExpireTime = (token) => {
  // Get milliseconds since unix epoch
  const expiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
  return expiry - new Date().getTime();
};
