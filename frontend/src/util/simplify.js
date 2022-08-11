import millify from "millify";

export const simplifyNum = (num) => {
  return millify(num, {
    lowercase: true,
    units: ["", "k", "mil", "bil", "tril"],
  });
};
