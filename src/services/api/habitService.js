const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'habitflow_habits';

const getStoredHabits = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredHabits = (habits) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const habitService = {
  async getAll() {
    await delay(200);
    return [...getStoredHabits()];
  },

  async getById(id) {
    await delay(200);
    const habits = getStoredHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) throw new Error('Habit not found');
    return { ...habit };
  },

  async create(habitData) {
    await delay(300);
    const habits = getStoredHabits();
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: Date.now()
    };
    const updatedHabits = [...habits, newHabit];
    setStoredHabits(updatedHabits);
    return { ...newHabit };
  },

  async update(id, habitData) {
    await delay(300);
    const habits = getStoredHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index === -1) throw new Error('Habit not found');
    
    const updatedHabit = { ...habits[index], ...habitData };
    habits[index] = updatedHabit;
    setStoredHabits(habits);
    return { ...updatedHabit };
  },

  async delete(id) {
    await delay(300);
    const habits = getStoredHabits();
    const filteredHabits = habits.filter(h => h.id !== id);
    setStoredHabits(filteredHabits);
    return { success: true };
  }
};