
GetFiltersReady();
var MinPriceRepresentor = document.getElementById("MinPriceHub");
var MaxPriceRepresentor = document.getElementById("MaxPriceHub");
var firstTimeVisit = true;
function RedirectCustomer(url, productTitle) {localStorage.setItem('productTitle', productTitle);window.location.href = url;}

window.recordEvent = ()=>{};
importScript('https://www.googletagmanager.com/gtag/js?id=G-YPTBVN0S8C', () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-YPTBVN0S8C');
    window.recordEvent = (event_label, category)=> window.gtag('event', 'click', {
            'event_category': category,
            'event_label': event_label,
        });
    });

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

const SaveSubfilterCached = (hits)=>{
    let filters = hits[0].FilterOptions
    localStorage.setItem('cached-filters', JSON.stringify(filters))
};

var MinPriceDemonstration;
var MaxPriceDemonstration;
var WindowFilters;
let requested_page = 0;
const host = window.location.protocol + "//" + window.location.host + '/serverdestination/'

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function ValidateSearchParam(data) {return typeof data === 'string' ? [data] : data};

function EnableErrorForProductContainer(enable=true){
    const productContainer = document.getElementById('ProductContainer');
    if (productContainer && enable){
        productContainer.style.display = 'flex';
        productContainer.style.justifyContent = 'center';
    }else if(!enable){productContainer.removeAttribute('style')}
    return productContainer;
}

function ShowNoResults(unmatchedKeyword=null){
    const container = EnableErrorForProductContainer();
    const onBigDisplay = window.innerWidth >= 770;
    const keywordFocused = unmatchedKeyword ? `for "${unmatchedKeyword}"` : '';
    if (container){
        const error = `
            <div id="NoResultsError" style="width: 180px; display: block; text-align: center; margin-top:${onBigDisplay ? 140 : 90}px">
                <div style="display: block; margin: auto;">
                    <img src="/static/images/binoculars.jpg" style="width: 150px; height: 150px; border-radius: 50%; display: block; margin: auto;" alt="Not Found">
                </div>
                <div>
                    <p style="margin-top: 7px; font-size: 16px; font-weight: 390;">No results found ${keywordFocused}</p>
                </div>
            </div>
        `;
        container.innerHTML = error;
    }
}

function removeNoResultMessage(){
    const message = document.getElementById('NoResultsError');
    if (message){
        message.remove();
    };
};

let filtersReady = false;
function searchAlgoliaWithParams(RequestedProperties){
    UpdateLoadingStatus(false);
    const possiblyByCache = firstTimeVisit;
    const premiumOnes = RequestedProperties.Product == 'Elite';
    const client = algoliasearch('K7LWE7RYA4', '1bd3f01a834995a69d5a68d696bfb948');
    const products = client.initIndex(premiumOnes ? 'products_price_desc' : 'MassageChair');
    const minPrice = parseFloat(RequestedProperties.minPrice)  || 0;
    const maxPrice = parseFloat(RequestedProperties.maxPrice) || 16000;
    const brandFilters = ValidateSearchParam(RequestedProperties.Brands); 
    const KeywordSearch = RequestedProperties.SearchKey || '*';
    const featureFilters = ValidateSearchParam(RequestedProperties.Features);
    let brand_filters = '';
    let feature_filters = '';
    products.setSettings({ranking: [premiumOnes ? "desc(price)" : 'desc(rating)']})
    const price_filters = `${brandFilters ? ' AND ' : ''}(price > ${minPrice} AND price <= ${maxPrice})${featureFilters ? ' AND ' : ''}`;
    if (brandFilters && Array.isArray(brandFilters)){
        const filter = brandFilters.map(each=>`brand: '${each}' `)
        const finalBrandFilter = `(${filter.join('OR ')}) `;
        brand_filters = finalBrandFilter;
    }
    
    if (featureFilters && Array.isArray(featureFilters)){
        const filter = featureFilters.map(each=>`chair_features: '${each}' `)
        const finalBrandFilter = `(${filter.join('OR ')}) `;
        feature_filters = finalBrandFilter;
    }
    
    const searchOptions = {
        hitsPerPage: 12,
        filters: brand_filters+price_filters+feature_filters,
        page: requested_page,
    };
    if (premiumOnes){products.setSettings({ranking: ['desc(price)']})};
    if (searchOptions.filters){
        products.search(KeywordSearch, searchOptions).then((response) => {
            const hits = response.hits;
            const current_pagination_page = response.page;
            const pagination_pages_left = response.nbPages;
            generatePagination(Number(current_pagination_page), Number(pagination_pages_left));
            setTimeout(() => {
                UpdateLoadingStatus(true);
                if (hits.length) {
                    removeNoResultMessage();
                    let processedProducts = [];
                    hits.forEach(Each => {
                        if (!filtersReady){if (Each.FilterOptions) PlaceSubFilters(Each.FilterOptions); PlaceBrandsAvailable(Each.FilterOptions.Brands); SaveSubfilterCached(hits); filtersReady=true};
                        const product = extractProductData(Each);
                        processedProducts.push(product)
                    });
                    const container = EnableErrorForProductContainer(false);
                    if (processedProducts.length){container.innerHTML = processedProducts.join('');}
                    setTimeout(() => {
                        SetProductCard();
                    }, 699);
                }else{
                    const SearchKeywordHolder = document.getElementById('SearchKeywordHolder');
                    const currentKeywordValue = SearchKeywordHolder.value;
                    const searchKeywordFound = KeywordSearch && `${KeywordSearch}`.length && !(KeywordSearch == '*')
                    ShowNoResults(searchKeywordFound ? KeywordSearch: null);
                    if(possiblyByCache){PlaceSubFiltersByCache(); filtersReady=true}
                    if (window.innerWidth >= 770){OpenSearchBar(true, true);}
                }
            }, 499);
        })
        .catch(error => {
            console.error('Algolia search error:', error);
        });
    }
}

