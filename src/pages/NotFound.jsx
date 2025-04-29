import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon } from "lucide-react";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-6">
          <div className="inline-block p-6 bg-surface-100 dark:bg-surface-800 rounded-full">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-surface-400">
                404
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <HomeIcon size={18} className="mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;