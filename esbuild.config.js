
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outdir = 'dist';

async function build() {
  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outdir)) {
      fs.mkdirSync(outdir);
    }

    // 1. Bundle the JS/TSX code
    await esbuild.build({
      entryPoints: ['index.tsx'],
      bundle: true,
      outfile: path.join(outdir, 'index.js'),
      minify: true,
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      jsx: 'automatic',
      loader: { '.tsx': 'tsx', '.ts': 'ts' },
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
      },
    });

    // 2. Process and copy index.html for production
    let html = fs.readFileSync('index.html', 'utf-8');

    // Remove the development-only importmap
    html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');

    // Replace the TSX script tag with the bundled JS file
    html = html.replace(
      '<script type="module" src="/index.tsx"></script>',
      '<script defer src="index.js"></script>'
    );

    fs.writeFileSync(path.join(outdir, 'index.html'), html);

    console.log('Build finished successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