function GetFiltersReady(){
    const filtersBase = document.getElementById('FilterParentWindow');
    const onDesktop = window.innerWidth >= 770;
    const premiumSelected = getUrlParams().Product == 'Elite';
    if (filtersBase){
        filtersBase.innerHTML += `
            <div id="FiltersDropDown" class="filter-content-parent ${onDesktop ? 'open' : ''}">
                <br>
                <div id="FiltersBase" class="filter-container">
                    <div class="fast-delivery">
                        <div id="PremiumFirst" class="toggle ${premiumSelected ? 'active' : ''}"></div>
                        <span class="fast-delivery-text">Elite Collection</span>
                    </div>
                    <div class="filter-section">
                        <div class="filter-header">
                            <h3>Price Range</h3>
                            <span class="arrow"></span>
                        </div>
                        <div id="PriceFilterBoundary" class="filter-content open">
                            <div class="slider-container">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div id="slider-range"></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <form>
                                            <input id="PriceSliderMin" type="hidden" name="min-value" value="">
                                            <input id="PriceSliderMax" type="hidden" name="max-value" value="">
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label class="MinLabel">Min</label>
                                    <input data-id="minPrice" id="MinPriceHub" type="text" class="form__field" placeholder="$0" />
                                </div>
                                <div class="form-group text-right col-md-6">
                                    <label class="MaxLabel">Max</label>
                                    <input data-id="maxPrice" id="MaxPriceHub" type="text" class="form__field" placeholder="$15999" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
};

function generatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination ul');
    paginationContainer.innerHTML = '';

    const maxVisiblePages = 5;

    if (currentPage > 0) {
        const prevLi = document.createElement('li');
        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.innerHTML = '&lt;';
        prevLink.addEventListener('click', () => {
            requested_page = currentPage - 1;
            window.recordEvent('button', 'pagination')
            TriggerFilter();
        });
        prevLi.appendChild(prevLink);
        paginationContainer.appendChild(prevLi);
    }

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(0, endPage - maxVisiblePages);
    }

    for (let i = startPage; i < endPage; i++) {
        const pageLi = document.createElement('li');
        if (i === currentPage) {
            pageLi.classList.add('active');
        }
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = (i + 1).toString();
        pageLink.addEventListener('click', () => {
            requested_page = i;
            window.recordEvent('button', 'pagination')
            TriggerFilter();
        });
        pageLi.appendChild(pageLink);
        paginationContainer.appendChild(pageLi);
    }

    if (currentPage < totalPages - 1) {
        const nextLi = document.createElement('li');
        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerHTML = '&gt;';
        nextLink.addEventListener('click', () => {
            requested_page = currentPage + 1;
            window.recordEvent('button', 'pagination')
            TriggerFilter();
        });
        nextLi.appendChild(nextLink);
        paginationContainer.appendChild(nextLi);
    }
}

const GetOnlyAvailable = (brandData)=>{
    if (Array.isArray(brandData)){
        return brandData.filter(each=>each[Object.keys(each)[0]])
    }
    return null;
}

function PlaceBrandsAvailable(brandNames=[]){
    const getBrandList = (brandName)=>`<li><a href='?Brands=${brandName.replace(/ /g, "+")}'>${brandName}</a></li>`;
    const brandsWindow = document.getElementById('BrandsSection');
    const validBrands = GetOnlyAvailable(brandNames) || [];
    if (validBrands.length && Array.isArray(validBrands)){
        const brands = validBrands.map(each_brand_name=>getBrandList(Object.keys(each_brand_name)[0])); brandsWindow.innerHTML = brands.join('');
    };
};

function removeLatestAlert() {
    var element = document.getElementById("LatestAlert");
    if (element) {
        element.parentNode.removeChild(element);
    }
}

function createSlug(title) {return title.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');}

function extractProductData(algoliaData) {
    const title = algoliaData.title;
    const price = algoliaData.price;
    const description = algoliaData.description;
    const brand = algoliaData.brand;
    const availableColors = algoliaData.color_options || [];
    const features = algoliaData.chair_features; 
    const purchased = algoliaData.purchased;
    const rating = algoliaData.rating;
    const posted = algoliaData.posted;
    const product_id = algoliaData.objectID;
    const was_reviewed = algoliaData.has_reviewers
    if (!title || !brand || !price || !availableColors.length){console.log('invalid product found'); return '';}
    const rating_stars = was_reviewed ? getRating(rating) : null;
    const Cart = JSON.parse(localStorage.getItem('MassageCart')) || [];
    const style = Cart.some(item => item.product_id === 2) ? "color: rgb(127,255,212);" : null;
    const blackColor_Url = availableColors.length ? availableColors[0][2] : '';
    if (blackColor_Url){
        const product = `
            <div class="col-lg-4">
                <div class="item">
                    <div class="thumb separateProduct">
                        <div class="hover-content">
                            <div class="hoverMenuWindow">
                                <div class="hoverMenuParent">
                                    <div onclick="RedirectCustomer('/Buy/${product_id}/${createSlug(title)}/', '${title}');" class="hoverMenuChild">
                                        <img style="width: 19px; height: 19px;" src="/images/observe.png" alt="icon 1">
                                    </div>
                                    <div onclick="RedirectToReviews('/Buy/${product_id}/${createSlug(title)}/', '${title}');" href="javascript:void(0)" class="hoverMenuChild">
                                        <img style="width: 18px; height: 18px;" src="/images/rateProduct.png" alt="icon 1">
                                    </div>
                                    <div id="object-${product_id}" data-id="${product_id}" data-type="listed-product" data-color="${availableColors[0][0]}" onclick="AddToCard(event, ${product_id})" class="hoverMenuChild">
                                        <img id="cartIcon-${product_id}" style="width: 18px; height: 18px;" src="/images/cart-icons.png" alt="icon 1">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img loading="lazy" src="${blackColor_Url}" alt="product image">
                    </div>
                    <div class="down-content">
                        <a style="cursor:pointer;" href="/Buy/${product_id}/${createSlug(title)}/">
                            <h4>${title}</h4>
                        </a>
                        <span>$${parseFloat(price)}</span>
                        <br>
                        ${rating_stars ? rating_stars.outerHTML : ''}
                    </div>
                </div>
            </div>
        `;
        return product;
    }
}

const SetPagination = (page)=>{
    const frame = document.getElementById('PaginationSection');
    const DesignatedButtons = `
        <div class="pagination">
            <ul>
                <li class="active">
                    <a href="#">1</a>
                </li>
                <li >
                    <a href="#">2</a>
                </li>
                <li>
                    <a href="#">3</a>
                </li>
                <li>
                    <a href="#">4</a>
                </li>
                <li>
                    <a href="#">></a>
                </li>
            </ul>
        </div>`
    ;
    frame.innerHTML = DesignatedButtons;
};

function setUrlParam(key, value, multi = false, remove = false) {
    const existingParams = getUrlParams();
    var url = new URL(window.location.href);

    if (url.searchParams.has(key)) {
        var existingValue = url.searchParams.get(key);
        var existingValues = existingValue.split(',');
        if (!remove) {
            existingValues = existingValues.filter(val => val !== value);
            if (existingValues.length === 0) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, existingValues.join(','));
            }
        } else if (multi) {
            if (!existingValues.includes(value)) {
                existingValues.push(value);
                url.searchParams.set(key, existingValues.join(','));
            }
        } else {
            url.searchParams.set(key, value);
        }
    } else {
        url.searchParams.set(key, value);
    }

    window.history.pushState({ path: url.href }, '', url.href);
}

function RedirectToReviews(url, product_title=null){
    if(product_title){localStorage.setItem('productTitle', product_title)}
    window.recordEvent('button', 'product direct review')
    localStorage.setItem('requestedReviews', true)
    window.location.href = url;
};

function addPriceFilters(maxPrice, minPrice = 0) {
    if (maxPrice){
        setUrlParam('maxPrice', maxPrice || 16000, false, true);
    }else{
        setUrlParam('minPrice', minPrice || 0, false, true);
    }
}

function addLatestProductParameter() {
    var url = new URL(window.location.href);
    url.searchParams.set('latest_product', 'true');
    window.history.pushState({ path: url.href }, '', url.href);
}

function removeLatestProductParameter() {
    var url = new URL(window.location.href);
    url.searchParams.delete('latest_product');
    window.history.pushState({ path: url.href }, '', url.href);
}


$(function() {
    var selectedClass = "";
    $("p").click(function(){
    selectedClass = $(this).attr("data-rel");
    $("#portfolio").fadeTo(50, 0.1);
        $("#portfolio div").not("."+selectedClass).fadeOut();
    setTimeout(function() {
    $("."+selectedClass).fadeIn();
    $("#portfolio").fadeTo(50, 1);
    }, 500);
        
    });
});

const getRating = (rating) => {
    const StarsHub = document.createElement('ul');
    StarsHub.className = 'stars';
    const wholeRating = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.1;

    for (let i = 0; i < wholeRating; i++) {
        const star = document.createElement('li');
        const icon = document.createElement('i');
        icon.innerHTML = '<img alt="Product Rating Star" style="width:14px; height:14px;" src="/images/rateProduct.png">';
        star.appendChild(icon);
        StarsHub.appendChild(star);
    }
    if (hasHalfStar){
        const classname = hasHalfStar ? 'fa fa-star' : 'fa fa-star-half';
        const halfStar = document.createElement('li');
        const halfStarIcon = document.createElement('i');
        halfStarIcon.className = classname;
        halfStar.appendChild(halfStarIcon);
        StarsHub.appendChild(halfStar);
    }
    return StarsHub;
};
function RecordAction(action_index) {
    const indices = {
        1: 'add_to_cart',
        2: 'remove_from_cart',
    };
    const record = () => {
        const url = `${analyticsProtol}//${analyticsServerHost}/analyticsdestination/Interactions/`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ 'action_type': indices[action_index] })
        });
    };
    const checkAndRecord = (retries, delay) => {
        if (analyticsServerHost) {
            record();
        } else if (retries > 0) {
            setTimeout(() => checkAndRecord(retries - 1, delay), delay);
        } else {
            console.error("analyticsServerHost not available within the expected time");
        }
    };
    if (action_index) {
        checkAndRecord(3, 666);
    }
}

