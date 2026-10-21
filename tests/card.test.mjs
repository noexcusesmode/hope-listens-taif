import test from 'node:test';
import assert from 'node:assert/strict';
import {logoBounds,loadCardLogo,drawLearningCard} from '../dist/js/learning-card.js';
import {config} from '../dist/js/config.js';
test('logo stays at physical left with native ratio and footer clearance',()=>{
 const logo={naturalWidth:1920,naturalHeight:384},box=logoBounds(1080,1260,logo);
 assert.equal(box.x,48);assert.equal(box.width,1080*.14);assert.equal(box.width/box.height,5);
 assert.equal(box.y+box.height,1260-48);assert.ok(box.y>1160+10);
 let drawn;
 const ctx={fillRect(){},fillText(){},measureText(s){return {width:s.length*15}},drawImage(...args){drawn=args}};
 drawLearningCard(ctx,logo,config);assert.deepEqual(drawn,[logo,box.x,box.y,box.width,box.height]);assert.equal(ctx.direction,'rtl');
});
test('logo sets CORS before source and waits for successful loading',async()=>{
 globalThis.Image=class{naturalWidth=1920;naturalHeight=384;set src(value){assert.equal(this.crossOrigin,'anonymous');queueMicrotask(()=>this.onload())}};
 const image=await loadCardLogo('https://example.com/logo.png');assert.equal(image.naturalWidth,1920);
});
test('failed logo rejects instead of silently exporting without branding',async()=>{
 globalThis.Image=class{set src(value){queueMicrotask(()=>this.onerror())}};
 await assert.rejects(loadCardLogo('missing.png'),/failed/);
});
