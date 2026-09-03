import express, { Express } from'express';
import cors from'cors';
import helmet from'helmet';
import morgan from'morgan';
import routes from'./routes/index.js';
import { globalRateLimiter } from'./middleware/rate-limiter.js';
import { notFoundHandler } from'./middleware/not-found.js';
import { errorHandler } from'./middleware/error-handler.js';

const app: Express = express();

if (process.env.TRUST_PROXY ==='true') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !=='test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit:'10kb' }));
app.use(globalRateLimiter);

// Mount main routes under /api and root aliases
app.use('/api', routes);
app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
