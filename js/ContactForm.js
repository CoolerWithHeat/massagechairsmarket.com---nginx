function animatedFill(inputfieldID, data){
    if (inputfieldID && data){
        const field = document.getElementById(inputfieldID);
        if (field){
            for (let i=0; i<data.length; i++){
                setTimeout(() => {
                    field.value = `${field.value}${data[i]}`;
                }, 59 * (i + 1));
            }
        }
    }
};


const ShowContactForm = (closeTabFunction)=>{
    const window = document.getElementById('ContactWindow');
    const customName = localStorage.getItem('customerName');
    const customEmail = localStorage.getItem('customerEmail');
    if(String(customName).length){setTimeout(() => {animatedFill('customer-name', customName)}, 399);}
    if(String(customEmail).length){setTimeout(() => {animatedFill('customer-email', customEmail)}, 999);}
    if (window){
        MakeContactBackgroundWhite();
        const structure = `
            <div class="contact1-pic js-tilt" data-tilt>
                <img src="/static/images/messageImage.png" alt="IMG">
            </div>

            <div class="contact1-form validate-form">
                <span class="contact1-form-title">
                    Get in touch
                </span>

                <div id="sender-name" class="wrap-input1 validate-input">
                    <input id="customer-name" class="input1" type="text" name="name" placeholder="Name">
                    <span class="shadow-input1"></span>
                </div>

                <div id="sender-email" class="wrap-input1 validate-input">
                    <input id="customer-email" class="input1" type="text" name="email" placeholder="Email">
                    <span class="shadow-input1"></span>
                </div>

                <div id="sender-message" class="wrap-input1 validate-input">
                    <textarea id="customer-message" class="input1" name="message" placeholder="Message"></textarea>
                    <span class="shadow-input1"></span>
                </div>

                <div class="container-contact1-form-btn">
                    <button onclick="validateData(${closeTabFunction});" class="contact1-form-btn">
                        <span>
                            Send Email
                            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
            </div>
        `
        window.innerHTML = structure;
    }
};

const LetKnowSuccess = (enableStatus=true) => {
    const alertWindow = document.getElementById('MainContactWindow');
    if (alertWindow)
        alertWindow.innerHTML =  `
            <main class="cd__main">
                <div class="main-container">
                <div class="check-container">
                    <div class="check-background">
                        <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="check-shadow"></div>
                </div>
                <h1 style="color:#ffffff;" class='display-6'>We'll reply soon</h1>
                </div>
            </main>
        `;
}

const showContactActionLoading = ()=>{
    const window = document.getElementById('MainContactWindow');
    window.innerHTML = GetBasicContactPlace();
};

const indicateError = (field)=>{
    const fieldIndecies = {
        name: 'sender-name',
        email: 'sender-email',
        message: 'sender-message',
    };
    const errorIcon = `
        <span class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
            </svg>
        </span>
    `;
    const invalidField = document.getElementById(fieldIndecies[field])
    invalidField.innerHTML += errorIcon;
};

const validateEmail = (email)=>/(^\w.*@\w+\.\w)/.test(email);

const validateData = (functionToClose)=>{
    const name = document.getElementById('customer-name');
    const email = document.getElementById('customer-email');
    const message = document.getElementById('customer-message');
    if (!name.value){indicateError('name'); return 0;}else{localStorage.setItem('customerName', name.value)}
    if (!validateEmail(email.value)){indicateError('email'); return 0;}else{localStorage.setItem('customerEmail', email.value)}
    if (!message.value){indicateError('message'); return 0;}
    const inquiry = {customer_name: name.value, customer_email:email.value, customer_question: message.value};
    showContactActionLoading();
    const SuccessAction = ()=>{LetKnowSuccess();if (functionToClose){setTimeout(() => {functionToClose();}, 2999);}}
    MakeRequest('RecordInquiry/', inquiry, 'POST', setTimeout(() => {SuccessAction()}, 499));
};

const MakeContactBackgroundWhite = ()=>{
    const window = document.getElementById('ContactWindow');
    if (window){
        window.style.background = '#fff';
    };
};

function GetBasicContactPlace(){
    const needsModified = JSON.parse(localStorage.getItem('requireModifiedContact')) || false;
    return  `
        <div style="min-width:100px;" id="ContactWindow" class="container-contact1 ContactWindow${needsModified ? '-modified' : ''}">
            <div id="loader" style="transform: translate(-50%, -50%); top: 50%; left: 50%; position: absolute;" class="loader"></div>
        </div>
    `;
}

function GetContactForm(RemoveTab=null){
    const window = document.getElementById('MainContactWindow');
    if (window){
        importCSS('/static/contactCSS/masterCardAnimation.css', ()=>{
            window.innerHTML = GetBasicContactPlace();
        })
        importCSS('/static/contactCSS/contactMain.css', ()=>ShowContactForm(RemoveTab))
        importCSS('/static/contactCSS/validationStyles.css')
        importCSS('/static/css/successAnimation.css')
    }
}