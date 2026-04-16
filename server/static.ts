import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    // fallback to __dirname for local dev if needed
    const localDistPath = path.resolve(__dirname, "public");
    if (!fs.existsSync(localDistPath)) {
      throw new Error(
        `Could not find the build directory: ${distPath} or ${localDistPath}, make sure to build the client first`,
      );
    }
  }

  const finalDistPath = fs.existsSync(distPath) ? distPath : path.resolve(__dirname, "public");
  app.use(express.static(finalDistPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(finalDistPath, "index.html"));
  });
}
