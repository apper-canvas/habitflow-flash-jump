import { motion } from 'framer-motion';

function ProgressSummary({ habits, getStreakCount, getCompletionRate }) {
  if (habits.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Progress Summary</h3>
      <div className="space-y-4">
        {habits.slice(0, 3).map(habit => {
          const streak = getStreakCount(habit.id);
          const completionRate = getCompletionRate(habit.id);
          
          return (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                ></div>
                <span className="font-medium text-surface-900">{habit.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-surface-900">{streak} days</div>
                <div className="text-xs text-surface-500">{completionRate}% rate</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ProgressSummary;