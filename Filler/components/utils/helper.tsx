import dayjs from 'dayjs'

export const accurateInterval =  (time) => {
    return time - (new Date().getTime());
};

export const timeFormatDay = (time) => {
  return time.toString().substring(0,10)
}

export const timeFormatMinutes = (time) => {
  return timeFormatDay(time) + " " + time.toString().substring(11, 16);
}

export const daysAgo = (time) => {
  const timeFormatted = timeFormatDay(time); 

  return dayjs(new Date()).isSame(timeFormatted, 'day') 
    ? "Today, " + timeFormatMinutes(time)
    : dayjs().diff(timeFormatted, 'day') + " days ago, " + timeFormatMinutes(time);
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
