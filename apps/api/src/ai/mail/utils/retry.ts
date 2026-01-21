const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const retryWithDelay = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> => {
  try {
    console.log(`we are firring upo `);
    const res = await fn();
    console.log(`we are firring had done with it  `);

    return res;
  } catch (error: any) {
    console.log(error);
    const isOverloadError =
      error?.status === "UNAVAILABLE" ||
      error?.message?.includes("overloaded") ||
      error?.code === 503;

    if (isOverloadError && retries > 0) {
      console.log(
        `Model overloaded, retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} attempts left)`,
      );
      await sleep(RETRY_DELAY_MS);
      return retryWithDelay(fn, retries - 1);
    }
    throw error;
  }
};