function ManageCart(product) {
    const product_id = product.id
    const quantity = product.quantity || 1
    const selectedColor = product.selectedColor
    const savedProducts = JSON.parse(localStorage.getItem('MassageCart')) || [];
    let isRemoved = false;

    const index = savedProducts.findIndex(product => product.product_id === product_id);

    if (index === -1) {
        window.recordEvent('button', 'Add to Cart')
        RecordAction(1);
        savedProducts.push({ product_id, quantity, selectedColor});
    } else {
        RecordAction(2);
        savedProducts.splice(index, 1);
        isRemoved = true;
    }

    localStorage.setItem('MassageCart', JSON.stringify(savedProducts));

    return [savedProducts.length, isRemoved];
}

function SetSearchIconColor(color='white'){
    const color_indecies = {
        'white': '/images/search-white.png',
        'black': '/images/search-black.png',
    };
    const icon = document.getElementById('SearchIconFA');
    const requested_color = color_indecies[color];
    if (requested_color && icon){icon.src=requested_color}
}

function OpenSearchBar(fadeout=true, OpenOnlyIfValue=false){
    window.recordEvent('button', 'search bar open');
    const url_params = getUrlParams();
    const first_time = url_params.SearchKey == undefined;
    const searchIcon = document.getElementById('SearchIconFA');
    const searchBar = document.getElementsByClassName('searchBox')[0];
    const in_closed_state = !searchBar.classList.contains('openedSearch');
    const SearchKeywordHolder = document.getElementById('SearchKeywordHolder');
    const currentKeywordValue = SearchKeywordHolder.value;
    const same = url_params.SearchKey == currentKeywordValue;
    if (OpenOnlyIfValue){
        if (currentKeywordValue.length){
            searchIcon.src = '/images/search-black.png';
            searchBar.classList.add('openedSearch');
            SetSearchIconColor('black');
            AnimateSearchIcon();
        }
    }else{
        SetSearchIconColor('black');
        if ((first_time && !currentKeywordValue)){}
        else{
            if (!same){
                AddSearchKeyword(currentKeywordValue);
                setTimeout(() => {
                    searchBar.classList.remove('openedSearch');
                    SetSearchIconColor('white');
                    searchIcon.src = '/images/search-white.png';
                }, 333);
            }
        }
        if (in_closed_state){
            searchBar.classList.add('openedSearch')
            setTimeout(() => {SetSearchIconColor('black');}, 299);
            AnimateSearchIcon();
        }
    }
}

