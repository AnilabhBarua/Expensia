import { motion } from 'framer-motion';

const DevelopmentTag = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-medium z-50"
    >
      Under Development
    </motion.div>
  );
};

export default DevelopmentTag;