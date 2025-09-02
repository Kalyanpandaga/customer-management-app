import app from "./app.js";
import { PORT } from "./config/constants.js";
import db from "./config/database.js";

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