const FadaAwaySearch = (fadeout=true)=>{
    const searchBar = document.getElementsByClassName('searchBox')[0]
    if (!fadeout){
        searchBar.classList.remove('Appear');
        searchBar.classList.add('Disappear');
        SetSearchIconColor('black');
    }else{
        searchBar.classList.remove('Disappear');
        searchBar.classList.add('Appear');
        SetSearchIconColor('white');
    }
}

function CloseSearchBar(fadeout=true, avoid_white=false){
    const searchBar = document.getElementsByClassName('searchBox')[0];
    const in_open_state = searchBar.classList.contains('openedSearch');
    if (in_open_state){
        searchBar.classList.remove('openedSearch')
        AnimateSearchIcon()
        SetSearchIconColor('white');
        console.log(avoid_white)
    }
}

function AnimateSearchIcon() {
    const SearchIcon = document.getElementById('SearchIconFA');
    const className = 'SearchIconAnimation';
    const isAlreadyOpened = SearchIcon.classList.contains(className);
    if (isAlreadyOpened) {
        SearchIcon.classList.remove(className);
        setTimeout(() => {
        SearchIcon.classList.add(className);
        }, 10);
    } else {
        SearchIcon.classList.add(className);
    }
}

function TeachHow() {
    const searchInput = document.querySelector('.searchInput');
    const inputText = 'I Want Air Massage';
    let index = 0;
    let addTextIntervalId;

    addTextIntervalId = setInterval(function () {
        searchInput.value = inputText.slice(0, index);
        index++;
        if (index > inputText.length) {
        clearInterval(addTextIntervalId);

        setTimeout(() => {
            let clearIndex = inputText.length;

            const clearTextIntervalId = setInterval(function () {
            searchInput.value = inputText.slice(0, clearIndex);
            clearIndex--;

            if (clearIndex < 0) {
                clearInterval(clearTextIntervalId);
            }
            }, 20);
        }, 777);
        }
    }, 50);

    localStorage.setItem('CustomerAwareness', true)
    return true
}

