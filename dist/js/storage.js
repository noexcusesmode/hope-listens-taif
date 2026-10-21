// واجهة قابلة للاستبدال بمحوّل Firestore. القفل المحلي ليس مصادقة إنتاجية.
const KEY='hope-wall-v1';
export const storage={
 async list(){try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(x=>x&&typeof x.text==='string')}catch{return []}},
 async submit(message){const list=await this.list();if(list.length>=500)throw Error('full');list.push({...message,id:crypto.randomUUID(),status:'pending'});localStorage.setItem(KEY,JSON.stringify(list));window.dispatchEvent(new Event('hope-wall'));},
 async moderate(id,status){let list=await this.list();list=status==='delete'?list.filter(x=>x.id!==id):list.map(x=>x.id===id?{...x,status}:x);localStorage.setItem(KEY,JSON.stringify(list));window.dispatchEvent(new Event('hope-wall'));},
 subscribe(callback){window.addEventListener('storage',callback);window.addEventListener('hope-wall',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('hope-wall',callback)}}
};
