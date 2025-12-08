import express from 'express';
import { getSales, getFilters } from '../controllers/salesController.js';
import { searchLimiter, apiLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// stricter rate limit for search operations
router.get('/sales', searchLimiter, getSales);

// Get filter options
router.get('/filters', apiLimiter, getFilters);

export default router;