function GetProductInfo(product_id){
    const requested_object = document.getElementById(`object-${product_id}`);
    if (requested_object){
        const product_color = requested_object.dataset.color;
        return product_color
    }
};

function AddToCard(data=null, product_id){
    const retrievedData = GetProductInfo(product_id);
    const product_color = retrievedData;
    if (product_color){
        const result = ManageCart({id: product_id, quantity:1, selectedColor:product_color});
        const total_products = result[0];
        const current_color = result[1] ? '#343a40' : 'rgb(127,255,212)';
        const element = document.getElementById(`cartIcon-${product_id}`);
        const Datapath = document.getElementById('lblCartCount')
        const DatapathMobile = document.getElementById('lblCartCountMobile')
        const Divpath = document.getElementsByClassName('CartBoundary')[0];
        const DivpathMobile = document.getElementsByClassName('MobileCart')[0];
        Divpath.classList.add('animateCart');
        DivpathMobile.classList.add('animateCart');
        Datapath.textContent = total_products;
        DatapathMobile.textContent = total_products;
        if (result[1]){
            element.classList.add('rollback');
            element.classList.remove('CartSelected');
            element.src='/images/cart-icons.png';
        }
        else{
            element.classList.remove('rollback');
            element.classList.add('CartSelected');
            element.src='/images/cart-filled.png';
        }
        setTimeout(() => {
            element.style.color = current_color;
        }, 333);
        setTimeout(() => {
            Divpath.classList.remove('animateCart');
            DivpathMobile.classList.remove('animateCart');
        }, 999);
    };
}

function checkProductIdExists(digit, dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].product_id === digit) {
            return true;
        }
    }
    return false;
}

function SetProductCard(forCartValidation=false){
    const Cart = JSON.parse(localStorage.getItem('MassageCart')) || [];
    const total_products = Cart.length;
    const Datapath = window.innerWidth > 767 ? document.getElementById('lblCartCount') : document.getElementById('lblCartCountMobile');
    Datapath.textContent = total_products;
    const listedProducts = document.querySelectorAll('[data-type="listed-product"]');
    listedProducts.forEach(TheProduct=>{
        const product_id = Number(TheProduct.getAttribute('data-id'));
        const product_added = checkProductIdExists(product_id, Cart);
        const indicator = document.getElementById(`cartIcon-${product_id}`);
        indicator.src = product_added ? '/images/cart-filled.png' : '/images/cart-icons.png';
    })
}

