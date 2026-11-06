import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { directions } from '../content.mjs';

const root = 'docs';
const pages = [join(root,'index.html'), ...readdirSync(join(root,'directions')).map(dir => join(root,'directions',dir,'index.html'))];
assert.equal(directions.length,7);
assert.equal(pages.length,8);
const home = readFileSync(pages[0],'utf8');
assert.equal((home.match(/class="card card-/g) || []).length,7);
assert.ok(!/катальн(?:ые|ых|ым|ой) гор|roller.coaster/i.test(home));
for (const page of pages) {
  const html = readFileSync(page,'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length,1, page);
  assert.ok(!/катальн(?:ые|ых|ым|ой) гор|roller.coaster/i.test(html),page);
  for (const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const [rel] = href.split(/[?#]/);
    if (!rel || rel.startsWith('http')) continue;
    const local = join(dirname(page),rel,rel.endsWith('/') ? 'index.html' : '');
    assert.ok(existsSync(local), page+' -> '+href);
  }
}
console.log('Проверено: 8 страниц, 7 направлений, локальные ссылки и файлы.');
