function createSlug(title) {return title.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');}
const available = (functionName) => typeof window[functionName] === 'function';
let newCustomersDiscount = null;
window.addEventListener('load', function() {
    var cover = document.querySelector('.cover');
    if (cover) {
        var imageSrc = cover.getAttribute('data-image');
        new Parallax(cover, {
            imageSrc: imageSrc,
            zIndex: '1'
        });
    }

    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.transition = 'opacity 600ms';

        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.visibility = 'hidden';
                preloader.style.display = 'none';
            }, 300);
        }, 0);
    }
});

function AnimateLogo() {
    const logoPointElement = document.getElementById('LogoPoint');
    if(logoPointElement){
        logoPointElement.classList.add('animateBrand');
        setTimeout(() => {
            logoPointElement.classList.remove('animateBrand');
        }, 999);
    }
}

setTimeout(() => {localStorage.setItem('requireModifiedContact', String(window.location.pathname).includes('/Order/'))}, 99);
const host = window.location.protocol + "//" + window.location.host + '/serverdestination/'
const productLine = document.getElementsByClassName('productsuggestion')[0];

let startX = null;
let scrollLeft = null;
let isScrolling = false;

productLine.addEventListener('mousedown', (e) => {
    startX = e.pageX - productLine.offsetLeft;
    scrollLeft = productLine.scrollLeft;
    isScrolling = true;
    smoothScroll();
});

productLine.addEventListener('mouseleave', () => {isScrolling = false;});
productLine.addEventListener('mouseup', () => {isScrolling = false;});

productLine.addEventListener('mousemove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - productLine.offsetLeft;
    const walk = (x - startX) * 2;

    productLine.scrollLeft = scrollLeft - walk;
}); 

function smoothScroll() {
    if (!isScrolling) return;
    requestAnimationFrame(smoothScroll);
    productLine.scrollLeft += (scrollLeft - productLine.scrollLeft) * 0.1;
}

function getScrollWidth() {
    const displaySize = window.innerWidth;
    if (displaySize < 450) {
        return 340
    } else {
        return 375
    }
}

function Popup(enable=true, divToPrepare=null){
    importCSS('/static/css/reusablePopup.css')
    const PopupWindow = document.getElementById('Popup') || document.getElementById('Popup-active');
    const PopupBasicContent = `
        <div class="Popupclosetrigger">
            <svg style="margin-left: -4px; margin-top:2px; cursor:pointer;" onclick="Popup(false);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
        </div>
        <div class="Popupcontent">${divToPrepare || ''}</div>
    `
    if(PopupWindow && enable){
        PopupWindow.style.animation = '';
        PopupWindow.setAttribute('id', 'Popup-active');
        PopupWindow.innerHTML = PopupBasicContent;
    }
    if (PopupWindow && !enable){
        setTimeout(() => {
            PopupWindow.style.animation = 'fadeOut 0.5s forwards';
        }, 0);
        setTimeout(() => {
            PopupWindow.setAttribute('id', 'Popup');
        }, 499);
    }
}

function OpenContactForm(event){
    if (event){event.preventDefault()}
    window.recordEvent('button', 'contact popup')
    Popup(true, '<div id="MainContactWindow"></div>')
    importScript('static/js/ContactForm.js', ()=>GetContactForm(()=>Popup(false)))
}

function scrollWindow(specified_direction) {
    const productLine = document.getElementsByClassName('productsuggestion')[0];
    const displayWidth = getScrollWidth();
    const directionOf = {
        'left': 0 - displayWidth,
        'right': displayWidth,
    }
    productLine.scrollLeft += directionOf[specified_direction];
}

const scrollContainer = document.getElementsByClassName('productsuggestion')[0];
scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        scrollContainer.scrollTop = 0;
    }
});


function isInViewport(element) {
    const bounding = element.getBoundingClientRect();
    return (
        bounding.bottom <= (window.innerHeight + 200 || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth + 200 || document.documentElement.clientWidth)
    );
}

function handleScroll() {
    if (isInViewport(scrollContainer)) {
        scrollWindow('right');
        window.removeEventListener('scroll', handleScroll);
        AnimateLogo('faster')
    }
}

window.addEventListener('scroll', handleScroll);

function HandleInitialScroll(event) {
    const chatButton = document.getElementsByClassName('glow-on-hover')[0]
    if (chatButton)
        chatButton.classList.add('incorporate')
    window.removeEventListener('scroll', HandleInitialScroll);
}

window.addEventListener('scroll', HandleInitialScroll);

