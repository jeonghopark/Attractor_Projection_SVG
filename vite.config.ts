import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

process.env.BROWSER = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const srcDir = path.resolve(__dirname, "src");

function getHtmlEntries() {
  const entries = {};
  try {
    fs.readdirSync(srcDir).forEach(file => {
      if (path.extname(file) === ".html") {
        const name = path.basename(file, ".html");
        entries[name] = path.resolve(srcDir, file);
      }
    });
    
    if (Object.keys(entries).length === 0) {
      entries.index = path.resolve(srcDir, "index.html");
    }
  } catch (error) {
    console.error("Search error HTML files:", error);
    entries.index = path.resolve(srcDir, "index.html");
  }
  
  return entries;
}

export default defineConfig({
  base: "./",
  root: srcDir,
  assetsInclude: ['**/*.wasm', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.svg'],
  publicDir: '../static/',
  
  server: {
    host: true,
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
  },
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        // JS 파일
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        
        // 에셋 파일들을 타입별로 분류
        assetFileNames: (assetInfo) => {
          const ext = path.extname(assetInfo.name).toLowerCase();
          
          // CSS 파일
          if (ext === '.css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          
          // 폰트 파일들
          if (['.ttf', '.woff', '.woff2', '.eot'].includes(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          // 이미지 파일들
          if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          // 기타 파일들
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  }
});