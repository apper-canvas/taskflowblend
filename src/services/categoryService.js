/**
 * Category Service - Handles all operations for the category table
 */

// Format category data for creation/update operations
const formatCategoryData = (categoryData) => {
  return {
    Name: categoryData.name,
    Tags: categoryData.tags || ''
  };
};

// Map database record to UI format
const mapCategoryToUI = (record) => {
  if (!record) return null;
  
  return {
    id: record.Id,
    name: record.Name,
    tags: record.Tags ? (typeof record.Tags === 'string' ? record.Tags.split(',') : record.Tags) : [],
    createdAt: record.CreatedOn || new Date().toISOString()
  };
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('category', {
      fields: ['Id', 'Name', 'Tags', 'CreatedOn'],
      orderBy: [{ fieldName: 'Name', SortType: 'ASC' }]
    });
    
    if (response && response.data) {
      return response.data.map(mapCategoryToUI);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const formattedData = formatCategoryData(categoryData);
    const response = await apperClient.createRecord('category', { 
      records: [formattedData] 
    });

    if (response && response.success && response.results && response.results[0].success) {
      return mapCategoryToUI(response.results[0].data);
    }
    
    throw new Error(response?.results?.[0]?.message || 'Failed to create category');
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Export the service as default object with all methods
const categoryService = {
  getCategories,
  createCategory
};

export default categoryService;