
let aiCounterRef = [];
let aiCounter = "";

async function inits() {
  let id = document.getElementById('ai-requests')
  aiCounterRef = await getDataBaseElement("aicounter");
  aiCounter = Object.values(aiCounterRef)
  aiNumber = aiCounter[0].count
  console.log(aiCounter[0]);
  id.innerHTML = aiNumber
  
}