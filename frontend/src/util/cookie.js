export const getCookie = (cookie) => {
  const nameEq = `${cookie}=`;
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    if (cookieArr[i].startsWith(nameEq)) return cookieArr[i].split("=")[1];
  }
  return null;
};
