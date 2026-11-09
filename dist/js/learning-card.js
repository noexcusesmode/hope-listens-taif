import {config} from './config.js';
import {cardThemes} from './content/promises.js';
// صور محلية بالخط المرفق، دون تحميل صور من خارج الموقع.
export function wrapLines(ctx,text,maxWidth){
 const lines=[];for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(/\s+/)){const next=(line+' '+word).trim();if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word}else line=next;
 if(ctx.measureText(line).width>maxWidth){let segment='';for(const char of line){if(ctx.measureText(segment+char).width>maxWidth){lines.push(segment);segment=''}segment+=char}line=segment}}
 if(line)lines.push(line)}return lines;
}
function textBlock(ctx,text,x,y,width,size=42,lineHeight=66){ctx.font=`400 ${size}px Thmanyah`;const lines=wrapLines(ctx,text,width);for(const line of lines){ctx.fillText(line,x,y);y+=lineHeight}return y}
export function drawCard(ctx,{kind='promise',text='',theme='green',design='arch',date='',skills=[]}={}){
 const palette=cardThemes[theme]||cardThemes.green;const w=1080,h=1350;
 ctx.clearRect(0,0,w,h);ctx.fillStyle=palette.bg;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.fillStyle=palette.accent;ctx.globalAlpha=.22;
 if(design==='orbit'){for(const [x,y,r] of [[100,90,220],[1000,1130,300],[870,120,80]]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}}
 else if(design==='leaf'){ctx.translate(90,130);ctx.rotate(-.4);ctx.beginPath();ctx.ellipse(0,0,130,260,0,0,Math.PI*2);ctx.fill();ctx.translate(800,900);ctx.beginPath();ctx.ellipse(0,0,170,300,0,0,Math.PI*2);ctx.fill()}
 else {ctx.beginPath();ctx.roundRect(60,60,960,1230,[440,440,40,40]);ctx.fill()}
 ctx.restore();ctx.fillStyle=palette.ink;ctx.direction='rtl';ctx.textAlign='right';
 ctx.font='700 52px Thmanyah';ctx.fillText(config.title,990,170);
 ctx.font='400 25px Thmanyah';ctx.fillText(config.organization,990,220);
 ctx.font='700 32px Thmanyah';ctx.fillText(kind==='learning'?'ما تعلمته':kind==='wall'?'رسالة أمل':'وعد لنفسي',990,335);
 if(kind==='learning'){let y=430;for(const skill of skills)y=textBlock(ctx,'• '+skill,990,y,900,30,48)+26}
 else {let size=58;ctx.font=`400 ${size}px Thmanyah`;while(wrapLines(ctx,text,850).length>6&&size>32){size-=2;ctx.font=`400 ${size}px Thmanyah`}textBlock(ctx,text,965,500,850,size,size*1.55)}
 ctx.font='400 30px Thmanyah';ctx.fillText('كل خطوة واعية، بداية تستحق.',990,1130);
 if(date){ctx.font='400 24px Thmanyah';ctx.fillText(date,990,1180)}
 ctx.font='400 21px Thmanyah';ctx.fillText(config.supervision,990,1260);
}
export async function readyFonts(){await Promise.all([document.fonts.load('400 40px Thmanyah'),document.fonts.load('700 52px Thmanyah')]);await document.fonts.ready}
export async function makeCard(options){await readyFonts();const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;drawCard(canvas.getContext('2d'),options);const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('تعذّر إنشاء الصورة')),'image/png'));return {canvas,blob}}
export function saveFile(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
