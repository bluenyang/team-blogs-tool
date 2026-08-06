import { defineCommand, runMain as cittyRunMain } from 'citty';
import { consola } from 'consola';
import { installDependencies } from 'nypm';
import { basename, join, resolve, dirname } from 'pathe';
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

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

async function copyTemplate(from, to) {
  await mkdir(to, { recursive: true });
  await cp(from, to, {
    recursive: true,
    filter: (source) => {
      const name = basename(source);
      return !IGNORE_NAMES.has(name);
    },
  });
}

async function rewritePackageJson(projectDir, projectName, versions) {
  const pkgPath = join(projectDir, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));

  pkg.name = projectName;
  pkg.private = true;
  delete pkg.packageManager;

  for (const section of ['dependencies', 'devDependencies']) {
    if (!pkg[section]) continue;
    for (const [name, version] of Object.entries(pkg[section])) {
      if (version === 'workspace:*' && versions[name]) {
        pkg[section][name] = versions[name];
      }
    }
  }

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function resolvePackageVersions() {
  const templatePkgPath = join(packageRoot, 'template/package.json');
  if (await pathExists(templatePkgPath)) {
    const templatePkg = JSON.parse(await readFile(templatePkgPath, 'utf8'));
    const versions = {};
    for (const name of ['@croffledev/directus-blog-core', '@croffledev/nuxt-directus-blog']) {
      const version = templatePkg.dependencies?.[name] || templatePkg.devDependencies?.[name];
      if (version && version !== 'workspace:*') {
        versions[name] = version;
      }
    }
    if (Object.keys(versions).length === 2) {
      return versions;
    }
  }

  const versions = {};
  for (const name of ['@croffledev/directus-blog-core', '@croffledev/nuxt-directus-blog']) {
    try {
      const pkg = JSON.parse(
        await readFile(
          join(packageRoot, '../', name.replace('@croffledev/', ''), 'package.json'),
          'utf8',
        ),
      );
      versions[name] = `^${pkg.version || '0.0.0'}`;
    } catch {
      versions[name] = '^0.0.0';
    }
  }
  return versions;
}

const main = defineCommand({
  meta: {
    name: 'create-croffle-blog',
    description: 'Create a Croffle Directus Nuxt blog',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Project directory name',
      required: false,
    },
    template: {
      type: 'string',
      description: 'Custom template directory (defaults to bundled template)',
      alias: 't',
    },
    force: {
      type: 'boolean',
      description: 'Overwrite target directory if it exists',
      default: false,
    },
    install: {
      type: 'boolean',
      description: 'Install dependencies after scaffolding',
      default: true,
    },
    packageManager: {
      type: 'string',
      description: 'Package manager to use (npm | pnpm | yarn | bun)',
      alias: 'p',
      default: 'pnpm',
    },
  },
  async run({ args }) {
    const projectNameInput =
      args.name || (await consola.prompt('Project name', { default: 'my-blog' }));
    if (!projectNameInput || typeof projectNameInput !== 'string') {
      consola.error('Project name is required');
      process.exit(1);
    }

    const targetDir = resolve(process.cwd(), projectNameInput);
    const projectName = basename(targetDir);
    if (await pathExists(targetDir)) {
      if (!args.force) {
        consola.error(`Directory already exists: ${targetDir} (pass --force to overwrite)`);
        process.exit(1);
      }
      await rm(targetDir, { recursive: true, force: true });
    }

    const bundledTemplate = join(packageRoot, 'template');
    const monorepoTemplate = resolve(packageRoot, '../../apps/template-blog');
    let templateDir = args.template ? resolve(process.cwd(), args.template) : null;

    if (!templateDir) {
      if (await pathExists(join(bundledTemplate, 'package.json'))) {
        templateDir = bundledTemplate;
      } else if (await pathExists(join(monorepoTemplate, 'package.json'))) {
        templateDir = monorepoTemplate;
        consola.info('Using monorepo apps/template-blog (run sync-template before publish)');
      } else {
        consola.error(
          'Template not found. Run `pnpm --filter create-croffle-blog sync-template` first.',
        );
        process.exit(1);
      }
    }

    consola.start(`Scaffolding ${projectName}…`);
    await copyTemplate(templateDir, targetDir);

    const versions = await resolvePackageVersions();
    await rewritePackageJson(targetDir, projectName, versions);

    // Ensure .env.example is present; if only .env was ignored we keep example.
    if (!(await pathExists(join(targetDir, '.env.example')))) {
      await writeFile(
        join(targetDir, '.env.example'),
        `BLOG_URL=http://localhost:3000
BLOG_SLUG=your-blog-slug
DIRECTUS_URL=https://your-directus.example
EMAIL_ADDRESS=you@example.com
HOMEPAGE_URL=https://www.example.com
BLOG_TITLE=My Team Blog
BLOG_DESCRIPTION=Engineering notes from the team
BLOG_AUTHOR=Team Name
PROFILE_IMAGE_URL=
GITHUB_URL=
`,
      );
    }

    if (args.install) {
      consola.start(`Installing dependencies with ${args.packageManager}…`);
      try {
        await installDependencies({
          cwd: targetDir,
          packageManager: args.packageManager,
          silent: false,
        });
      } catch (error) {
        consola.warn('Dependency install failed — run install manually.');
        consola.warn(error instanceof Error ? error.message : error);
      }
    }

    consola.success(`Created ${projectName}`);
    consola.box(
      [
        `cd ${projectNameInput}`,
        'cp .env.example .env   # fill Directus + brand values',
        args.install
          ? `${args.packageManager} dev`
          : `${args.packageManager} install && ${args.packageManager} dev`,
      ].join('\n'),
    );
  },
});

export function runMain() {
  return cittyRunMain(main);
}
