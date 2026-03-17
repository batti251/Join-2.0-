

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
<button class="btn-highlight btn-stakeholder form-hover" onclick='openDialogModal("dialog")'>Request per Form</button>
<button class="btn-highlight btn-stakeholder mail-hover"><a href="mailto:joincollector.buenz@gmail.com?subject=Join: New Request">Request per Mail</a></button>
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
<button class="btn-highlight btn-stakeholder form-hover" onclick='openDialogModal("dialog")'>Request per Form</button>
<button class="btn-highlight btn-stakeholder mail-hover"><a href="mailto:joincollector.buenz@gmail.com?subject=Join: New Request">Request per Mail</a></button>
</div>
</div>

    `
}

function openDialogTemplate() {
  return `
  <dialog id="dialog" class="dialog">
  <div class="closebar">
          <button class="close-icon-overlay" onclick='closeDialog("dialog")'>
            <img src="../assets/icons/close.svg" aslt="close" class="close-icon"/>
          </button>
        </div>
        <form onsubmit='sendMail(event)' novalidate action="/sendMail.php" class="mail-request">
        <h1>Request Form</h1>
        <div class="input-container">
              <div class="input-content">
                <input class="validate" placeholder="Your Name" type="text" name="name" required pattern="([\\s\\S]*\\S){2,}[\\s\\S]*" />
              </div> 
              <div id="user-existance-error" class="login-error validation opacity-0"> This Field is required!</div>
            </div>

            <div class="input-container">
              <div class="input-content">
                <input class="validate" placeholder="Your Mail" type="email" name="email" required pattern="^[a-zA-Z0-9._%+\\-]+@([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"  />
              </div> 
              <div id="user-existance-error" class="login-error validation opacity-0"> Please enter a valid email!</div>
            </div>
            
            <div class="input-container">
              <div class="input-content">
                <input class="validate" placeholder="Subject" type="text" name="subject" required pattern="([\\s\\S]*\\S){2,}[\\s\\S]*" />
              </div> 
              <div id="user-existance-error" class="login-error validation opacity-0">Please enter a subject!</div>
            </div>

                <select name="request-type" class="request-select">
                    <option  class="task-input-dropdown" value="technical-task">Technical Task</option>
                    <option  class="task-input-dropdown" value="user-story">User Story</option>
                </select>

                <div class="textblock-wrap">
                <div class="textblock">
                <textarea class="validate" placeholder="Enter your Text here" name="body" minlength="5" pattern="([\\s\\S]*\\S){5,}[\\s\\S]*" required></textarea>
                </div>
                <div id="user-existance-error" class="login-error validation opacity-0"> This Field is required!</div>
                </div>

                <button class="btn-primary" type="submit">Send</button>
              </form>
            </dialog>
  `
}


function messageSuccess() {
  return `
  <div class="message">
  <span>Thank you! Your form has been sent!</span>
  <svg class="checkmark" viewBox="0 0 52 52" aria-hidden="true">
    <path
      d="M14 27 L22 35 L38 18"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>
  `
}

function messageError() {
  return `
  <div class="message">
  <span>Ooops, something went wrong.. Please try again</span>
</div>
  `
}