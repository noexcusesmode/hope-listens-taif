// توليد QR محليًا؛ لا يُرسل الرابط إلى خدمة صور خارجية.
import QRCode from 'qrcode';
import fs from 'node:fs';
const url=process.argv[2];
if(!url||!/^https:\/\//.test(url))throw Error('استخدم: node scripts/qr.mjs https://your-public-site.example');
await QRCode.toFile('dist/assets/qr.svg',url,{type:'svg',errorCorrectionLevel:'M',margin:4,width:320,color:{dark:'#253c36',light:'#ffffff'}});
fs.writeFileSync('dist/assets/qr-target.txt',url+'\n');
console.log('QR saved to dist/assets/qr.svg');
