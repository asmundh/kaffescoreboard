
const getSecondsSinceDate = (date) => {
  const currentDate = new Date();
  const oldDate = new Date(date);
  const secondsSinceDate = (currentDate.getTime() - oldDate.getTime() / 1000);

  return secondsSinceDate;
};

export default getSecondsSinceDate;