function ManageCart(product) {
    const product_id = product.id
    const quantity = product.quantity || 1
    const selectedColor = product.selectedColor
    const savedProducts = JSON.parse(localStorage.getItem('MassageCart')) || [];
    let isRemoved = false;

    const index = savedProducts.findIndex(product => product.product_id === product_id);

    if (index === -1) {
        window.recordEvent('button', 'Add to Cart')
        savedProducts.push({ product_id, quantity, selectedColor });
    } else {
        savedProducts.splice(index, 1);
        isRemoved = true;
    }

    localStorage.setItem('MassageCart', JSON.stringify(savedProducts));

    return [savedProducts.length, isRemoved];
}

function SetProductCard() {
    const Cart = JSON.parse(localStorage.getItem('MassageCart')) || [];
    const total_products = Cart.length;
    const Datapath = window.innerWidth > 767 ? document.getElementById('lblCartCount') : document.getElementById('lblCartCountMobile');
    Datapath.textContent = total_products;
    Cart.forEach(Each => {
        const element = document.querySelector(`[data-id="${Each.product_id}"]`);
        element.style.color = 'rgb(127,255,212)';
    })
}
const EnableCart = (ForceEnable = false) => {
    const CartPath = document.getElementsByClassName('neutralCart')[0];
    const CartPathMobile = document.getElementsByClassName('neutralCartMobile')[0];
    const classname = 'CartBoundary';
    const classnameMobile = 'CartBoundaryMobile';
    const swapclassname = 'neutralCart';
    const swapclassnameMobile = 'neutralCartMobile';
    const ProductsSelected = (JSON.parse(localStorage.getItem('MassageCart')) || []).length
    if (CartPath && CartPathMobile)
        if (ForceEnable) {
            CartPath.classList.add(classname)
            CartPath.classList.remove(swapclassname)
            CartPathMobile.classList.add(classnameMobile)
            CartPathMobile.classList.remove(swapclassnameMobile)
        } else {
            if (ProductsSelected) {
                CartPath.classList.add(classname)
                CartPath.classList.remove(swapclassname)
                CartPathMobile.classList.add(classnameMobile)
                CartPathMobile.classList.remove(swapclassnameMobile)
                setTimeout(() => {
                    CartPath.classList.add('animateCart')
                    CartPathMobile.classList.add('animateCart')
                }, 666);
            }
        }
}

async function MakeRequest(pathname, body, type, callback) {
    const request = await fetch(host + pathname, {
        'method': type,
        headers: {
            'Content-Type': 'application/json'
        },
        'body': type == "POST" ? JSON.stringify(body) : null,
    })
    if ((request.status == 201) || (request.status == 200)) {
        const response = await request.json();
        callback(response)
    }
    else if(callback){
        try{
            callback(false)
        }catch{console.log(request.status)}
    }
}



function AddToCard(data = null) {
    EnableCart(true)
    const product_id = data.target.dataset.id ? Number(data.target.dataset.id) : null;
    const product_color = data.target.dataset.color;
    const result = ManageCart({ id: product_id, selectedColor: product_color });
    const total_products = result[0];
    const current_color = result[1] ? 'rgba(189, 189, 189, 0.555)' : 'rgb(127,255,212)';
    const element = data.target;
    const Datapath = document.getElementById('lblCartCount')
    const DatapathMobile = document.getElementById('lblCartCountMobile')
    const Divpath = document.getElementsByClassName('CartBoundary')[0];
    const DivpathMobile = document.getElementsByClassName('CartBoundaryMobile')[0];
    Divpath.classList.add('animateCart');
    DivpathMobile.classList.add('animateCart');
    Datapath.textContent = total_products;
    DatapathMobile.textContent = total_products;
    if (result[1]) {
        element.classList.add('rollback');
        element.classList.remove('CartSelected');
    }
    else {
        element.classList.remove('rollback');
        element.classList.add('CartSelected');
    }
    setTimeout(() => {
        element.style.color = current_color;
    }, 333);
    setTimeout(() => {
        Divpath.classList.remove('animateCart');
        DivpathMobile.classList.remove('animateCart');
    }, 999);
}

function handlePartnersSection(companies = []) {
    if (companies.length) {
        const partnersWindow = document.getElementById('PartnersSection');
        const GenerateLogo = (imageurl) => imageurl ? `<div data-type="brand_logo" class="col-6 col-md-3 align-self-center text-center HideForNow">
                <img width="150px" src="${imageurl}" alt="Logos of our partner brands.">
            </div>` : ''
        const partnersData = companies.filter(each => each ? true : false)
        let logos = partnersData.map(eachCompany => GenerateLogo(eachCompany));
        if (logos.length) {
            const structure = `
                <div class="container mb-5 mb-md-6">
                <div class="row justify-content-md-center">
                <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 text-center">
                    <h2 id="PartnershipText" class="mb-4 display-5">Our Partners</h2>
                    <hr class="w-50 mx-auto mb-0 text-secondary">
                </div>
                </div>
            </div>
            <div class="container overflow-hidden">
                <div id="ParentPartners" class="row gy-5 gy-md-6">
                    ${logos.join('')}
                </div>
            </div>
        `;
            if (partnersWindow) {
                partnersWindow.innerHTML = structure;
            };
        }
    }
};

