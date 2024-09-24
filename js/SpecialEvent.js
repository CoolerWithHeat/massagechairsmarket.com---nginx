const desktopStructure = ({title, left_image, right_image, mobile_image, offer_amount, offer_code})=> {
    const titleData = title.split(' ');
    const promotionTitle = `<h1 class="promotion_header">${titleData[0]}</h1>`;
    let childTitles = titleData.length > 1 ? titleData.slice(1) : '';
    if (Array.isArray(childTitles)){childTitles = childTitles.map(each_child=>`<h1 class="promotion_header_child">${each_child}</h1>`)};
    return `
            <div class="promotion-container" id="containerPromotion">
                <div class="image-wrapper">
                    <img class="image1" src="${left_image}" alt="Comfort Chair">
                </div>
                <img class="torn-image" src="/images/trial2.png" alt="Torn Banner">
                <div class="torn-image-data">
                    <div style="text-align: center; color: #4a4a4a; padding: 20px;">
                        <div class="promotion_titles">
                            ${promotionTitle}
                            ${childTitles ? childTitles.join('') : ''}
                        </div>
                        <hr style="background-color: #4b4b4b; width: 200px; border-width: 2px; margin:auto; margin-top:10px;">
                        <p class="discount_amount">$${Number(offer_amount)}</p>
                        <p class="discount_sign">OFF</p>
                        <p id="promotion_details">
                        <br>
                        <small style="font-size: 25px; font-style: normal; font-weight: bold;">+</small><br>
                        <p class="benifits">Free Shipping</p>
                        <p class="benifits">Tax-free</p>
                        </p>
                        <hr style="background-color: #4b4b4b; width: 190px; border-width: 1px; margin:auto; margin-top:10px;">
                        <p style="font-size: 13px; color: black; font-family: 'Courier Prime';">use code</p>
                        <p style="font-size: 30px; color: #74665e; font-family: 'Norwester', sans-serif; text-transform: uppercase;">${String(offer_code)}</p>
                        <p style="font-size: 14px; font-family: 'Courier Prime';">at checkout</p>
                    </div>
                </div>
                <div style="left:7px;" class="limited-time">Limited Time</div>
                <div id="closeEventTrigger" class="close-window">
                    <svg style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="brown" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
                <div class="image-wrapper">
                    <img class="image2" src="${right_image}" alt="White Chair">
                </div>
            </div>
        `;
    }

const mobileStructure = ({title, left_image, right_image, mobile_image, offer_amount, offer_code})=>{
    const titleData = title.split(' ')
    const promotionTitle = `<h1 class="promotion-header">${titleData[0]}</h1>`;
    let childTitles = titleData.length > 1 ? titleData.slice(1) : '';
    if (Array.isArray(childTitles)){childTitles = childTitles.map(each_child=>`<h1 class="promotion_header_child">${each_child}</h1>`)}
    return  `
            <div class="mobile-container" id="mobileContainerPromotion">
                <img class="mobile-image" src="${mobile_image}" alt="Massage Chair">
                <img class="torn-paper" src="/images/trial2.png" alt="Torn Paper Effect">
                <div class="mobile-content">
                    ${promotionTitle}
                    ${childTitles ? childTitles.join('') : ''}
                <hr style="background-color: #4b4b4b; width: 185px; border-width: 2px; margin:auto;">
                <p class="discount-amount">$${Number(offer_amount)}</p>
                <p class="discount-sign">OFF</p>
                <p class="promotion-details">
                    <span class="addition_sign">+</span><br>
                    Free Shipping<br>
                    Tax-free<br>
                </p>
                <hr style="background-color: #4b4b4b; width: 160px; border-width: 1px; display:block; margin:auto;">
                <p class="small-text">use code</p>
                <p class="promo-code">${String(offer_code)}</p>
                <p class="small-text">at checkout</p>
                </div>
                <div class="limited-time">Limited Time</div>
                <div id="closeEventTrigger" class="close-window">
                    <svg style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="brown" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>
        `; 
    }



function SpecialEventOperator(onMobile, offerProperties, callback){
    const title = offerProperties.called;
    const left_image = offerProperties.left_image;
    const right_image = offerProperties.right_image;
    const mobile_image = offerProperties.mobile_image;
    const offer_amount = offerProperties.offer_amount;
    const offer_code = offerProperties.offer_code;
    const validOffer = title && left_image && right_image && mobile_image && offer_amount && offer_code;
    if (!validOffer){return null;}
    const promotionData = {title, left_image, right_image, mobile_image, offer_amount, offer_code};
    const structure = onMobile ? mobileStructure(promotionData) : desktopStructure(promotionData);
    const EventWindow = document.getElementById('OfferPanel');
    function ListenCustomerBehaviour(){
        const closeButton = document.getElementById('closeEventTrigger');
        const closePromotion = ()=>{
            promotionBlur(false);
            EventWindow.classList.add('FadeSlowly')
            setTimeout(() => {
                EventWindow.removeAttribute('style');
                EventWindow.classList.remove('FadeSlowly');
                EventWindow.innerHTML = '';
                EventWindow.style.display = 'none';
                promotionBlur(false);
            }, 699);
        };
        if (closeButton){
            closeButton.addEventListener('click', ()=>{
                closePromotion();
            })
        }else{
            setTimeout(() => {
                closePromotion();
            }, 2999);
        };
    };
    if (EventWindow){
        const deviceWidth = window.innerWidth;
        const bannerHeight = (deviceWidth  > 1200) ? 1100 : 900;
        EventWindow.style.display = 'none';
        const font_dependencies = [['https://fonts.cdnfonts.com/css/norwester', 'Norwester'], ['https://fonts.cdnfonts.com/css/courier-prime', 'Courier Prime']];
        font_dependencies.forEach(each=>{
            const font_url = each[0];
            const font_name = each[1];
            importCSS(font_url)
        })
        EventWindow.innerHTML = structure;
        EventWindow.classList.remove('HideIt');
        EventWindow.removeAttribute('style')
        if(onMobile){EventWindow.style.display = 'block'};
        if(!onMobile){EventWindow.style.width = `${bannerHeight}px`};
        setTimeout(() => {
            ListenCustomerBehaviour(EventWindow);
        }, 499);
        setTimeout(() => {
            promotionBlur();
            callback();
        }, 1999);
    }
};

function promotionBlur(blur = true) {
    let overlay = document.getElementById('overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '1';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
    }
    if (blur) {
        overlay.style.display = 'block';
        overlay.style.backdropFilter = 'blur(2px)';
        overlay.style.animation = 'fadeIn 0.4s ease-in-out forwards';
    } else {
        overlay.style.animation = 'fadeOut 0.4s ease-in-out';
        setTimeout(() => overlay.style.display = 'none', 400);
    }
}

const showPromotion = (offerData, callback)=>{
    const mobileVisitor = window.innerWidth < 900;
    const stylings = {true : '/static/css/promotionMobile.css', false: '/static/css/special_event_desktop.css'};
    const bannerStyles = stylings[mobileVisitor];
    const setPromotionEvent = ()=>{
        const openPromotion = ()=>SpecialEventOperator(mobileVisitor, offerData, callback);
        if(offerData.show_on_scroll){
            window.removeEventListener('scroll', checkScrollPosition);
            function checkScrollPosition() {
                if (window.scrollY > 0) {
                    openPromotion();
                    window.removeEventListener('scroll', checkScrollPosition);
                }
            }
            window.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('load', checkScrollPosition);
        }else{
            openPromotion();
        };
    }
    importCSS(bannerStyles, ()=>setPromotionEvent())
};