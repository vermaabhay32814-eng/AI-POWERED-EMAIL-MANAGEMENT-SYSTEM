import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Server with fallback port support
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Intelligent Email Assistant Backend Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✨ AI Engine: Gemini 1.5 + Smart NLP Heuristics`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = PORT + 1;
    console.warn(`[Server Warning] Port ${PORT} in use, attempting port ${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`🚀 Server started on fallback port http://localhost:${fallbackPort}`);
    });
  } else {
    console.error('[Server Error]', err);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});
