import fs from "fs";
import path from "path";

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: this.getTimestamp(),
      level,
      message,
      ...meta,
    });
  }

  writeToFile(filename, message) {
    const logFile = path.join(this.logDir, filename);
    fs.appendFileSync(logFile, message + "\n");
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage("INFO", message, meta);
    console.log(formattedMessage);
    this.writeToFile("app.log", formattedMessage);
  }

  error(message, meta = {}) {
    const formattedMessage = this.formatMessage("ERROR", message, meta);
    console.error(formattedMessage);
    this.writeToFile("error.log", formattedMessage);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage("WARN", message, meta);
    console.warn(formattedMessage);
    this.writeToFile("app.log", formattedMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      const formattedMessage = this.formatMessage("DEBUG", message, meta);
      console.debug(formattedMessage);
      this.writeToFile("debug.log", formattedMessage);
    }
  }

  // API specific logging
  logRequest(req, res, responseTime) {
    this.info("API Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    });
  }

  logError(error, req = null) {
    this.error("Application Error", {
      message: error.message,
      stack: error.stack,
      ...(req && {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
      }),
    });
  }

  logDatabaseOperation(operation, table, duration, error = null) {
    if (error) {
      this.error("Database Error", {
        operation,
        table,
        duration: `${duration}ms`,
        error: error.message,
      });
    } else {
      this.debug("Database Operation", {
        operation,
        table,
        duration: `${duration}ms`,
      });
    }
  }
}

export default new Logger();
