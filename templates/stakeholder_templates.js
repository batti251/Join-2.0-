

function initWelcomeTemplate(aiNumber) {
    return `
<div class="container-wrap stakeholder-wrap">
<div class="stakeholder-headline">
  <div class="headline-navigate">
  <a href="./../index.html" class="arrow-left">
              <img src="../assets/icons/arrow-left.svg" alt="">
            </a>
  <span> <strong>${aiNumber}</strong> / <strong>10</strong> requests used today</span>
</div>
 <h1>Welcome</h1>
</div>
<h2>Easily create a ticket by sending an email - no extra steps needed.</h2>
<div class="figure">
    <img src="./../assets/icons/triage_kanban_request.svg" alt="">
<div class="paragraph">
<p>On this platform, you can submit your feature requests via email. 
    Our AI system will automatically generate a ticket with a deadline and priority level. 
</p>
<p>A total of 10 requests can be created per day. 
    After this limit, emails can still be sent, but they will be manually reviewed by our team instead of generating AI tickets.</p>
</div>
</div>
<button class="btn-highlight btn-stakeholder" onclick="continueProcess(${aiNumber})">Continue</button>
</div>` 

}

function initLimitWelcomeTemplate(aiNumber) {
    return `
     <div class="container-wrap stakeholder-wrap">
<div class="stakeholder-headline">
  <div class="headline-navigate">
  <a href="./../index.html" class="arrow-left">
              <img src="../assets/icons/arrow-left.svg" alt="">
            </a>
  <span id="ai-requests"> <strong>${aiNumber}</strong> / <strong>10</strong> requests used today</span>
</div>
 <h1>Welcome</h1>
</div>
<div class="ai-limit">The daily 10-request limit has been reached!</div>
<div class="figure">
    <img src="./../assets/icons/triage_kanban_alternative.svg" alt="">
<div class="paragraph">
<p>Need more? No worries - you can still send your request, but our team will review them manually instead of using AI to create tickets. 
</p>
<p>Click on the <strong class="mail-hover">Mail-Button</strong> to send and email!
  This will launch your default E-Mail-program.
</p>

<p>Or click on the <strong class="form-hover">Form-Button</strong> to fill our Form!
  This will open a new Tab in your Browser.
</p>
</div>
</div>
<div class="btn-group">
<button class="btn-highlight btn-stakeholder form-hover"><a href="./request.html" target="_blank" rel="noopener noreferrer">Request per Form</a><img src="" alt=""></button>
<button class="btn-highlight btn-stakeholder mail-hover"><a href="mailto:bastibuenz25@gmail.com">Request per Mail</a></button>
</div>
</div>
    `
}


function initHowToTemplate(aiNumber) {
    return `
    

<div class="container-wrap stakeholder-wrap">


<div class="stakeholder-headline">
  <div class="headline-navigate">
  <button class="arrow-left" onclick="rewindProcess(${aiNumber})"><img src="../assets/icons/arrow-left.svg" alt=""/></button>
 
  <span><strong>${aiNumber}</strong> / <strong>10</strong> requests used today</span>
</div>
 <h1>Choose your type of request</h1>
</div>


<h2>Write an E-Mail or use our embedded Form</h2>

<div class="figure">
    <img src="./../assets/icons/triage_kanban_request.svg" alt="">

<div class="paragraph">
<p>When you prefer writting an email click on the <strong class="mail-hover">Mail-Button</strong> below!
  This will launch your default E-Mail-program.
</p>

<p>Otherwise click on the <strong class="form-hover">Form-Button</strong> to fill our Form!
  This will open a new Tab in your Browser.
</p>
</div>
</div>

<div class="btn-group">
<button class="btn-highlight btn-stakeholder form-hover"><a href="./request.html" target="_blank" rel="noopener noreferrer">Request per Form</a><img src="" alt=""></button>
<button class="btn-highlight btn-stakeholder mail-hover"><a href="mailto:bastibuenz25@gmail.com">Request per Mail</a></button>
</div>
</div>

    `
}