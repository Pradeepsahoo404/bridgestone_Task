import app from'./app.js';
import dotenv from'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !=='test') {
    console.log(` Backend server running on http://localhost:${PORT}`);
  }
});

const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
