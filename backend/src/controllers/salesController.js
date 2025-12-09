import {getSalesData, getFilterOptionsFromData} from '../services/dataService.js';

export const getSales = async (req, res) => {
  try {
    const {search, customerRegion, gender, minAge, maxAge, ageRanges, productCategory, tags, paymentMethod, 
    startDate, endDate, sortBy = 'date', order = 'desc', page = 1, pageSize = 10} = req.query;

    const filters = {};
    
    if(customerRegion){
      filters.customerRegion = Array.isArray(customerRegion) ? customerRegion : customerRegion.split(',');
    }
    
    if(gender){
      filters.gender = Array.isArray(gender) ? gender : gender.split(',');
    }
    
    // Support both ageRanges (new multi-select) and minAge/maxAge (old)
    if(ageRanges){
      filters.ageRanges = Array.isArray(ageRanges) ? ageRanges : ageRanges.split(',');
    } else if(minAge || maxAge){
      if(minAge) filters.minAge = minAge;
      if(maxAge) filters.maxAge = maxAge;
    }
    
    if(productCategory){
      filters.productCategory = Array.isArray(productCategory) ? productCategory : productCategory.split(',');
    }
    
    if(tags){
      filters.tags = Array.isArray(tags) ? tags : tags.split(',');
    }
    
    if(paymentMethod){
      filters.paymentMethod = Array.isArray(paymentMethod) ? paymentMethod : paymentMethod.split(',');
    }
    
    if(startDate) filters.startDate = startDate;
    if(endDate) filters.endDate = endDate;

    const result = await getSalesData(search, filters, sortBy, order, page, pageSize);

    res.json({
      success: true,
      ...result
    });
  }
  catch(error){
    console.error('Error in getSales:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data',
      error: error.message
    });
  }
};


export const getFilters = async (req, res) => {
  try{
    const options = await getFilterOptionsFromData();
    res.json({
      success: true,
      filters: options
    });
  }
  catch(error){
    console.error('Error in getFilters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};
