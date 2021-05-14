export const getDayName = (date: string, format: 'long' | 'short') =>
  new Intl.DateTimeFormat('en-GB', { weekday: format }).format(new Date(date))
