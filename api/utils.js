

export const timeSinceLastScanInSeconds = (lastScanTime) => {
  const currentTime = new Date();
  return (currentTime.getTime() - lastScanTime.getTime()) / 1000;
};
