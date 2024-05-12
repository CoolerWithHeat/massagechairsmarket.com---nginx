const GetOfferId = ()=>{
    const refusalIcon = document.getElementById('FirstOfferRefusal');
    offer_id = refusalIcon ? refusalIcon.getAttribute('data-id') : null;
    return offer_id;
};

function PriorityPanel(data=null, enable=true, closed_immediately=false){
    const panel = document.getElementById('OfferPanel');
    if (data && enable){
        panel.innerHTML = data;
        panel.classList.remove('HideIt');
    }
    if (!enable){
        panel.classList.add('DeanimatedAppear')
        setTimeout(() => {
            panel.innerHTML = '';
            panel.classList.add('HideIt');
        }, 449);
        offer_id = GetOfferId();
        UserPreference({was_force: false, offer_id: Number(offer_id)}, false);
        setTimeout(() => {
            panel.classList.add('HideIt');
        }, 499);
    }
    if (closed_immediately){
        offer_id = GetOfferId();
        UserPreference({was_force: true, offer_id: Number(offer_id)}, false);
    }
}

function storeUserInfo(forcefullyClosed) {
    const currentTime = Date.now();
    const userInfo = {
        forcefully_closed: forcefullyClosed.was_force,
        recorded_time: currentTime,
        offer_id: forcefullyClosed.offer_id,
    };
    const userInfoJSON = JSON.stringify(userInfo);
    localStorage.setItem('userInfo', userInfoJSON);
}

function getUserInfo() {
    const userInfoJSON = localStorage.getItem('userInfo');
    if (userInfoJSON) {
            const userInfo = JSON.parse(userInfoJSON);
            return userInfo;
        } else {
            return {};
        }
    }

    const UserPreference = (data, Retrieve=false)=>{
    const dataNeeded = Retrieve ? getUserInfo() : storeUserInfo(data);
    return dataNeeded;
};

const HandleSuccessDiscount = (serverResponse)=>{
    const email_registered = serverResponse.registered_email;
    const offer_id = serverResponse.discount.id;
    const discount_code = serverResponse.discount.discount_code
    PlaceDiscountSuccess(serverResponse.discount)
    saveSuccess(offer_id, email_registered, discount_code)
};

function SubmitIfGood() {
    const data = document.querySelector('#e-mail');
    if (/(^\w.*@\w+\.\w)/.test(data.value)) {
        const entered_email = {'email': data.value};
        const priceWindow = document.getElementById('PricePoint');
        appendLoading(priceWindow);
        MakeRequest('RegisterCustomer/', entered_email, 'POST', (dataReceived)=>{setTimeout(() => {HandleSuccessDiscount(dataReceived);}, 399);});
    } else {
        const update = document.querySelector('.emailbutton');
        update.value = 'Keep Going...';
    }
};

const HandleEmailEvent = ()=>{
    const email = document.querySelector('#e-mail');
    const update = document.querySelector('.emailbutton');

    email.addEventListener('input', inputEmail);

    function inputEmail(e) {
        const input = e.target.value;
        if (input && /(^\w.*@\w+\.\w)/.test(input)) {
            update.textContent = 'Valid Email!';
            update.classList.add('success');
            update.classList.remove('failure');
            update.value = 'GET IT NOW!';
        } else {
            update.value = 'Keep Going...';
            update.classList.remove('success');
            update.classList.add('failure');
        }
    };
};

const appendLoading = (windowToGo)=>{
    const loading = '<div id="status-loader" class="loader"></div>';
    windowToGo.innerHTML = loading;
};

function saveSuccess(offer_id, email_registered, discount_code){
    const actionData = {offer_id: Number(offer_id), was_successful:true, email:email_registered, discount_code: discount_code};
    localStorage.setItem('lastSuccessfulOperation', JSON.stringify(actionData));
}

function PlaceDiscountSuccess(discountParams={}){
    const code = discountParams.discount_code;
    UserPreference({was_force: false, offer_id: Number(discountParams.id)}, false);
    const structure = `
        <div class="wholeoffercard">
            <div class="container">
                <div class="row justify justify-content-center">
                    <div class="col-12 col-lg-9 col-xl-8">
                        <form class="">
                            <div class="offer-card">
                                <div id="cancelDiv">
                                    <svg onclick='PriorityPanel(false, false)' xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-9 col-11">
                                        <h6 class="text-center smaller">Congratulations!</h6>
                                    </div>
                                    <div class="discountdetails" style="width: 80%;">
                                        <div>
                                            <input id="DiscountHolder" class='underlinedInput' maxlength='7' value='${code}'/>
                                        </div>
                                        <div>
                                            <button onclick='copyToClipboard(event);' type="button" class="btn btn-outline-light">Copy</button>
                                        </div>
                                    </div>
                                    <div class="form-group row justify-content-center mb-0">       
                                        <div class="col-md-12 px-3">
                                            <p class="conditions">You can use this discount code on any product in our store once.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    `
    if (code){
        const MessageWindow = document.getElementById('OfferPanel')
        if (MessageWindow)
            MessageWindow.innerHTML = structure
            TriggerConfetti(75, true);
    }
}

