async function detect() {
  const text = document.getElementById("text").value;
  const res = await fetch("/detect", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({text})
  });
  const data = JSON.parse(await res.json().then(d=> d.body || JSON.stringify(d)));
  // fallback if direct
  const emotion = data.emotion || data.body && JSON.parse(data.body).emotion;
  const conf = data.confidence || "";
  document.getElementById("result").innerText = `Emotion: ${emotion} ${conf? '('+conf*100+'%)':''}`;
  
  // save history
  let hist = JSON.parse(localStorage.getItem("emoHistory")||"[]");
  hist.push({time: new Date().toLocaleTimeString(), emotion});
  localStorage.setItem("emoHistory", JSON.stringify(hist.slice(-10)));
  renderChart();
  document.getElementById("text").value = "";
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
let lastDetectedEmotion = localStorage.getItem('lastEmotion') || 'Neutral';
function new Date().toLocaleString(){
 let text = document.getElementById('journalText').value.trim();
 if(!text) return alert("Write something first!");
 let entry = { date: new Date().toLocaleDateString(), text, emotion: lastDetectedEmotion };
 let history = JSON.parse(localStorage.getItem('journal')||'[]');
 history.push(entry);
 localStorage.setItem('journal', JSON.stringify(history));
 document.getElementById('journalText').value = "";
 showHistory();
}
function showHistory(){
 let h=JSON.parse(localStorage.getItem('journal')||'[]');
 document.getElementById('journalHistory').innerHTML=h.map((e,i)=>`
  <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display=='none'?'block':'none'">
  <b>${e.date}</b> - ${e.emotion}</div><div style="display:none">${e.text}</div>`).join('');
}
function dayResult(){
 let hist=JSON.parse(localStorage.getItem('journal')||'[]');
 let today=new Date().toLocaleDateString();
 let t=hist.filter(h=>h.date.includes(today));
 let c={}; t.forEach(h=>c[h.emotion]=(c[h.emotion]||0)+1);
 let top=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||'Neutral';
 document.getElementById('dayResult').innerText=`Today: ${top}`;
}
