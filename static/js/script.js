async function detect() {
  const text = document.getElementById("text").value;
  const res = await fetch("/detect", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({text})
  });
  const data = await res.json();
  document.getElementById("result").innerText = `Emotion: ${data.emotion || data.body}`;
}
