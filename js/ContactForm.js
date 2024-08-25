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

function HandleCallAction(){
    const number = localStorage.getItem('cached-number');
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    function formatPhoneNumber(number) {
        if (typeof number !== 'string' || number.length !== 10 || !/^\d{10}$/.test(number)) {
            throw new Error('Input must be a 10-digit number as a string');
        }
        const part1 = number.substring(0, 3);
        const part2 = number.substring(3, 6);
        const part3 = number.substring(6);
        return `${part1}-${part2}-${part3}`;
    }

    function redirectToDialer(phoneNumber) {
        let call_number = String(phoneNumber).replace(/\s+/g, '');
        if (call_number[0] == "+"){
            call_number = call_number.substring(2);
            if (isMobileDevice()) {
                const telURL = `tel:${call_number}`;
                window.location.href = telURL;
                return true;
            } else {
                const phoneWindow = document.getElementsByClassName('numberPlace')[0];
                if (phoneWindow){
                    phoneWindow.textContent = formatPhoneNumber(call_number);
                }
                return false;
            }   
        }
    }
    if(number){redirectToDialer(number);}
};

function PlacePhoneCallButton(){
    const ButtonWindow = document.getElementById('phoneCallSection');
    const number = localStorage.getItem('cached-number');
    const numberFound = String(number).includes('+1');
    if (ButtonWindow){
        ButtonWindow.innerHTML = `
                <div onclick="HandleCallAction();" class="PhoneCallWindow bubbly-button">
                    <p style="margin-top: -2px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9957b5" class="bi bi-telephone" viewBox="0 0 16 16">
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                        </svg>
                        <div style="width: 4px;"></div> 
                    </p>
                    <p class="numberPlace" id="PhoneNumberSection">Call Us</p>
                </div>
                <div style="height:27px;"></div>
            `;
    };
    if(!numberFound){
        const doAfter = (response)=>{
            if (response){
                localStorage.setItem('cached-number', response.phone_number)
            };
        };
        MakeRequest('GetCompanyContact/', null, 'GET', doAfter);
    }
}

const ShowContactForm = (closeTabFunction)=>{
    const window = document.getElementById('ContactWindow');
    const customName = localStorage.getItem('customerName');
    const customEmail = localStorage.getItem('customerEmail');
    if(String(customName).length){setTimeout(() => {animatedFill('customer-name', customName)}, 399);}
    if(String(customEmail).length){setTimeout(() => {animatedFill('customer-email', customEmail)}, 999);}
    if (window){
        MakeContactBackgroundWhite();
        const structure = `
            <div class="form-content">
                <div class="contact-container">
                    <div class="row align-items-stretch no-gutters contact-wrap">
                        <div style="max-height:650px;" class="col-md-12">
                        <div class="form h-100">
                            <h3>Contact Us</h3>
                            <div class="mb-5" method="post" id="contactForm" name="contactForm">
                            <div class="row">
                                <div class="col-md-6 form-group mb-3">
                                    <label for="" class="col-form-label">Name *</label>
                                    <input type="text" class="form-control" name="name" id="customer-name" placeholder="Your name">
                                    <div id="sender-name"></div>
                                </div>
                                <div class="col-md-6 form-group mb-3">
                                    <label for="" class="col-form-label">Email *</label>
                                    <input type="text" class="form-control" name="email" id="customer-email" placeholder="Your email">
                                    <div id="sender-email"></div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12 form-group mb-3">
                                    <label for="message" class="col-form-label">Message *</label>
                                    <textarea class="form-control" name="message" id="customer-message" cols="30" rows="4" placeholder="Write your message"></textarea>
                                    <div id="sender-message"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <input onclick="validateData(${closeTabFunction});" type="submit" value="Send Message" class="Custombtn btn-primary rounded-0 py-2 px-4">
                                    <span class="submitting"></span>
                                </div>
                            </div>
                            <label></label>
                            <div style="width: 100%; display: flex; justify-content: center;">
                                <smaller>
                                    or
                                </smaller>
                            </div>
                            <label></label>
                            <div id="phoneCallSection" style="width: 100%; display: flex; justify-content: right;"></div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        window.innerHTML = structure;
        setTimeout(() => {PlacePhoneCallButton();}, 99);
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

const indicateError = (field, add=true)=>{
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
    invalidField.innerHTML = add ? errorIcon : '';
};

const validateEmail = (email)=>/(^\w.*@\w+\.\w)/.test(email);

const validateData = (functionToClose)=>{
    const name = document.getElementById('customer-name');
    const email = document.getElementById('customer-email');
    const message = document.getElementById('customer-message');
    if (!name.value){indicateError('name'); return 0;}else{indicateError('name', false); localStorage.setItem('customerName', name.value)}
    if (!validateEmail(email.value)){indicateError('email'); return 0;}else{indicateError('email', false); localStorage.setItem('customerEmail', email.value)}
    if (!message.value){indicateError('message'); return 0;}
    const inquiry = {customer_name: name.value, customer_email:email.value, customer_question: message.value};
    showContactActionLoading();
    const SuccessAction = ()=>{LetKnowSuccess();if (functionToClose){setTimeout(() => {functionToClose();}, 2999);}}
    MakeRequest('RecordInquiry/', inquiry, 'POST', ()=>setTimeout(() => {SuccessAction()}, 499));
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
        <div id="ContactWindow">
            <div id="loader" style="transform: translate(-50%, -50%); top: 50%; left: 49%; position: absolute;" class="loader"></div>
        </div>
    `;
};

function GetContactForm(RemoveTab=null){
    const window = document.getElementById('MainContactWindow');
    if (window){
        importCSS('/static/css/brandAnimation.css')
        importCSS('/static/css/phone_call.css')
        importCSS('/static/contactCSS/masterCardAnimation.css', ()=>{
            window.innerHTML = GetBasicContactPlace();
        })
        importCSS('/static/contactCSS/contactMain.css', ()=>ShowContactForm(RemoveTab))
        importCSS('/static/contactCSS/validationStyles.css')
        importCSS('/static/css/successAnimation.css')
    }
}