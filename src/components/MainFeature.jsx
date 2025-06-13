import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import ApperIcon from './ApperIcon';
import { habitService, habitEntryService } from '../services';

function MainFeature() {
  const [habits, setHabits] = useState([]);
  const [habitEntries, setHabitEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, entriesData] = await Promise.all([
        habitService.getAll(),
        habitEntryService.getAll()
      ]);
      setHabits(habitsData);
      setHabitEntries(entriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    try {
      const colors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
      const newHabit = {
        name: newHabitName.trim(),
        color: colors[habits.length % colors.length],
        createdAt: Date.now()
      };

      const savedHabit = await habitService.create(newHabit);
      setHabits([...habits, savedHabit]);
      setNewHabitName('');
      setShowAddModal(false);
      toast.success('Habit added successfully!');
    } catch (err) {
      toast.error('Failed to add habit');
    }
  };

  const deleteHabit = async (habitId) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      await habitService.delete(habitId);
      setHabits(habits.filter(h => h.id !== habitId));
      setHabitEntries(habitEntries.filter(e => e.habitId !== habitId));
      toast.success('Habit deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  };

  const toggleHabitCompletion = async (habitId) => {
    const existingEntry = habitEntries.find(
      e => e.habitId === habitId && e.date === todayString
    );

    try {
      if (existingEntry) {
        if (existingEntry.completed) {
          // Mark as incomplete
          const updatedEntry = { ...existingEntry, completed: false, completedAt: null };
          await habitEntryService.update(existingEntry.id, updatedEntry);
          setHabitEntries(habitEntries.map(e => 
            e.id === existingEntry.id ? updatedEntry : e
          ));
        } else {
          // Mark as complete
          const updatedEntry = { ...existingEntry, completed: true, completedAt: Date.now() };
          await habitEntryService.update(existingEntry.id, updatedEntry);
          setHabitEntries(habitEntries.map(e => 
            e.id === existingEntry.id ? updatedEntry : e
          ));
          toast.success('Great job! Keep it up! 🎉');
        }
      } else {
        // Create new completed entry
        const newEntry = {
          habitId,
          date: todayString,
          completed: true,
          completedAt: Date.now()
        };
        const savedEntry = await habitEntryService.create(newEntry);
        setHabitEntries([...habitEntries, savedEntry]);
        toast.success('Great job! Keep it up! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update habit');
    }
  };

  const getHabitCompletion = (habitId, date = todayString) => {
    const entry = habitEntries.find(
      e => e.habitId === habitId && e.date === date
    );
    return entry?.completed || false;
  };

  const getStreakCount = (habitId) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (currentDate >= new Date(habits.find(h => h.id === habitId)?.createdAt || today)) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      const isCompleted = getHabitCompletion(habitId, dateString);
      
      if (isCompleted) {
        streak++;
      } else if (dateString !== todayString) {
        // Only break streak for past days, not today
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getCompletionRate = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const createdDate = new Date(habit.createdAt);
    const daysSinceCreated = Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
    const completedEntries = habitEntries.filter(
      e => e.habitId === habitId && e.completed
    ).length;

    return Math.round((completedEntries / daysSinceCreated) * 100);
  };

  const getTodayCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(h => getHabitCompletion(h.id)).length;
    return Math.round((completedToday / habits.length) * 100);
  };

  const renderCalendar = () => {
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
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="p-1 hover:bg-surface-100 rounded"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
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
              <div
                key={day.toISOString()}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg
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
          })}
        </div>
      </div>
    );
  };

  if (loading && habits.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-surface-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-80 bg-surface-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
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
                {format(today, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Habit
            </motion.button>
          </div>

          {/* Today's Progress */}
          {habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 progress-ring">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#10B981"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 - (175.9 * getTodayCompletionRate()) / 100}
                      initial={{ strokeDashoffset: 175.9 }}
                      animate={{ strokeDashoffset: 175.9 - (175.9 * getTodayCompletionRate()) / 100 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-surface-900">
                      {getTodayCompletionRate()}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Today's Progress</h3>
                  <p className="text-surface-600">
                    {habits.filter(h => getHabitCompletion(h.id)).length} of {habits.length} habits completed
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Habits */}
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Create Your First Habit
                </motion.button>
              </motion.div>
            ) : (
              <motion.div className="space-y-3">
                <AnimatePresence>
                  {habits.map((habit, index) => {
                    const isCompleted = getHabitCompletion(habit.id);
                    const streak = getStreakCount(habit.id);
                    const completionRate = getCompletionRate(habit.id);

                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
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
                              onChange={() => toggleHabitCompletion(habit.id)}
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

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteHabit(habit.id)}
                            className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Calendar and Progress */}
          <div className="space-y-6">
            {renderCalendar()}
            
            {habits.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900">Add New Habit</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="e.g., Drink 8 glasses of water"
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addHabit}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Add Habit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;