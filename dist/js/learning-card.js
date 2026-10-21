// إحداثيات canvas فعلية تبدأ من اليسار؛ لا تتأثر باتجاه نص RTL.
export function logoBounds(width,height,image){
 const w=width*.14,h=w*image.naturalHeight/image.naturalWidth,margin=48;
 return {x:margin,y:height-margin-h,width:w,height:h};
}
export function loadCardLogo(url){
 return new Promise((resolve,reject)=>{
  const image=new Image();
  // الشعار محلي من نفس الأصل. anonymous قبل src يدعم CORS عند نقل الأصل لاحقًا.
  image.crossOrigin='anonymous';
  const timer=setTimeout(()=>reject(new Error('Logo loading timed out')),15000);
  image.onload=()=>{clearTimeout(timer);if(image.naturalWidth>0&&image.naturalHeight>0)resolve(image);else reject(new Error('Invalid logo'))};
  image.onerror=()=>{clearTimeout(timer);reject(new Error('Logo loading failed'))};
  image.src=url;
 });
}
export function drawLearningCard(ctx,logo,c){
 const width=1080,height=1260;
 ctx.fillStyle='#f1f5eb';ctx.fillRect(0,0,width,height);
 ctx.direction='rtl';ctx.textAlign='right';ctx.fillStyle='#285747';
 ctx.font='700 54px Thmanyah';ctx.fillText(c.title,990,130);
 ctx.font='400 30px Thmanyah';ctx.fillText(c.ui.learned,990,210);
 let y=305;ctx.fillStyle='#253c36';ctx.font='400 30px Thmanyah';
 for(const s of c.scenarios){let line='';for(const w of ('✦ '+s.skill).split(' ')){if(ctx.measureText(line+w).width>900){ctx.fillText(line,990,y);y+=47;line=''}line+=w+' '}ctx.fillText(line,990,y);y+=95}
 ctx.font='400 24px Thmanyah';ctx.fillText(c.ui.helpTitle,990,1160);
 // مساحة مستقلة أسفل النص: عرض 14%، هامش 48px من اليسار والأسفل، نسبة أصلية.
 const box=logoBounds(width,height,logo);
 ctx.drawImage(logo,box.x,box.y,box.width,box.height);
 return box;
}
