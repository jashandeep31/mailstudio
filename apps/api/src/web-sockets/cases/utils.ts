export const socketErrors = {
  "no-wallet": JSON.stringify({
    key: "error:wallet",
    data: {
      message: "No wallet detected",
    },
  }),
  "error:low-credits": JSON.stringify({
    key: "error:low-credits",
    data: {
      message: "You don't have enough credits to perform this action",
    },
  }),
} as const;
