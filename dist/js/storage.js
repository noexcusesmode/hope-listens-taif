import {validMessage} from './ai.js';
// بيانات خاصة بهذا الأصل والمتصفح؛ لا خادم ولا صلاحيات أمنية.
export const WALL_KEY='hope-wall-v1';
export const colors=['green','blue','yellow','pink'];
export const symbols=['♡','✦','❋','✧'];
export const statuses=['pending','approved','rejected'];
export function cleanRecord(row){
 if(!row||typeof row.text!=='string'||!validMessage(row.text.trim())||!colors.includes(row.color)||!symbols.includes(row.icon)||!statuses.includes(row.status)||typeof row.id!=='string'||!/^[\w-]{1,80}$/.test(row.id))throw Error('صيغة الرسالة غير صالحة');
 return {id:row.id,text:row.text.trim(),color:row.color,icon:row.icon,status:row.status};
}
export function parseBackup(raw){
 if(typeof raw!=='string'||raw.length>1000000)throw Error('حجم النسخة أكبر من المسموح');
 let data;try{data=JSON.parse(raw)}catch{throw Error('الملف ليس JSON صالحًا')}
 if(data?.format!=='hope-wall-backup'||data.version!==1||!Array.isArray(data.messages)||data.messages.length>500)throw Error('نسخة احتياطية غير متوافقة');
 const rows=data.messages.map(cleanRecord);if(rows.some(r=>r.status!=='approved')||new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('يجب أن تحتوي النسخة رسائل معتمدة بمعرّفات فريدة');return rows;
}
export function createStorage(area,events){
 const lock=fn=>globalThis.navigator?.locks?globalThis.navigator.locks.request(WALL_KEY,fn):fn();
 const emit=()=>events?.dispatchEvent(new Event('hope-wall'));
 const read=()=>{const raw=area.getItem(WALL_KEY);if(!raw)return [];let list;try{list=JSON.parse(raw)}catch{throw Error('تعذّر قراءة بيانات الجدار. احتفظ بنسختك الاحتياطية أو أعد الضبط من الإدارة.')}
 if(!Array.isArray(list)||list.length>500)throw Error('بيانات الجدار غير صالحة');return list.map(cleanRecord)};
 const write=rows=>{area.setItem(WALL_KEY,JSON.stringify(rows));emit()};
 return {
 async list(){return read()},
 async submit(message){return lock(()=>{const rows=read();if(rows.length>=500)throw Error('امتلأ الجدار المحلي. اطلب من المشرف تصدير الرسائل وتنظيفها.');const row=cleanRecord({...message,id:crypto.randomUUID(),status:'pending'});rows.push(row);write(rows);return row})},
 async moderate(id,status){if(![...statuses,'delete'].includes(status))throw Error('إجراء غير صالح');return lock(()=>{const rows=read();if(!rows.some(r=>r.id===id))throw Error('الرسالة لم تعد موجودة');write(status==='delete'?rows.filter(r=>r.id!==id):rows.map(r=>r.id===id?{...r,status}:r))})},
 async export(){return JSON.stringify({format:'hope-wall-backup',version:1,messages:read().filter(r=>r.status==='approved')},null,2)},
 async import(raw){const incoming=parseBackup(raw);return lock(()=>{const current=read();const ids=new Set(current.map(r=>r.id));const fresh=incoming.filter(r=>!ids.has(r.id));if(current.length+fresh.length>500)throw Error('الاستيراد يتجاوز سعة 500 رسالة');write([...current,...fresh]);return fresh.length})},
 async reset(){return lock(()=>{area.removeItem(WALL_KEY);area.removeItem('hope-admin');emit()})},
 subscribe(fn){const changed=e=>{if(!e.key||e.key===WALL_KEY)fn()};events?.addEventListener('storage',changed);events?.addEventListener('hope-wall',fn);return()=>{events?.removeEventListener('storage',changed);events?.removeEventListener('hope-wall',fn)}}
 };
}
export const storage=createStorage({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v),removeItem:k=>localStorage.removeItem(k)},globalThis.window);
