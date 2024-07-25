import dayjs from 'dayjs'

export const accurateInterval =  (time) => {
    return time - (new Date().getTime());
};

export const timeFormatDay = (time) => {
  return time.toString().substring(0,10)
}

export const daysAgo = (time) => {
  const timeFormatted = timeFormatDay(time); 
  console.log("unformatted: " + time)
  console.log("formatted time: " + timeFormatted)

  return dayjs(new Date()).isSame(time, 'day') 
    ? "Today, " + timeFormatted
    : dayjs().diff(time, 'day') + " days ago, " + timeFormatted;
} 

export const pointsToday = (time, points: number) => {
  const timeFormatted = timeFormatDay(time); 

  return dayjs(new Date()).isSame(timeFormatted, 'day') 
    ? points 
    : 0;
}

export const pointsThisWeek = (time, points: number) => {
  const timeFormatted = timeFormatDay(time); 

  return dayjs(new Date()).isSame(timeFormatted, 'week') 
    ? points 
    : 0;
}
