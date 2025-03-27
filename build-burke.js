const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

// Create the build function
async function buildBurke() {
  // Build the bundle
  await esbuild.build({
    entryPoints: ['burke.js'],
    bundle: true,
    outfile: 'burke.bundled.js',
    platform: 'browser',
    format: 'iife',
    minify: true,
  })

  // Read the bundled file
  const bundledContent = fs.readFileSync('burke.bundled.js', 'utf8')

  // Copy to dev and prod directories
  const directories = [
    'build/chrome-mv3-dev',
    'build/chrome-mv3-prod'
  ]

  directories.forEach(dir => {
    // Make sure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Write the bundled file
    fs.writeFileSync(path.join(dir, 'burke.js'), bundledContent)
    console.log(`Copied burke.js to ${dir}`)
  })

  // Clean up the temporary file
  fs.unlinkSync('burke.bundled.js')
}

buildBurke().catch(err => {
  console.error(err)
  process.exit(1)
})