import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import HabitCard from '@/components/molecules/HabitCard';

function HabitList({ habits, getHabitCompletion, getStreakCount, getCompletionRate, onToggleCompletion, onDeleteHabit, onAddHabit }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-surface-900">Today's Habits</h2>
      
      {habits.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-surface-50 rounded-xl border-2 border-dashed border-surface-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Target" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-surface-700 mb-2">Start Building Great Habits!</h3>
          <p className="text-surface-500 mb-4">Add your first habit to begin your journey of personal growth.</p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddHabit}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Create Your First Habit
          </Button>
        </motion.div>
      ) : (
        <motion.div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const isCompleted = getHabitCompletion(habit.id);
              const streak = getStreakCount(habit.id);
              const completionRate = getCompletionRate(habit.id);

              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isCompleted}
                  streak={streak}
                  completionRate={completionRate}
                  onToggleCompletion={onToggleCompletion}
                  onDelete={onDeleteHabit}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default HabitList;