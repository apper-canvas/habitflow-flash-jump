import { motion } from 'framer-motion';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

function AddHabitModal({ isOpen, onClose, newHabitName, onNewHabitNameChange, onAddHabit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddHabit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Habit">
      <div className="space-y-4">
        <FormField
          label="Habit Name"
          id="new-habit-name"
          type="text"
          value={newHabitName}
          onChange={(e) => onNewHabitNameChange(e.target.value)}
          placeholder="e.g., Drink 8 glasses of water"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        
        <div className="flex space-x-3">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddHabit}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Habit
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddHabitModal;