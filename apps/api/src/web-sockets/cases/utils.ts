// this function will help to make hte key type safe as currenlty we can passanything
const errorStringfier = (key: string, message: string) => {
  return JSON.stringify({
    key,
    data: {
      message,
    },
  });
};

export const socketErrors = {
  "no-wallet": errorStringfier("error:wallet", "No wallet detected"),
  "low-credits": errorStringfier(
    "error:low-credits",
    "You don't have enough credits to perform this action",
  ),
  "not-authorized": errorStringfier(
    "error:not-authorized",
    "You are not authorized to perform this action",
  ),
  "server-error": errorStringfier(
    "error:server-error",
    "An error had occurred to process your request",
  ),
} as const;
