import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoutes from './routes/salesRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', salesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async (retries = 3) => {
  try {
    console.log('Testing PostgreSQL connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully!');
    console.log(`Database time: ${result.rows[0].now}`);

    app.listen(PORT, () => {
      console.log(`\nServer running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Health: http://localhost:${PORT}/health\n`);
    });
  } 
  catch (error){
    console.error('Failed to connect to database:', error.message);
    
    if(retries > 0){
      const delay = (4-retries)*2000;
      console.log(`Retrying in ${delay/1000} seconds... (${retries} attempts left)`);
      setTimeout(() => startServer(retries-1), delay);
    } 
    else{
      console.error('All connection attempts failed');
      console.error('Ensure PostgreSQL is running and POSTGRES_URL is set in .env');
      process.exit(1);
    }
  }
};

startServer();
