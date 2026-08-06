import { cp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const repoRoot = resolve(packageRoot, '../..');
const sourceDir = join(repoRoot, 'apps/template-blog');
const targetDir = join(packageRoot, 'template');

const IGNORE_NAMES = new Set([
  'node_modules',
  '.nuxt',
  '.output',
  'dist',
  '.data',
  '.cache',
  '.env',
  '.git',
]);

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function main() {
  if (!(await pathExists(join(sourceDir, 'package.json')))) {
    throw new Error(`Template source missing: ${sourceDir}`);
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });

  await cp(sourceDir, targetDir, {
    recursive: true,
    filter: (source) => !IGNORE_NAMES.has(basename(source)),
  });

  const core = await readJson(join(repoRoot, 'packages/directus-blog-core/package.json'));
  const layer = await readJson(join(repoRoot, 'packages/nuxt-directus-blog/package.json'));
  const versions = {
    '@croffledev/directus-blog-core': `^${core.version}`,
    '@croffledev/nuxt-directus-blog': `^${layer.version}`,
  };

  const pkgPath = join(targetDir, 'package.json');
  const pkg = await readJson(pkgPath);
  pkg.name = 'croffle-blog';
  pkg.private = true;

  for (const section of ['dependencies', 'devDependencies']) {
    if (!pkg[section]) continue;
    for (const [name, version] of Object.entries(pkg[section])) {
      if (version === 'workspace:*' && versions[name]) {
        pkg[section][name] = versions[name];
      }
    }
  }

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  console.log(`Synced template → ${targetDir}`);
  console.log(`Pinned ${JSON.stringify(versions)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
