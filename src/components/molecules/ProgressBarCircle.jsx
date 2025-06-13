import { motion } from 'framer-motion';

function ProgressBarCircle({ progress }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 progress-ring">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="transparent"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#10B981"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-surface-900">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default ProgressBarCircle;