function generateRandomDigit(maximum) {
    return Math.floor(Math.random() * maximum);
}

const GetProductColor = (Product) => {
    const colors = Product.available_colors;
    const productColorsMaxIndex = colors.length ? Number(colors.length) - 1 : 0
    const decided_color_index = generateRandomDigit(productColorsMaxIndex);
    const colorItself = colors[decided_color_index];
    return [colorItself.color_name, colorItself.image]
};

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        var truncatedText = text.substring(0, maxLength);
        truncatedText += '...';
        return truncatedText;
    } else {
        return text;
    }
}

const GenerateProducts = (productData) => {

    const structureProduct = (id, image, price, title, description, colorName) => `
    <div class="product-card">
        <div class="card-badge">trending</div>
        <a href="/Buy/${id}/${createSlug(title)}/">
            <div class="product-tumb">
                <img src="${image}" alt="Premium massage chair available for next-level relaxation.">
            </div>
        </a>
        <div class="product-details">
            <h2 style="font-size:20px;"><a href="/Buy/${id}/${createSlug(title)}/">${title}</a></h2>
            ${title.length <= 19 ? '<br>' : ''}
            <p id=CardDescription>${description}</p>
            <div class="product-bottom-details">
                <div class="product-price"><small>${price}</small>$3799</div>
                <div class="product-links">
                    <i style="color: rgba(189, 189, 189, 0.555);" class="fa fa-heart"></i>
                    <i data-id="${id}" data-color='${colorName}' onclick="AddToCard(event)" style="color: rgba(189, 189, 189, 0.555);" class="fa fa-shopping-cart"></i>
                </div>
            </div>
        </div>
    </div>
`

    const processedProductCards = [];
    if (Array.isArray(productData)) {
        productData.forEach(eachProduct => {
            const product_color = GetProductColor(eachProduct);
            const product_price = eachProduct.price;
            const product_title = eachProduct.title;
            const product_id = eachProduct.id;
            const product_description = truncateText(eachProduct.description, 160);
            const productStructure = structureProduct(product_id, product_color[1], product_price, product_title, product_description, product_color[0])
            processedProductCards.push(productStructure);
        })
    }

    if (processedProductCards.length) {
        return processedProductCards.join('');
    }

    return null
}

function handlePromotion(id, op) {
    const key = 'promoData';
    const ms24h = 24 * 60 * 60 * 1000;
    id = String(id);
    if (op === 'store') {
        localStorage.setItem(key, JSON.stringify({ id, t: Date.now() }));
    } else if (op === 'check') {
        const data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            return true;
        }
        if (data.id === id) {
            return (Date.now() - data.t) >= ms24h;
        } else {
            return true;
        }
    }
}


function HandlePageDetails(data) {
    const products = data.products || [];
    const partners = data.partners || [];
    const received_discounts = data.available_discounts;
    const contact_information = data.company_contact;
    localStorage.setItem('SavedDiscounts', JSON.stringify(received_discounts));
    PlaceContactInformation(contact_information);
    localStorage.setItem('cached-brands', (data.brand_names || []))
    if (data.brand_names) { PlaceBrandsAvailable(data.brand_names)};
    if (received_discounts) {
        let offer_done = false;
        if (received_discounts.special_event){
            const eventID = received_discounts.special_event.identifier;
            const okeyToShow = handlePromotion(eventID, 'check');
            console.log(okeyToShow ? 'showing offer' : 'ignoring offer')
            if(okeyToShow){
                importScript('/static/js/SpecialEvent.js', ()=>showPromotion(received_discounts.special_event, ()=>handlePromotion(eventID, 'store')));
                offer_done = true;
            }
        };
        if(received_discounts.new_customers_discount){
            newCustomersDiscount = received_discounts.new_customers_discount;
            SetMembershipBenifits(received_discounts.new_customers_discount.discount_amount, received_discounts.new_customers_discount.discount_type);
        };
        if ((received_discounts.new_customers_discount) && (!offer_done)) {
            EnableDiscountBanner(received_discounts.new_customers_discount);
        };
    }
    if (products.length) {
        const ProductCards = GenerateProducts(products);
        const ProductCardsWindow = document.getElementsByClassName('productsuggestion');
        if (ProductCards && ProductCardsWindow.length) {
            ProductCardsWindow[0].innerHTML += ProductCards;
        }
    }
    if (partners.length)
        handlePartnersSection(partners);
}

