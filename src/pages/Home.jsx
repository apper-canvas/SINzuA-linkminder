import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("linkminderData");
    return savedData ? JSON.parse(savedData) : {
      tasks: [],
      links: [],
      categories: [
        { id: "self-help", name: "Self Help", color: "#6366f1" },
        { id: "finance", name: "Finance", color: "#10b981" },
        { id: "tutorial", name: "Tutorials", color: "#f59e0b" },
        { id: "video", name: "Videos", color: "#ef4444" },
        { id: "travel", name: "Travel", color: "#06b6d4" }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem("linkminderData", JSON.stringify(userData));
  }, [userData]);

  const addItem = (type, item) => {
    setUserData(prev => ({
      ...prev,
      [type]: [...prev[type], item]
    }));
  };

  const deleteItem = (type, id) => {
    setUserData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const toggleTaskCompletion = (id) => {
    setUserData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const addCategory = (category) => {
    setUserData(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Dashboard</h2>
                <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === "tasks"
                        ? "bg-white dark:bg-surface-700 shadow-soft"
                        : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100"
                    }`}
                    onClick={() => setActiveTab("tasks")}
                  >
                    Tasks
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === "links"
                        ? "bg-white dark:bg-surface-700 shadow-soft"
                        : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100"
                    }`}
                    onClick={() => setActiveTab("links")}
                  >
                    Links
                  </button>
                </div>
              </div>

              {activeTab === "tasks" && (
                <div className="space-y-3">
                  {userData.tasks.length === 0 ? (
                    <div className="text-center py-8 text-surface-500">
                      <p>No tasks yet. Add your first task!</p>
                    </div>
                  ) : (
                    userData.tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 group hover:border-primary dark:hover:border-primary transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="h-5 w-5 rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary/30"
                        />
                        <div className="ml-3 flex-1">
                          <p className={`font-medium ${task.completed ? "line-through text-surface-400" : ""}`}>
                            {task.title}
                          </p>
                          {task.category && (
                            <span 
                              className="badge mt-1"
                              style={{ 
                                backgroundColor: `${task.categoryColor}20`, 
                                color: task.categoryColor 
                              }}
                            >
                              {task.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem("tasks", task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-red-500 transition-all"
                        >
                          Delete
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "links" && (
                <div className="space-y-3">
                  {userData.links.length === 0 ? (
                    <div className="text-center py-8 text-surface-500">
                      <p>No links saved yet. Add your first link!</p>
                    </div>
                  ) : (
                    userData.links.map(link => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 group hover:border-primary dark:hover:border-primary transition-all"
                      >
                        <div className="flex justify-between">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {link.title}
                          </a>
                          <button
                            onClick={() => deleteItem("links", link.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-red-500 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-sm text-surface-500 truncate mt-1">{link.url}</p>
                        {link.category && (
                          <span 
                            className="badge mt-2"
                            style={{ 
                              backgroundColor: `${link.categoryColor}20`, 
                              color: link.categoryColor 
                            }}
                          >
                            {link.category}
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <MainFeature 
              userData={userData}
              addItem={addItem}
              addCategory={addCategory}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;