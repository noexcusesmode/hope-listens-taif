// حالة تجارب مستقلة في الذاكرة؛ لا تُحفظ درجات أو قرارات الزوار.
export function createRound(items){
 return {index:0,chosen:null,correct:0,scores:[65,65,65,65],answers:[],
 get done(){return this.index>=items.length},
 choose(value){if(this.done||this.chosen!==null)return false;const item=items[this.index];
 const isFact=typeof item.truth==='boolean';if(isFact?typeof value!=='boolean':!Number.isInteger(value)||value<0||value>=item.choices.length)return false;
 this.chosen=value;const good=isFact?value===item.truth:value===item.best;this.correct+=good?1:0;this.answers.push(value);this.scores=this.scores.map((n,i)=>Math.max(0,Math.min(100,n+(good?[7,8,6,9]:[-4,-3,-4,-2])[i])));return true},
 next(){if(this.done||this.chosen===null)return false;this.index++;this.chosen=null;return true},
 reset(){this.index=0;this.chosen=null;this.correct=0;this.answers=[];this.scores=[65,65,65,65]}
 };
}
