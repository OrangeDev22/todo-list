export const corsOptions = {
  origin: [process.env.FRONT_END_ORIGIN || "", "http://localhost:3000"],
  default: process.env.FRONT_END_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
