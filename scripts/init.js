
let aiCounterRef = [];
let aiCounter = "";
let html = document.getElementById("stakeholder-content")

async function inits() {
  aiCounterRef = await getDataBaseElement("aicounter");
  aiCounter = Object.values(aiCounterRef)
  aiNumber = aiCounter[0].count
  if (aiNumber < 10) {
    html.innerHTML = initWelcomeTemplate(aiNumber)
  } else {
  html.innerHTML = initLimitWelcomeTemplate(aiNumber)
  }
}




function continueProcess(aiNumber){
  html.innerHTML = initHowToTemplate(aiNumber)
}

function rewindProcess(aiNumber){
  html.innerHTML = initWelcomeTemplate(aiNumber)
}
