import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(new URL('themes/', output), { recursive: true });
const themes = [];
for (const directory of (await readdir(new URL('themes/', root), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!directory.isDirectory()) continue;
  const folder = new URL(`themes/${directory.name}/`, root);
  const { id, name, author, description, css } = JSON.parse(await readFile(new URL('manifest.json', folder), 'utf8'));
  assert.equal(id, directory.name);
  assert.match(id, /^[a-z0-9-]+$/);
  assert.match(css, /^[\w-]+\.css$/);
  const source = await readFile(new URL(css, folder), 'utf8');
  // Current Yapmod mounts the stylesheet directly. The legacy loader also
  // supplied a root attribute and mapped theme tokens to host variables.
  const stylesheet = source.replaceAll(`:root[data-yapmod-theme="${id}"]`, 'html:root');
  const aliases = {
    'bg-side-solid': 'bg-side', 'bg-floating': 'bg-float', 'accent-fill': 'accent',
    'accent-fill-hover': 'accent-hover', 'tint-a': 'accent', 'fx-accent': 'accent'
  };
  const tokens = [...source.matchAll(/^  --ym-([\w-]+):/gm)].map(match => match[1]);
  const bindings = Object.fromEntries(tokens.map(token => [token, token]));
  const variables = Object.entries({ ...bindings, ...aliases })
    .filter(([, token]) => tokens.includes(token))
    .map(([host, token]) => `  --${host}: var(--ym-${token});`).join('\n');
  // Server and personal palettes also set these variables on <html>.
  const paletteRoots = [
    'html:root', 'html:root[data-theme]', 'html:root[data-srv-accent]',
    'html:root[data-tint][data-theme]', 'html:root[data-srv-tint]:not([data-tint])',
    'html:root[data-srv-tint][data-theme]:not([data-tint])'
  ].join(',\n');
  const header = `/**\n * @name ${name}\n * @author ${author}\n * @description ${description}\n */`;
  const url = `themes/${id}.theme.css`;
  await writeFile(new URL(url, output), `${header}\n${stylesheet}\n${paletteRoots} {\n${variables}\n}\n`);
  themes.push({ name, author, description, url });
}
assert.ok(themes.length, 'The catalog needs at least one theme.');
await writeFile(new URL('index.json', output), JSON.stringify({
  schemaVersion: 1, name: 'ilyeshdz themes', description: 'Monochrome themes for Yapmod.', themes
}, null, 2) + '\n');