function HandleSearchBarState(){
    const SearchBar = document.getElementsByClassName('searchBox')[0];
    const AwareCustomer = JSON.parse(localStorage.getItem('CustomerAwareness')) || false
    if (!AwareCustomer){
        setTimeout(() => {
            OpenSearchBar();
        }, 999);

        setTimeout(() => {
            TeachHow();
        }, 1500);

        setTimeout(() => {
            CloseSearchBar();
        }, 4000);

        setTimeout(() => {
            window.addEventListener("scroll", function() {
                const searchBar = document.getElementsByClassName('searchBox')[0]
                const in_open_state = searchBar.classList.contains('openedSearch')
                if (window.scrollY > 100) {
                    if (in_open_state){
                        CloseSearchBar();
                    }
                }
                if (window.scrollY < 50) {
                    if (!in_open_state)
                        OpenSearchBar();
                }
            });    
        }, 3800);
        
    }else{
        window.addEventListener("scroll", function() {
                const searchBar = document.getElementsByClassName('searchBox')[0];
                const in_open_state = searchBar.classList.contains('openedSearch');
                if (window.scrollY > 11 && window.scrollY < 100) {
                    if (in_open_state){
                        CloseSearchBar();
                    }
                }
                if (window.scrollY < 10) {
                    if (!in_open_state)
                        OpenSearchBar();
                }
                if (window.scrollY > 450) {
                    if (!in_open_state)
                    FadaAwaySearch(false);
                }
                if (window.scrollY < 300) {
                    if (!in_open_state)
                    FadaAwaySearch();
                }
            });
        }
}

function UpdateLoadingStatus(remove=true){
    if (remove){
        const loader = document.getElementById('loader');
        if (loader)
            loader.remove();
    }else{
        const loading_window = document.getElementById('ProductContainer');
        loading_window.innerHTML = `<div id="loader" style="margin-top: 250px;" class="loader"></div>`;
    }
    AppendLatestAlert();
};

function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
        if (value.includes(',')) {
            params[key] = value.split(',');
        } else {
            params[key] = value;
        }
    }
    return params;
  }

function removeUrlParam(key, valueToRemove) {
    var url = new URL(window.location.href);
    var existingValue = url.searchParams.get(key);
    if (existingValue) {
        var values = existingValue.split(',');
        var updatedValues = values.filter(val => val !== valueToRemove);

        if (updatedValues.length === 0) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, updatedValues.join(','));
        }

        window.history.pushState({ path: url.href }, '', url.href);
    }
}

function checkIfActivated(data, comparisonValue) {
    if (Array.isArray(data)) {
        return data.includes(comparisonValue);
    } else if (typeof data === 'string') {
        return data === comparisonValue;
    } else {
        return false;
    }
}

function isObject(variable) {
    return variable instanceof Object && variable !== null;
}

async function MakeRequest(pathname, body, type, callback){
    const request = await fetch(host+pathname, {
        'method': type,
        headers: {
            'Content-Type': 'application/json'
        },
        'body': type == "POST" ? JSON.stringify(body) : null,
    })
    if ((request.status == 201) || (request.status == 200)){
        const response = await request.json();
        callback(response)
    }
    else{
        console.log(request.status)
    }
}

function ApplyPrice(){
    const preferred_price_min = document.getElementById('MinPriceField');
    const preferred_price_max = document.getElementById('MaxPriceField');
    const min_price = preferred_price_min.value || 0
    const max_price = preferred_price_max.value || 0
    if (preferred_price_min && preferred_price_max)
        addPriceFilters(max_price, min_price);
};

function HandleFilterCheckbox(is_checked, filterData, FilterParent, TopTier=false){
    window.recordEvent('checkbox', 'Filter Option')
    if (!TopTier){setUrlParam(FilterParent, filterData, true, is_checked);} else{setUrlParam(FilterParent, filterData, false, is_checked)}
    const infrequest_request = debounce(TriggerFilter, 799);
    infrequest_request();
}

function removeMoneyFormat(moneyString) {
    const cleanString = moneyString.replace(/[$,]/g, '');
    const numericValue = parseFloat(cleanString);
    return numericValue;
}

