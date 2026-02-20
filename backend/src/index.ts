import "dotenv/config";
import app from "./server.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || "3000";

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Barbell Bites is lifting on http://localhost:${PORT}`);
  });
};

startServer();
