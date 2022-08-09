import { format, formatDistance } from "date-fns";

export const correctPostDate = (date) => {
  return new Date(date) < Date.now() - 1000 * 60 * 60 * 24
    ? format(new Date(date), "PP '('pp')'")
    : formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      });
};
