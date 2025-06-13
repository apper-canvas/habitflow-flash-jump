import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { habitService, habitEntryService } from '@/services';

import HabitOverviewHeader from '@/components/organisms/HabitOverviewHeader';
import HabitList from '@/components/organisms/HabitList';
import MonthlyCalendar from '@/components/organisms/MonthlyCalendar';
import ProgressSummary from '@/components/organisms/ProgressSummary';
import AddHabitModal from '@/components/organisms/AddHabitModal';

function HabitTrackerOrganism() {
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
        <HabitOverviewHeader
          todayDate={format(today, 'EEEE, MMMM d, yyyy')}
          onAddHabitClick={() => setShowAddModal(true)}
          habits={habits}
          getHabitCompletion={getHabitCompletion}
          getTodayCompletionRate={getTodayCompletionRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HabitList
            habits={habits}
            getHabitCompletion={getHabitCompletion}
            getStreakCount={getStreakCount}
            getCompletionRate={getCompletionRate}
            onToggleCompletion={toggleHabitCompletion}
            onDeleteHabit={deleteHabit}
            onAddHabit={() => setShowAddModal(true)}
          />

          <div className="space-y-6">
            <MonthlyCalendar
              selectedDate={selectedDate}
              onMonthChange={setSelectedDate}
              habits={habits}
              getHabitCompletion={getHabitCompletion}
            />
            
            <ProgressSummary
              habits={habits}
              getStreakCount={getStreakCount}
              getCompletionRate={getCompletionRate}
            />
          </div>
        </div>
      </div>

      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newHabitName={newHabitName}
        onNewHabitNameChange={setNewHabitName}
        onAddHabit={addHabit}
      />
    </div>
  );
}

export default HabitTrackerOrganism;