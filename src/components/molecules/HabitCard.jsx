import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function HabitCard({ habit, isCompleted, streak, completionRate, onToggleCompletion, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout 
      className={`
        bg-white rounded-xl border-2 p-4 transition-all duration-200
        ${isCompleted 
          ? 'border-accent bg-accent/5 shadow-sm' 
          : 'border-surface-200 hover:border-surface-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleCompletion(habit.id)}
            className="habit-checkbox"
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${isCompleted ? 'text-accent' : 'text-surface-900'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center space-x-4 mt-1 text-sm text-surface-500">
            <span className="flex items-center">
              <ApperIcon name="Flame" className="w-3 h-3 mr-1" />
              {streak} day streak
            </span>
            <span>{completionRate}% completion</span>
          </div>
        </div>

        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(habit.id)}
          className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default HabitCard;