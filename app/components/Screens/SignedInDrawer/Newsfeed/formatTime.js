const TODAY = new Date();
export const formatTime = (time)=> {
  if (time.toDateString() === TODAY.toDateString()) return "Hôm nay";
  return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
};