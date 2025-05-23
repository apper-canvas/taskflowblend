/**
 * Task Tag Service - Handles all operations for the task_tag table
 */

// Format task tag data for creation/update operations
const formatTaskTagData = (taskTagData) => {
  return {
    Name: taskTagData.tag_name,
    task_id: taskTagData.task_id,
    tag_name: taskTagData.tag_name
  };
};

// Map database record to UI format
const mapTaskTagToUI = (record) => {
  if (!record) return null;
  
  return {
    id: record.Id,
    taskId: record.task_id,
    tagName: record.tag_name || record.Name,
    createdAt: record.CreatedOn || new Date().toISOString()
  };
};

/**
 * Get tags for a specific task
 */
export const getTagsForTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('task_tag', {
      fields: ['Id', 'Name', 'task_id', 'tag_name', 'CreatedOn'],
      where: [
        {
          fieldName: 'task_id',
          operator: 'ExactMatch',
          values: [taskId]
        }
      ]
    });
    
    if (response && response.data) {
      return response.data.map(mapTaskTagToUI);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching task tags:', error);
    throw new Error('Failed to fetch task tags');
  }
};

/**
 * Create a new task tag
 */
export const createTaskTag = async (taskTagData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const formattedData = formatTaskTagData(taskTagData);
    const response = await apperClient.createRecord('task_tag', { 
      records: [formattedData] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return mapTaskTagToUI(response.results[0].data);
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to create task tag');
  } catch (error) {
    console.error('Error creating task tag:', error);
    throw error;
  }
};

/**
 * Delete a task tag
 */
export const deleteTaskTag = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('task_tag', { 
      RecordIds: [id] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return true;
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to delete task tag');
  } catch (error) {
    console.error('Error deleting task tag:', error);
    throw error;
  }
};

// Export the service as default object with all methods
const taskTagService = {
  getTagsForTask,
  createTaskTag,
  deleteTaskTag
};

export default taskTagService;