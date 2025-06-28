    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    // Replace 'your-repo-name' with the actual name of your GitHub repository.
    // For example, if your repo is 'github.com/YourUsername/boldchain-website',
    // then base should be '/boldchain-website/'.
    const repoName = 'boldchain-hackathon-project'; // <<--- IMPORTANT: Set this to your repository name!

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      base: `/${repoName}/`, // This is crucial for GitHub Pages to serve assets correctly
      build: {
        outDir: 'dist', // Output directory for production build
        sourcemap: true, // Generate sourcemaps for debugging (optional for production)
      },
    });
    