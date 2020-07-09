

const timeSinceLastScanInSeconds = (lastScanTime) => {
  const currentTime = new Date();
  return (currentTime.getTime() - lastScanTime.getTime()) / 1000;
};

const isScanAttemptValid = lastScanTime => lastScanTime === null
 || (timeSinceLastScanInSeconds(lastScanTime) > 7); //* 60);

export { isScanAttemptValid, timeSinceLastScanInSeconds };
