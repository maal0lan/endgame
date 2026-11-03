import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'ironnest-api' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 404 + global error handler
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB, then start listening
const start = async () => {
  try {
    await connectDB();
    await new Promise((resolve, reject) => {
      const server = app.listen(port);
      server.once('listening', () => {
        console.log(`IronNest API listening on http://localhost:${port}`);
        resolve();
      });
      server.once('error', reject);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the existing server or set PORT to another available port.`);
    } else {
      console.error('Failed to start server:', error.message);
    }
    process.exit(1);
  }
};

start();

export default app;
