// vite.config.js
import path from "node:path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'


export default defineConfig({
    esbuild: {
        include: /\.[jt]sx?$/,
        exclude: [],
        loader: 'jsx',
    },
    plugins: [
        // SVGR must come *before* the React plugin
        svgr({
            // override default so that `.svg` (not just `?react`) get picked up:
            include: '**/*.svg',
            // keep the named `ReactComponent` export (instead of forcing a default export)
            svgrOptions: {
                exportType: 'named'
            }
        }),
        react({
            // automatic JSX runtime + Emotion support
            jsxImportSource: '@emotion/react',
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "./src"),
        }
    }
})
