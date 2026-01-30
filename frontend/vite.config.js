import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // You might need to install 'path' if not available, but it's usually built-in

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      // This forces all packages to use the same React instance
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
});
