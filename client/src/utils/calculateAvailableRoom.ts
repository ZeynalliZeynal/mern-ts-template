export const calculateAvailableRoom = (
  top: number,
  bottom: number,
): boolean => {
  const availableSpaceBelow = window.innerHeight - bottom;
  return availableSpaceBelow < 200 && top > availableSpaceBelow;
};
