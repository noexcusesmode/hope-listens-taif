import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk('dist');
for(const file of files){if(file.endsWith('.js'))execFileSync(process.execPath,['--check',file]);if(/\.(html|js|css)$/.test(file)){const text=fs.readFileSync(file,'utf8');assert.ok(!/Google Developer|\bGDG\b|\bGDSC\b|قوقل|تضاف أسماء الفريق|تحت التطوير/.test(text),'Identity: '+file);if(file.endsWith('.html')){assert.match(text,/<html lang="ar" dir="rtl">/);for(const [,url] of text.matchAll(/(?:src|href)="(\.{1,2}\/[^"#]+)"/g))assert.ok(fs.existsSync(path.resolve(path.dirname(file),url)),'Missing '+url)}}}
assert.equal(fs.readFileSync('dist/assets/qr-target.txt','utf8').trim(),'https://hope-listens-taif.vercel.app/');
for(const route of ['index.html','wall/index.html','admin/index.html'])assert.ok(fs.existsSync('dist/'+route));
console.log(`Static build validation passed: ${files.length} files; JS syntax, routes, assets, RTL, identity and QR target checked.`);