function PlaceContactInformation(contactInformation){
    const window = document.getElementById('ContactInformationHolder');
    const window2 = document.getElementById('ContactInformationHolder2');
    const CreateInformationHolder = (label, data)=>`<li>${label}:<br><div id="emailList"><span id="emailSpan">${data}</span></div></li>`
    if (window){
        let wholeContact = '';
        if (contactInformation.phone_number){
            wholeContact += `
                            <div onclick="PhoneCallManager();" class="PhoneCallWindow bubbly-button">
                                <p style="margin-top: -2px;">
                                    <svg alt="Phone icon to initiate a call" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9957b5" class="bi bi-telephone" viewBox="0 0 16 16">
                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                    </svg>
                                    <div style="width: 4px;"></div> 
                                </p>
                                <p id="PhoneNumberSection2">Call Us</p>
                            </div>
                            <div style="height:27px;"></div>
                        `;
            
            localStorage.setItem('cached-number', contactInformation.phone_number);
        }
        if (contactInformation.company_email){
            window2.innerHTML = CreateInformationHolder('Email', contactInformation.company_email); 
        }
        window.innerHTML = wholeContact;
    }
}

const animateLogos = () => {
    const logos = document.querySelectorAll('[data-type="brand_logo"]');
    if (logos.length)
        logos.forEach((eachBrand, index) => {
            let time_needed = index === 0 ? 0 : index * 222;
            setTimeout(() => {
                eachBrand.classList.remove('HideForNow');
                eachBrand.classList.add('animatePartnerBrand');
            }, time_needed);
        });
}

const AnimateBrands = () => {
    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateLogos();
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0
    });
    var targetElement = document.getElementById('PartnershipText');
    if (targetElement) {
        observer.observe(targetElement);
    }
};

function EnableDiscountBanner(discountData) {
    if (available('importCSS') && available('importScript')) {
        importScript('https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js')
        importCSS('static/css/EmailSubscription.css')
        importScript('static/js/DiscountOffer.js', () => { setTimeout(() => { DecideIfDiscountNeeded(discountData) }, 299); })
    } else {
        console.log('importCSS and importScript fetchers should be available first !!!')
    }
};

function ManualBannerTrigger() {
    window.recordEvent('Button', 'Discount Offer Button')
    if (newCustomersDiscount) {
        if(!(available('ShowDiscountOffer'))){
            importScript('https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js')
            importCSS('static/css/EmailSubscription.css')
            importScript('/static/js/DiscountOffer.js', ()=>{
                ShowDiscountOffer(newCustomersDiscount);
            })
        }else{
            ShowDiscountOffer(newCustomersDiscount);
        }
    }
};

const SetMembershipBenifits = (amount, type) => {
    const formedAmount = type == 'fixed' ? `$${amount}` : `${amount}%`;
    const message = `Enjoy ${formedAmount} off your first purchase! Elevate your comfort instantly with our exclusive offer.`;
    const messageWindow = document.getElementById('DiscountForNewCustomer');
    messageWindow.textContent = message;
};

function PlaceBrandsAvailable(brandNames = []) {
    const getBrandList = (brandName) => `<li><a href='FindProduct/?Brands=${brandName.replace(/ /g, "+")}'>${brandName}</a></li>`;
    const brandsWindow = document.getElementById('BrandsSection');
    if (brandNames.length && Array.isArray(brandNames)) {
        const brands = brandNames.map(each_brand_name => getBrandList(each_brand_name)); brandsWindow.innerHTML = brands.join('');
    };
};

window.addEventListener('pageshow', () => {
    setTimeout(() => {
        AnimateBrands();
        SetProductCard();
        EnableCart();
        handlePartnersSection();
    }, 666);
});

function PhoneCallManager(phone_number){
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function redirectToDialer(phoneNumber) {
        if (isMobileDevice()) {
            const telURL = `tel:${phoneNumber}`;
            window.location.href = telURL;
            return true;
        } else {
            return false;
        }
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
    const contact_number =  localStorage.getItem('cached-number');
    if (String(contact_number).length >= 10){
        let call_number = String(contact_number).replace(/\s+/g, '')
        if (call_number[0] == "+"){
            const numberButton = document.getElementById('PhoneNumberSection2');
            call_number = call_number.substring(2);
            const result = redirectToDialer(call_number);
            if (!result){
                const showcaseNumber = formatPhoneNumber(call_number);
                numberButton.textContent = showcaseNumber;
            }
        }
    }
}

MakeRequest('HomePageData/', null, 'GET', HandlePageDetails);
const discounts = localStorage.getItem('SavedDiscounts')
const NewUsersDiscount = discounts ? JSON.parse(discounts) : null
setTimeout(() => {
    AnimateLogo()
}, 999);