import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import CalendarDay from '@/components/molecules/CalendarDay';

function MonthlyCalendar({ selectedDate, onMonthChange, habits, getHabitCompletion }) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMonthChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            className="p-1 hover:bg-surface-100 rounded"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMonthChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            className="p-1 hover:bg-surface-100 rounded"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-surface-500 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center p-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayString = format(day, 'yyyy-MM-dd');
          const completedHabits = habits.filter(h => getHabitCompletion(h.id, dayString)).length;
          const completionRate = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;
          
          return (
            <CalendarDay key={day.toISOString()} day={day} completionRate={completionRate} />
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyCalendar;