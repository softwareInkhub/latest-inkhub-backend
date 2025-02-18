import express from 'express';
import cors from 'cors';
import schemaRoutes from './routes/schemaRoutes';
import dataRoutes from './routes/dataRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', schemaRoutes);
app.use('/api', dataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});