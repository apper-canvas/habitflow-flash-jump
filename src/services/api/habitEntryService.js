const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'habitflow_entries';

const getStoredEntries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const habitEntryService = {
  async getAll() {
    await delay(200);
    return [...getStoredEntries()];
  },

  async getById(id) {
    await delay(200);
    const entries = getStoredEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) throw new Error('Entry not found');
    return { ...entry };
  },

  async getByHabitId(habitId) {
    await delay(200);
    const entries = getStoredEntries();
    return entries.filter(e => e.habitId === habitId).map(e => ({ ...e }));
  },

  async create(entryData) {
    await delay(300);
    const entries = getStoredEntries();
    const newEntry = {
      id: Date.now().toString(),
      ...entryData
    };
    const updatedEntries = [...entries, newEntry];
    setStoredEntries(updatedEntries);
    return { ...newEntry };
  },

  async update(id, entryData) {
    await delay(300);
    const entries = getStoredEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Entry not found');
    
    const updatedEntry = { ...entries[index], ...entryData };
    entries[index] = updatedEntry;
    setStoredEntries(entries);
    return { ...updatedEntry };
  },

  async delete(id) {
    await delay(300);
    const entries = getStoredEntries();
    const filteredEntries = entries.filter(e => e.id !== id);
    setStoredEntries(filteredEntries);
    return { success: true };
  }
};