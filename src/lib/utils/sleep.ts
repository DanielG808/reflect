export function sleep(seconds: number): Promise<void> {
  const ms = Math.max(0, Number(seconds) * 1000);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
