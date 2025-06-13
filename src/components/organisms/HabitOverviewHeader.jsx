import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBarCircle from '@/components/molecules/ProgressBarCircle';

function HabitOverviewHeader({ todayDate, onAddHabitClick, habits, getHabitCompletion, getTodayCompletionRate }) {
  const completedTodayCount = habits.filter(h => getHabitCompletion(h.id)).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-surface-900 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HabitFlow
          </h1>
          <p className="text-surface-600 mt-1">
            {todayDate}
          </p>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddHabitClick}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4"
        >
          <div className="flex items-center space-x-4">
            <ProgressBarCircle progress={getTodayCompletionRate()} />
            <div>
              <h3 className="text-lg font-semibold text-surface-900">Today's Progress</h3>
              <p className="text-surface-600">
                {completedTodayCount} of {habits.length} habits completed
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default HabitOverviewHeader;