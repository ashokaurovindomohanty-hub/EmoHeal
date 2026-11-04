async function detect() {
  const text = document.getElementById("text").value;
  if(!text.trim()) return;
  const res = await fetch("/detect", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({text}) });
  const raw = await res.json();
  const data = raw.body ? JSON.parse(raw.body) : raw;
  const emotion = data.emotion || "Neutral";
  const conf = data.confidence ? Math.round(data.confidence*100) : "";
  document.getElementById("result").innerText = `Emotion: ${emotion} ${conf? '('+conf+'%)':''}`;
  const tips = {Joy:"Keep shining! Share your joy.", Sadness:"Try a 5-min walk + deep breaths.", Anger:"Pause, breathe 4-4-4.", Fear:"Ground yourself: 5 things you see.", Surprise:"Embrace the new!", Love:"Express gratitude today.", Neutral:"Reflect for 2 mins."};
  document.getElementById("coaching").innerText = tips[emotion] || tips.Neutral;
  let hist = JSON.parse(localStorage.getItem("emoHistory")||"[]");
  hist.push({time:new Date().toLocaleTimeString(), emotion, date:new Date().toLocaleDateString()});
  localStorage.setItem("emoHistory", JSON.stringify(hist.slice(-10)));
  let streak = parseInt(localStorage.getItem("streak")||"0")+1;
  localStorage.setItem("streak", streak);
  document.getElementById("streak").innerText = "🔥 Streak: "+streak+" days";
  renderChart();
  document.getElementById("text").value="";
}
function renderChart(){
  let hist = JSON.parse(localStorage.getItem("emoHistory")||"[]");
  const div = document.getElementById("history");
  if(!div) return;
  div.innerHTML = "<h3>History</h3>" + hist.map(h=> `<span>${h.time}: <b>${h.emotion}</b></span>`).join("<br>");
}
window.onload = renderChart;
let chart;
function renderChart(){
  let hist = JSON.parse(localStorage.getItem("emoHistory")||"[]");
  const div = document.getElementById("history");
  if(div) div.innerHTML = "<h3>History</h3>" + hist.map(h=> `<span>${h.time}: <b>${h.emotion}</b></span>`).join("<br>");
  
  const counts = {};
  hist.forEach(h=> counts[h.emotion]=(counts[h.emotion]||0)+1);
  const ctx = document.getElementById("emoChart");
  if(!ctx) return;
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{ label: 'Emotions', data: Object.values(counts), backgroundColor: '#ff8a00' }]
    },
    options: { plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true,ticks:{stepSize:1}}} }
  });
}
function saveJournal(){
 try{
  let el=document.getElementById('journalText');
  let text=el.value.trim(); if(!text) return alert("Write something!");
  let hist=JSON.parse(localStorage.getItem('journal')||'[]');
  hist.push({date:new Date().toLocaleString(), text:text, emotion: (typeof lastDetectedEmotion!=='undefined' && lastDetectedEmotion) ? lastDetectedEmotion : 'Neutral'});
  localStorage.setItem('journal', JSON.stringify(hist));
  el.value="";
  showHistory(); dayResult(); happyGraph();
 }catch(e){ alert("Save error: "+e.message); }
}
function showHistory(){ 
 let hist=JSON.parse(localStorage.getItem('journal')||'[]'); 
 let box=document.getElementById('historyBox'); if(!box) return; 
 if(!hist.length){box.innerHTML="No entries yet"; return;} 
 let groups={}; hist.forEach(h=>{let d=h.date.split(',')[0]; if(!groups[d])groups[d]=[]; groups[d].push(h);}); 
 let html=""; 
 Object.keys(groups).reverse().forEach(d=>{ 
  html+=`<div style="margin:8px 0;"><b style="cursor:pointer;color:#ff8a00" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">${d} (${groups[d].length})</b> <button onclick="deleteDate('${d}')" style="font-size:11px;padding:2px 6px;border-radius:6px;border:1px solid #ff8a00;background:#fff;color:#ff8a00;cursor:pointer;margin-left:8px;">Clear</button><div style="display:none;padding-left:12px;">`; 
  groups[d].forEach(e=>{html+=`<div>${e.date} - ${e.emotion}: ${e.text}</div>`}); 
  html+=`</div></div>`; 
 }); 
 box.innerHTML=html; 
}
function deleteDate(dateStr){
 if(!confirm("Delete all entries for "+dateStr+" ?")) return;
 let hist=JSON.parse(localStorage.getItem('journal')||'[]');
 hist=hist.filter(h=> !h.date.startsWith(dateStr));
 localStorage.setItem('journal',JSON.stringify(hist));
 showHistory(); dayResult(); happyGraph();
}
function dayResult(){
 let hist=JSON.parse(localStorage.getItem('journal')||'[]');
 let today=new Date().toLocaleDateString();
 let t=hist.filter(h=>h.date.includes(today));
 let c={}; t.forEach(h=>c[h.emotion]=(c[h.emotion]||0)+1);
 let top=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||'Neutral';
 document.getElementById('dayResult').innerText=top?`Today: ${top}`:'';
}
dayResult();
function happyGraph(){
 try{
  let hist=JSON.parse(localStorage.getItem('journal')||'[]');
  let ctx=document.getElementById('happyChart'); if(!ctx) return;
  if(!hist.length) return;
  let days={}; hist.forEach(h=>{let d=h.date.split(',')[0]; if(!days[d])days[d]={t:0,j:0}; days[d].t++; if(h.emotion==='Joy')days[d].j++;});
  let labels=Object.keys(days).slice(-7); let vals=labels.map(d=>Math.round(days[d].j/days[d].t*100));
  if(window.hChart) window.hChart.destroy();
  window.hChart=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Happy %',data:vals,borderColor:'#ff8a00',tension:0.3}]},options:{scales:{y:{beginAtZero:true,max:100}}}});
 }catch(e){console.log(e)}
}
