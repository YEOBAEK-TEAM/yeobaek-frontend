export const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

// 응답이 빨라도 연출이 끊기지 않게 최소 시간을 채운 뒤 결과 반환
export const withMinimumDelay = async <T>(promise: Promise<T>, minimumMs: number) => {
  const [result] = await Promise.all([promise, wait(minimumMs)]);

  return result;
};
