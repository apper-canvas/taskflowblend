/**
 * Task Service - Handles all operations for the task3 table
 */

// Get updateable fields for task3 table
const getUpdateableFields = () => [
  'Name',
  'Tags',
  'Owner',
  'title',
  'description',
  'priority',
  'status',
  'dueDate',
  'category',
  'completed'
];

// Format task data for creation/update operations
const formatTaskData = (taskData) => {
  return {
    Name: taskData.title, // Use title as Name
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    status: taskData.status || 'to-do',
    dueDate: taskData.dueDate || null,
    category: taskData.category || 'General',
    completed: Boolean(taskData.completed),
    Tags: Array.isArray(taskData.tags) ? taskData.tags.join(',') : taskData.tags || ''
  };
};

// Map database record to UI format
const mapTaskToUI = (record) => {
  if (!record) return null;
  
  return {
    id: record.Id,
    title: record.title || record.Name,
    description: record.description || '',
    priority: record.priority || 'medium',
    status: record.status || 'to-do',
    dueDate: record.dueDate || null,
    category: record.category || 'General',
    completed: Boolean(record.completed),
    tags: record.Tags ? (typeof record.Tags === 'string' ? record.Tags.split(',') : record.Tags) : [],
    createdAt: record.CreatedOn || new Date().toISOString()
  };
};

/**
 * Get all tasks with optional filtering
 */
export const getTasks = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Define fields to retrieve
    const fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'title', 
      'description', 'priority', 'status', 'dueDate', 'category', 'completed'
    ];

    // Build query parameters
    const params = {
      fields,
      orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }]
    };

    // Add status filter if provided
    if (filterOptions.status && filterOptions.status !== 'all') {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filterOptions.status]
        }
      ];
    }

    // Add search filter if provided
    if (filterOptions.searchTerm) {
      const searchCondition = {
        fieldName: 'title',
        operator: 'Contains',
        values: [filterOptions.searchTerm]
      };

      if (params.where) {
        params.whereGroups = [{
          operator: 'AND',
          subGroups: [
            { conditions: params.where, operator: 'AND' },
            { conditions: [searchCondition], operator: 'AND' }
          ]
        }];
        delete params.where;
      } else {
        params.where = [searchCondition];
      }
    }

    const response = await apperClient.fetchRecords('task3', params);
    
    if (response && response.data) {
      return response.data.map(mapTaskToUI);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const formattedData = formatTaskData(taskData);
    const response = await apperClient.createRecord('task3', { 
      records: [formattedData] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return mapTaskToUI(response.results[0].data);
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to create task');
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const formattedData = { Id: id, ...formatTaskData(taskData) };
    const response = await apperClient.updateRecord('task3', { 
      records: [formattedData] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return mapTaskToUI(response.results[0].data);
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to update task');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('task3', { 
      RecordIds: [id] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return true;
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to delete task');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Export the service as default object with all methods
const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};

export default taskService;