function ShowDiscountOffer(discount_information){
    const discount_id = discount_information.id;
    const discount_amount = discount_information.discount_amount;
    const discount_type = discount_information.discount_type;
    const discount_representation = discount_type == 'fixed' ? `$${discount_amount}` : `${discount_amount}%`;
    const structure = `       
        <div class="wholeoffercard animatedAppear">
            <div class="offer-container">
                <div class="row justify justify-content-center">
                            <div class="offer-card">
                                <div id="cancelDiv">
                                    <svg id='FirstOfferRefusal' data-id='${discount_id}' onclick='PriorityPanel(event, false, true)' xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-9 col-11">
                                        <div class="row mt-0">
                                            <div class="col-md-12 ">
                                                <p class="text-center sub-heading1">enter your email and get</p>
                                            </div>
                                        </div>
                                        <div class="row mt-0">
                                            <div id='PricePoint' class="col-md-12 ">
                                                <h4 class="text-center heading">${discount_representation} off</h4>
                                            </div>
                                        </div>
                                        <div class="row mt-0">
                                            <div class="col-md-12 ">
                                                <br>
                                            </div>
                                        </div>
                                        <div class="form-group row mb-3">
                                            <div class="col-8 mb-0 px-0 pr-2">
                                                <input id="e-mail" type="text" placeholder="Enter your email here" name="email" class="form-control input-box rm-border text-left">
                                            </div>
                                            <div class="col-4 px-0">
                                                <input onclick='SubmitIfGood();' type="submit" value="GET IT NOW!" class="btn btn-block btn-green rm-border emailbutton">
                                            </div>
                                        </div>
                                        <div class="form-group row justify-content-center mb-0">       
                                            <div class="col-md-12 px-3 mt-2">
                                                <p data-id='${discount_id}' onclick='PriorityPanel(event, false, true)' class="thanks">no thanks</p>
                                            </div>
                                        </div>
                                        <div class="form-group row justify-content-center mb-0">       
                                            <div class="col-md-12 px-3">
                                                <p class="conditions">First time registerants only. Entering your email makes you eligible to receive future promotional emails.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
        `;
        setTimeout(() => {
            HandleEmailEvent();
        }, 333);
        PriorityPanel(structure);
};

function copyToClipboard(event) {
    const button = event.target;
    const discount = document.getElementById('DiscountHolder');
    discount.select();
    discount.setSelectionRange(0, 99999);
    try {
        navigator.clipboard.writeText(discount.value)
            .then(() => {
                button.style.fontSize = '10px';
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.style.fontSize = '16px';
                    button.textContent = 'Copy';
                }, 799);
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
                copyToClipboardFallback(discount.value, button);
            });
    } catch (err) {
        copyToClipboardFallback(discount.value, button);
    }
}

function copyToClipboardFallback(text, button) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.error('Unable to copy text: ', err);
    }
    document.body.removeChild(textarea);
    button.style.fontSize = '10px';
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.style.fontSize = '16px';
        button.textContent = 'Copy';
    }, 799);
}

const TriggerConfetti = (spreadAmount=66)=>{
    confetti({
        particleCount: 450,
        spread: spreadAmount,
        origin: { y: 0.6 },
    });
};

function checkIfThreeDaysPassed(userInfo) {
    const recordedTime = userInfo.recorded_time;
    const currentTime = Date.now();
    const minutesPassed = Math.floor((currentTime - recordedTime) / (1000 * 60));
    const minutesInThreeDays = 3 * 24 * 60;
    return minutesPassed >= minutesInThreeDays;
}

function calculateMinutesPassed(userInfo) {
    const recordedTime = userInfo.recorded_time;
    const currentTime = Date.now();
    const timeDifference = currentTime - recordedTime;
    const minutesPassed = Math.floor(timeDifference / (1000 * 60));
    return minutesPassed;
}

const LastTimeRetrieved = (discount_id=null)=>{
    let past_operation = localStorage.getItem('lastSuccessfulOperation')
    past_operation = past_operation ? JSON.parse(past_operation) : null
    console.log(past_operation)
    if (past_operation && discount_id){
        return Number(past_operation.offer_id) === Number(discount_id);
    }
    return false
};

function DecideIfDiscountNeeded(offer){
    let previously_acted = localStorage.getItem('userInfo');
    console.log(previously_acted);
    previously_acted = previously_acted ? JSON.parse(previously_acted) : null;
    if (previously_acted){
        const offer_id = Number(offer.id);
        const PreviouslyRetrieved = LastTimeRetrieved(offer_id);
        console.log(PreviouslyRetrieved);
        const TheSameOffer = Number(previously_acted.offer_id) === offer_id;
        const ThreeDaysPassed = checkIfThreeDaysPassed(previously_acted);
        if (previously_acted.forcefully_closed && TheSameOffer && ThreeDaysPassed){
            ShowDiscountOffer(offer);
        }else{
            if (!TheSameOffer)
                ShowDiscountOffer(offer);
        }
    }else{
        ShowDiscountOffer(offer);
    }
};