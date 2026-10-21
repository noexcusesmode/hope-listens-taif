import {config} from './config.js';
export const normalize=s=>s.normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
// للربط الحقيقي: استدعِ endpoint في خادمك هنا. لا تضع أي مفتاح API في المتصفح.
// يجب أن يطبق الخادم systemPrompt وضوابط السلامة وحدود المعدل قبل إرسال الطلب.
export async function getAIResponse(text){
 const s=normalize(text),r=config.replies;
 if(/انتح|ايذاء|اذي نفسي|اؤذي نفسي|اوذي نفسي|اقتل نفسي|اموت|الموت|انهي حياتي|ما ابي اعيش|ما ابغي اعيش|مش عايز اعيش|ما ابغى اعيش|suicid|kill myself|self.harm|end my life/i.test(s))return r.crisis;
 if(/جرع|تصنيع|اصنع|اشتري|شراء|اتعاط|استخدم.*مخدر|how.*(buy|make)|dose/i.test(s))return r.unsafe;
 if(/ارفض|رفض|ضغط الاصدقاء/.test(s))return r.refuse;
 if(/اعرف|علامات|يحتاج مساعد/.test(s))return r.signs;
 if(/صديق|صاحب/.test(s))return r.friend;
 if(/دعم|مساعد|اين|وين|علاج|تعافي/.test(s))return r.support;
 if(/مخاطر|اضرار|ادمان|مخدر/.test(s))return r.risk;
 return r.fallback;
}
export function validMessage(text){const s=normalize(text);return [...text].length>0&&[...text].length<=150&&!/(https?|www|@|\.com|\.net|[0-9٠-٩۰-۹]|[\u200B-\u200F\u202A-\u202E\u2066-\u2069])/i.test(s)&&![...config.moderation.blocked,...config.moderation.personal].some(w=>s.includes(normalize(w)));}
