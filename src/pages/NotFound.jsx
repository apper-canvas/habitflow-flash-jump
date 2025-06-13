import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-surface-900 mb-2">Page Not Found</h1>
        <p className="text-surface-600 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;