const debouncedSearch = debounce(searchAlgoliaWithParams, 599);
const immediateSearch = searchAlgoliaWithParams;
function TriggerFilter(updatedProperties){
    const params = getUrlParams();
    const finalParams = isObject(updatedProperties) ? {...params, ...updatedProperties} : params;
    firstTimeVisit ? immediateSearch(finalParams) : debouncedSearch(finalParams);
    firstTimeVisit = false;
};

function handleSlider(event) {
    const dataId = event.target.getAttribute('data-id');
    const decided_price = removeMoneyFormat(event.target.value);
    const for_max_price = dataId == 'maxPrice';
    TriggerFilter({[dataId]: decided_price});
    const update_price = debounce(addPriceFilters, 999);
    if (for_max_price){
        update_price(decided_price);
    }else{
        update_price(false, decided_price);
    }
}

function deploySubFilters(options){
    const current_params = getUrlParams();
    const getOption = (optionName, amountAvailable, filterName)=> {
            const already_activated = checkIfActivated(current_params[filterName], optionName);
            const amount = amountAvailable ? amountAvailable : (29 + (Math.floor(Math.random() * 8) + -1))
            return  `   <label class="custom-control custom-checkbox">
                            <input onchange='HandleFilterCheckbox(event)' ${already_activated ? 'checked' : ''} name='${optionName}' data-parent='${filterName}' type="checkbox" class="custom-control-input">
                            <div style="cursor:pointer;" class="custom-control-label">${optionName} <b class="badge badge-pill badge-info float-right">${amount}</b></div>
                        </label>
                    `
    }
    let ParentOptions = [];
    var objectIDs = 3;
    if (isObject(options)){
        for (let key in options){
            const filterName = key;
            const filterOptions = options[key];
            let processedOptions = [];
            if (Array.isArray(filterOptions)){
                for (const obj of filterOptions) {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const value = obj[key];
                            if (value)
                                processedOptions.push(getOption(key, value, filterName))
                        }
                    }
                }
            }
            if (processedOptions){
                processedOptions = processedOptions.join('');
                ParentOptions.push(`
                    <article id="additionalSubFilters" class="filter-group">
                        <div class="card-header">
                            <a href="#" data-toggle="collapse" data-target="#collapse_${objectIDs}" aria-expanded="false" class="">
                                <i class="icon-control fa fa-chevron-down"></i>
                                <h6 data-filtername='SubFilterElement' class="title">${filterName}</h6>
                            </a>
                        </div>
                        <div class="filter-content collapse FilterWindow_${objectIDs}" id="collapse_${objectIDs}" style="">
                            <div class="card-body">
                                ${processedOptions}
                            </div>
                        </div>
                    </article>
                    <br>
                `)
                objectIDs += 1;
            }
        }
    if (ParentOptions)
        ParentOptions = ParentOptions.join('');
        return ParentOptions
    }
}

function AddSearchKeyword(keyword){
    setUrlParam('SearchKey', keyword, false, true)
    TriggerFilter();
    return true;
}

function AppendLatestAlert(){
    setTimeout(() => {
        const url_params = getUrlParams();
        const NoFiltersYet = !Object.keys(url_params).length > 0;
        const window = document.getElementById('LatestAlert');
        if (NoFiltersYet){
            window.innerHTML = `
                <h2>Explore Latest Products</h2>
                <span>By MassageChairsMarket.com</span>
            `;
        }else{
            window.innerHTML = '';
        }
    }, 599);
}

function SetSearchValue(){
    const params = getUrlParams();
    const search_value = params.SearchKey
    if(!(search_value == undefined)){
        const value_window = document.getElementById('SearchKeywordHolder');
        value_window.value = search_value;
    }
}

function SubFiltersExist(){
    const elements = document.querySelectorAll('[data-filtername="SubFilterElement"]');
    const expectedFilters = {'Brands': true, 'Features': true,}
    elements.forEach(element => {
        const brandName = element.textContent;
        if (!expectedFilters[brandName]){
            return false
        }
    });
    return elements.length == 0 ? false : true
}

function PlaceSubFilters(filters){
    GenerateFilter(filters);
}
function PlaceSubFiltersByCache(){
    const filtersFound = localStorage.getItem('cached-filters');
    if (filtersFound){
        GenerateFilter(JSON.parse(filtersFound))
    }
}

setTimeout(() => {
    SetSearchValue();
    MinPriceDemonstration = document.getElementById("MinPriceHub");
    MaxPriceDemonstration = document.getElementById("MaxPriceHub");   
    setTimeout(() => {
        MaxPriceRepresentor.addEventListener('onchange', debounce(handleSlider, 599))
    }, 399);
    setTimeout(() => {
        MinPriceDemonstration.addEventListener('onchange', debounce(handleSlider, 599))
    }, 399);
}, 111);


