
const nMinutesInMilis = (amountOfMinutes) => amountOfMinutes * 1000;

const timeSinceLastScanInSeconds = (lastScanTime) => {
  const currentTime = new Date();
  return (currentTime.getTime() - lastScanTime.getTime()) / 1000;
};

const isScanAttemptValid = lastScanTime => lastScanTime === null
 || (timeSinceLastScanInSeconds(lastScanTime) > nMinutesInMilis(-1));

export { isScanAttemptValid };
