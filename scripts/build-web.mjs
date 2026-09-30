import {cp, mkdir, rm, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const project = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(project, 'app');
const output = resolve(project, 'dist/web');

for (const name of ['index.html', 'app.js', 'data.js', 'varieties.js', 'engine.js', 'styles.css', 'icon.svg']) {
  if (!(await stat(resolve(source, name))).isFile()) throw new Error(`Fichier web manquant : ${name}`);
}

await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});
for (const name of ['index.html', 'app.js', 'data.js', 'varieties.js', 'engine.js', 'styles.css', 'icon.svg']) {
  await cp(resolve(source, name), resolve(output, name));
}
console.log(`Site prêt dans ${output}`);