function ClickSearchForClient(){
    const searchTriggerButton = document.getElementsByClassName('searchButton')[0];
    if(searchTriggerButton)
        searchTriggerButton.click()
}

function EnableDiscountBanner(discountData={}){
    const available = (functionName) => typeof window[functionName] === 'function';
    if (available('importCSS') && available('importScript') ){
        importScript('https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js', 'application/javascript')
        importCSS('/static/css/EmailSubscription.css')
        importScript('/static/js/DiscountOffer.js', ()=>{setTimeout(() => {DecideIfDiscountNeeded(discountData)}, 299);});
    }else{
        console.log('importCSS and importScript fetchers should be available first !!!')
    }
};

window.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        ClickSearchForClient();
    }
});
const trialData = {"id":10,"discount_title":null,"discount_amount":250,"discount_type":"fixed","eligible":"new_customer_only","is_public":true,"discount_code":"EPAFXGY5"}
window.addEventListener('pageshow', function(event) {
    SetProductCard();
    setTimeout(() => {
        EnableDiscountBanner(trialData)
        SetProductCard(true);
        HandleSearchBarState();
    }, 699);
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

function SetPremiumFirst(element=null, selected){
    const PremiumFirst = element || document.getElementById('PremiumFirst');
    if(PremiumFirst){
        const premiumSelected = PremiumFirst.classList.contains('active');
        HandleFilterCheckbox(premiumSelected, 'Elite', 'Product', true)
    }
};

function listenToFilters() {
    document.querySelectorAll('.filter-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector('.arrow');

            if (content.classList.contains('open')) {
                content.style.maxHeight = null;
                content.classList.remove('open');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('open');
            }
            arrow.classList.toggle('up');
        });
    });

    document.querySelector('.toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        SetPremiumFirst();
    });

    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(event) {
            const checkbox = this.querySelector('.checkbox');
            const is_checked = !checkbox.classList.contains('checked');
            checkbox.classList.toggle('checked');
            const filterData = checkbox.getAttribute('name')  
            const FilterParent = checkbox.getAttribute('data-parent') 
            HandleFilterCheckbox(is_checked, filterData, FilterParent);
        });
    });

    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function(event) {
            const is_checked = !checkbox.classList.contains('checked')
            checkbox.classList.toggle('checked');
            const filterData = checkbox.getAttribute('name')  
            const FilterParent = checkbox.getAttribute('data-parent') 
            HandleFilterCheckbox(is_checked, filterData, FilterParent)
            event.stopPropagation();
        });
    });
}

const validFilterData = (data) => typeof data === 'object';

function GenerateFilter(filterData) {
    const filtersWindow = document.getElementById('FiltersBase');
    const params = getUrlParams();
    if (!validFilterData(filterData) || !filtersWindow) {
        return console.log('invalid filter');
    }

    const generateParentFilter = (allFilters) => `<div class="filter-section additionalSubFilters">${allFilters}</div>`;

    const generateFilterHeader = (headerName) => `
        <div data-filtername="SubFilterElement" class="filter-header">
            <h3>${headerName}</h3>
            <span class="arrow"></span>
        </div>`;
        
    const generateFilterBody = (filters) => `
        <div class="filter-content">
            ${filters}
        </div>`;
        
    const generateFilterOption = (optionName, optionQuantity, parent) => {
        let optionSelected = false;
        const currentSelected = params[parent];
        if (currentSelected){const isSelected = currentSelected.includes(optionName); if(isSelected){optionSelected=true}}
        return `
            <div class="filter-option">
                <div name="${optionName}" data-parent="${parent}" class="checkbox ${optionSelected ? 'checked' : ''}"></div>
                <span class="filter-name">${optionName}</span>
                <span class="filter-count">${optionQuantity}</span>
            </div>`
        ;}
        
    const FiltersCombined = Object.keys(filterData).map(each => {
        const filterHeader = each;
        const headerFilters = filterData[each];
        const filterOptions = Object.keys(headerFilters).map(each => {
            const option = headerFilters[each];
            const optionName = Object.keys(option)[0];
            const optionQuantity = option[optionName];
            return optionQuantity ? generateFilterOption(optionName, optionQuantity, filterHeader) : '';
        });
        const Filter = `
            ${generateFilterHeader(filterHeader)}
            ${generateFilterBody(filterOptions.join(''))}
        `;
        return generateParentFilter(Filter);
    });
    
    const processedFilters = FiltersCombined.join('');
    filtersWindow.insertAdjacentHTML('beforeend', processedFilters);
    listenToFilters();
}

TriggerFilter();