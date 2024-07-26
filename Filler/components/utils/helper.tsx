import dayjs from 'dayjs'

export const accurateInterval =  (time) => {
    return time - (new Date().getTime());
};

export const timeFormatDay = (time) => {
  return time != ""
         ? time.toString().substring(0,10)
         : null
}

export const daysAgo = (time) => {
  const timeFormatted = timeFormatDay(time); 

  return timeFormatted != null
    ? dayjs(new Date()).isSame(time, 'day') 
    ? "Today, " + timeFormatted
    : dayjs().diff(time, 'day') + " days ago, " + timeFormatted
    : "Start recycling today!"
} 

export const pointsToday = (time, points: number) => {
  const timeFormatted = timeFormatDay(time); 

  return timeFormatted != null && dayjs(new Date()).isSame(timeFormatted, 'day') 
    ? points 
    : 0;
}

export const pointsThisWeek = (time, points: number) => {
  const timeFormatted = timeFormatDay(time); 

  return timeFormatted != null && dayjs(new Date()).isSame(timeFormatted, 'week') 
    ? points 
    : 0;
}
