import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Plus, Check, X, ChevronDown } from "lucide-react";

const MainFeature = ({ userData, addItem, addCategory }) => {
  const [formType, setFormType] = useState("task");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  
  // Validation states
  const [taskTitleError, setTaskTitleError] = useState("");
  const [linkTitleError, setLinkTitleError] = useState("");
  const [linkUrlError, setLinkUrlError] = useState("");
  const [newCategoryNameError, setNewCategoryNameError] = useState("");
  
  // Success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!taskTitle.trim()) {
      setTaskTitleError("Task title is required");
      return;
    }
    
    // Find category color if category is selected
    const categoryObj = userData.categories.find(cat => cat.name === taskCategory);
    const categoryColor = categoryObj ? categoryObj.color : null;
    
    // Create new task
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      category: taskCategory || null,
      categoryColor: categoryColor,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Add task
    addItem("tasks", newTask);
    
    // Reset form
    setTaskTitle("");
    setTaskCategory("");
    setTaskTitleError("");
    
    // Show success message
    setSuccessMessage("Task added successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    let hasError = false;
    
    if (!linkTitle.trim()) {
      setLinkTitleError("Link title is required");
      hasError = true;
    }
    
    if (!linkUrl.trim()) {
      setLinkUrlError("URL is required");
      hasError = true;
    } else if (!isValidUrl(linkUrl)) {
      setLinkUrlError("Please enter a valid URL");
      hasError = true;
    }
    
    if (hasError) return;
    
    // Find category color if category is selected
    const categoryObj = userData.categories.find(cat => cat.name === linkCategory);
    const categoryColor = categoryObj ? categoryObj.color : null;
    
    // Create new link
    const newLink = {
      id: Date.now().toString(),
      title: linkTitle,
      url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
      category: linkCategory || null,
      categoryColor: categoryColor,
      createdAt: new Date().toISOString()
    };
    
    // Add link
    addItem("links", newLink);
    
    // Reset form
    setLinkTitle("");
    setLinkUrl("");
    setLinkCategory("");
    setLinkTitleError("");
    setLinkUrlError("");
    
    // Show success message
    setSuccessMessage("Link added successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleNewCategorySubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!newCategoryName.trim()) {
      setNewCategoryNameError("Category name is required");
      return;
    }
    
    // Check if category already exists
    if (userData.categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setNewCategoryNameError("Category already exists");
      return;
    }
    
    // Create new category
    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      color: newCategoryColor
    };
    
    // Add category
    addCategory(newCategory);
    
    // Reset form and close modal
    setNewCategoryName("");
    setNewCategoryColor("#6366f1");
    setNewCategoryNameError("");
    setIsNewCategoryModalOpen(false);
    
    // Show success message
    setSuccessMessage("Category added successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const isValidUrl = (url) => {
    try {
      // Add protocol if missing
      const urlToCheck = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.category-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md"
          >
            <div className="flex items-center">
              <Check size={18} className="mr-2" />
              <p>{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add New Item Card */}
      <div className="card overflow-visible">
        <div className="flex border-b border-surface-200 dark:border-surface-700">
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              formType === "task"
                ? "text-primary border-b-2 border-primary"
                : "text-surface-500 hover:text-surface-800 dark:hover:text-surface-200"
            }`}
            onClick={() => setFormType("task")}
          >
            Add Task
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              formType === "link"
                ? "text-primary border-b-2 border-primary"
                : "text-surface-500 hover:text-surface-800 dark:hover:text-surface-200"
            }`}
            onClick={() => setFormType("link")}
          >
            Add Link
          </button>
        </div>
        
        <div className="p-5">
          <AnimatePresence mode="wait">
            {formType === "task" ? (
              <motion.form
                key="task-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleTaskSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="taskTitle" className="block text-sm font-medium mb-1">
                    Task Title
                  </label>
                  <input
                    id="taskTitle"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => {
                      setTaskTitle(e.target.value);
                      if (e.target.value.trim()) setTaskTitleError("");
                    }}
                    placeholder="Enter task title"
                    className={`input ${taskTitleError ? "border-red-500 focus:ring-red-500/30" : ""}`}
                  />
                  {taskTitleError && (
                    <p className="mt-1 text-sm text-red-500">{taskTitleError}</p>
                  )}
                </div>
                
                <div className="relative category-dropdown">
                  <label htmlFor="taskCategory" className="block text-sm font-medium mb-1">
                    Category (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="taskCategory"
                      type="text"
                      value={taskCategory}
                      readOnly
                      placeholder="Select a category"
                      className="input pr-10 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
                    />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 py-1 max-h-60 overflow-auto">
                      {userData.categories.map((category) => (
                        <div
                          key={category.id}
                          className="px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer flex items-center"
                          onClick={() => {
                            setTaskCategory(category.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          {category.name}
                        </div>
                      ))}
                      <div
                        className="px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer text-primary flex items-center border-t border-surface-200 dark:border-surface-700 mt-1"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsNewCategoryModalOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add New Category
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add Task
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="link-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLinkSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="linkTitle" className="block text-sm font-medium mb-1">
                    Link Title
                  </label>
                  <input
                    id="linkTitle"
                    type="text"
                    value={linkTitle}
                    onChange={(e) => {
                      setLinkTitle(e.target.value);
                      if (e.target.value.trim()) setLinkTitleError("");
                    }}
                    placeholder="Enter link title"
                    className={`input ${linkTitleError ? "border-red-500 focus:ring-red-500/30" : ""}`}
                  />
                  {linkTitleError && (
                    <p className="mt-1 text-sm text-red-500">{linkTitleError}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="linkUrl" className="block text-sm font-medium mb-1">
                    URL
                  </label>
                  <div className="relative">
                    <Link
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <input
                      id="linkUrl"
                      type="text"
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        if (e.target.value.trim()) setLinkUrlError("");
                      }}
                      placeholder="https://example.com"
                      className={`input pl-10 ${linkUrlError ? "border-red-500 focus:ring-red-500/30" : ""}`}
                    />
                  </div>
                  {linkUrlError && (
                    <p className="mt-1 text-sm text-red-500">{linkUrlError}</p>
                  )}
                </div>
                
                <div className="relative category-dropdown">
                  <label htmlFor="linkCategory" className="block text-sm font-medium mb-1">
                    Category (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="linkCategory"
                      type="text"
                      value={linkCategory}
                      readOnly
                      placeholder="Select a category"
                      className="input pr-10 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
                    />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 py-1 max-h-60 overflow-auto">
                      {userData.categories.map((category) => (
                        <div
                          key={category.id}
                          className="px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer flex items-center"
                          onClick={() => {
                            setLinkCategory(category.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          {category.name}
                        </div>
                      ))}
                      <div
                        className="px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer text-primary flex items-center border-t border-surface-200 dark:border-surface-700 mt-1"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsNewCategoryModalOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add New Category
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add Link
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Categories Overview */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {userData.categories.map((category) => (
            <div
              key={category.id}
              className="p-3 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center"
              style={{ borderLeftColor: category.color, borderLeftWidth: '3px' }}
            >
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              ></span>
              <span className="text-sm font-medium truncate">{category.name}</span>
            </div>
          ))}
          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
            className="p-3 rounded-lg border border-dashed border-surface-300 dark:border-surface-700 flex items-center justify-center text-surface-500 hover:text-primary hover:border-primary transition-colors"
          >
            <Plus size={16} className="mr-1" />
            <span className="text-sm">Add New</span>
          </button>
        </div>
      </div>
      
      {/* New Category Modal */}
      <AnimatePresence>
        {isNewCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-lg font-semibold">Add New Category</h3>
                <button
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleNewCategorySubmit} className="p-4 space-y-4">
                <div>
                  <label htmlFor="newCategoryName" className="block text-sm font-medium mb-1">
                    Category Name
                  </label>
                  <input
                    id="newCategoryName"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      if (e.target.value.trim()) setNewCategoryNameError("");
                    }}
                    placeholder="Enter category name"
                    className={`input ${newCategoryNameError ? "border-red-500 focus:ring-red-500/30" : ""}`}
                  />
                  {newCategoryNameError && (
                    <p className="mt-1 text-sm text-red-500">{newCategoryNameError}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newCategoryColor" className="block text-sm font-medium mb-1">
                    Category Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="newCategoryColor"
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-10 h-10 rounded-md border-0 p-0 cursor-pointer"
                    />
                    <div className="flex-1 grid grid-cols-6 gap-2">
                      {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-surface-700 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategoryColor(color)}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewCategoryModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;