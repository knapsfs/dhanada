import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			"/api": {
				target: "http://127.0.0.1:8000",
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: "../dhanada/public/sif",
		emptyOutDir: true,
	},
	base: command === "serve" ? "/" : "/assets/dhanada/sif/",
}));
