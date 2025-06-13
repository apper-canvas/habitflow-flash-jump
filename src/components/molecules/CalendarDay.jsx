import { format, isToday } from 'date-fns';

function CalendarDay({ day, completionRate }) {
  return (
    <div
      className={`
        relative aspect-square flex items-center justify-center text-sm rounded-lg
        ${isToday(day) ? 'bg-primary text-white font-semibold' : ''}
        ${!isToday(day) && completionRate === 100 ? 'bg-accent text-white' : ''}
        ${!isToday(day) && completionRate > 0 && completionRate < 100 ? 'bg-secondary/30 text-surface-700' : ''}
        ${!isToday(day) && completionRate === 0 ? 'text-surface-400 hover:bg-surface-50' : ''}
      `}
    >
      {format(day, 'd')}
      {completionRate > 0 && !isToday(day) && (
        <div className="absolute w-1 h-1 bg-accent rounded-full mt-3"></div>
      )}
    </div>
  );
}

export default CalendarDay;