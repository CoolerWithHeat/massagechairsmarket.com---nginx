const analyticsServerHost = '127.0.0.1:7999';
const socketProtocol = protocol == 'http:' ? 'ws' : 'wss';
const analyticsProtol = window.location.protocol;

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        if (!timeout) {
            func.apply(context, args);
        }
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
        }, wait);
    };
}

const SetCartData = (add_to, remove_from)=>{
    const additions = document.getElementById('Add_to_carts');
    const removals = document.getElementById('Remove_from_carts');
    if (additions){additions.textContent = add_to || 0}
    if (removals){removals.textContent = remove_from || 0}
  }
  function UpdateVisitors(ios, android, pc, total){
    const totals = document.getElementById('TotalVisitors');
    const androids = document.getElementById('AndroidVisitors');
    const ioses = document.getElementById('IosVisitors');
    const pcs = document.getElementById('PcVisitors');
    if (totals){totals.textContent = total || 0}
    if (androids){androids.textContent = android || 0}
    if (ioses){ioses.textContent = ios || 0}
    if (pcs){pcs.textContent = pc || 0}
  };

  async function GetInteractions(){
    const protocol = analyticsProtol.includes('file') ? 'http:' : analyticsProtol;
    const behaviour_url = `${protocol}//${analyticsServerHost}/analyticsdestination/Interactions/`;
    const request = await fetch(behaviour_url);
    const response = await request.json()
    if (response.add_to_cart){SetCartData(response.add_to_cart, response.remove_from_cart)}
  };

  function UpdateLandingPages(atHomePage, atSearchPage, atCheckingPage, atReceiptPage, atOrdersList, atCartPage, at_FAQ){
    const homePage = document.getElementById('OnHomePage');
    const searchPage = document.getElementById('OnSearchPage');
    const productCheckingPage = document.getElementById('ProductCheckingPage');
    const receiptCheckingPage = document.getElementById('ReceiptCheckingPage');
    const listOfOrders = document.getElementById('ordersList');
    const FAQCheckingPage = document.getElementById('FAQCheckingPage');
    const cartCheckingPage = document.getElementById('CartCheckingPage');
    if (homePage){homePage.textContent = atHomePage || 0}
    if (searchPage){searchPage.textContent = atSearchPage || 0}
    if (productCheckingPage){productCheckingPage.textContent = atCheckingPage || 0}
    if (receiptCheckingPage){receiptCheckingPage.textContent = atReceiptPage || 0}
    if (listOfOrders){listOfOrders.textContent = atOrdersList || 0}
    if (cartCheckingPage){cartCheckingPage.textContent = atCartPage || 0}
    if (FAQCheckingPage){FAQCheckingPage.textContent = at_FAQ || 0}
  };

function PlaceAnalysisStructure(){
    const structure_window = document.getElementById('ProductListWindow');
    const structure = `
            <div>
                <div class="centeredDivContent">
                  <h1 class="display-1 dataHeader">Add to Carts</h1>
                </div>
                <br>
                <div class="centeredDivContent">
                  <a style="border-radius: 100px;" class="main-btn secondary-btn square-btn btn-hover"><h2 id="Add_to_carts" style="color: white;">0</h2></a>
                </div>
              </div>
              <br><br>
              <div>
                <div class="centeredDivContent">
                  <h1 class="display-1 dataHeader">Removals</h1>
                </div>
                <br>
                <div class="centeredDivContent">
                  <a style="border-radius: 100px;" class="main-btn danger-btn rounded-full btn-hover"><h2 id="Remove_from_carts" style="color: white;">0</h2></a>
                </div>
              </div>
              <br>
              
              <label for="SectionPlatform1">Currently Visitors</label>
              <hr id="SectionPlatform1">
              <div id="TotalVisitorsIndicator" style="display: flex; justify-content: center;">
                <div style="background-color: #00c1f8;" class="PlatformIndicatorAll">
                  <div class="IndicatorIconBar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" class="bi bi-globe" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                    </svg>
                  </div>
                  <div style="width: 75px; height: 75px; background-color: #FF00FF; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <h2 id="TotalVisitors" style="color: white;">0</h2>
                  </div>
                </div>
              </div>
              <br>
              <br>
              <label for="SectionPlatform1">Currently Visitor Are</label>
              <hr id="SectionPlatform1">
              <div id="UserLandingPageData">
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a >On Home Page</a></h4>
                      <h1 id="OnHomePage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a >Searching Product</a></h4>
                      <h1 id="OnSearchPage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a >Checking Products</a></h4>
                      <h1 id="ProductCheckingPage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a >Checking Cart</a></h4>
                      <h1 id="CartCheckingPage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a>Checking Orders List</a></h4>
                      <h1 id="ordersList" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a>Checking Receipt</a></h4>
                      <h1 id="ReceiptCheckingPage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
                <div style="display: inline-block; min-width: 255px;" class="custom-width">
                  <div class="card-style-3 mb-30">
                    <div class="card-content">
                      <h4 style="text-align: center;"><a>Checking FAQs</a></h4>
                      <h1 id="FAQCheckingPage" style="text-align: center;">0</h1>
                    </div>
                  </div>
                </div>
              </div>
              <br>
              <label for="SectionPlatform1">Of which Are On</label>
              <hr id="SectionPlatform1">
              <div id="PlatformDataHub"> 
                <div>
                  <div style="background-color: #97ca31;" class="PlatformIndicator">
                    <div class="IndicatorIconBar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" class="bi bi-apple" viewBox="0 0 16 16">
                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                      </svg>
                    </div>
                    <div style="width: 75px; height: 75px; background-color: #26ffdb; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                      <h2 id="IosVisitors" style="color: white;">0</h2>
                    </div>
                  </div>
                </div>

                <div>
                  <div style="background-color: #1A2142;" class="PlatformIndicator">
                    <div class="IndicatorIconBar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="white" class="bi bi-android" viewBox="0 0 16 16">
                        <path d="M2.76 3.061a.5.5 0 0 1 .679.2l1.283 2.352A8.9 8.9 0 0 1 8 5a8.9 8.9 0 0 1 3.278.613l1.283-2.352a.5.5 0 1 1 .878.478l-1.252 2.295C14.475 7.266 16 9.477 16 12H0c0-2.523 1.525-4.734 3.813-5.966L2.56 3.74a.5.5 0 0 1 .2-.678ZM5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                      </svg>
                    </div>
                    <div style="width: 75px; height: 75px; background-color: #97ca31; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                      <h2 id="AndroidVisitors" style="color: white;">0</h2>
                    </div>
                  </div>
                </div>

                <div>
                  <div style="background-color: #219653;" class="PlatformIndicator">
                    <div class="IndicatorIconBar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" class="bi bi-pc-display" viewBox="0 0 16 16">
                        <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z"/>
                      </svg>
                    </div>
                    <div style="width: 75px; height: 75px; background-color: #1A2142; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                      <h2 id="PcVisitors" style="color: white;">0</h2>
                    </div>
                  </div>
                </div>
              </div>
        `
        if (structure_window){structure_window.innerHTML = structure};
};

function connectWebSocket(landedPage) {
    const url = `${socketProtocol}://${analyticsServerHost}/analyticsdestination/${landedPage}/${admin_token}`;
    let retryCount = 0;
    const maxRetries = 2;
    const retryDelay = 3000;

    function handleVisitorsCount(message){
        const total_clients = message.android + message.ios + message.desktop;
        const androids = message.android;
        const ioses = message.ios;
        const desktops = message.desktop;
        if (UpdateVisitors){UpdateVisitors(ioses, androids, desktops, total_clients)}
    };
    function handleLandedPages(message){
        const onPages = message.on_pages
        const homePage = onPages['Home/']
        const searchPage = onPages['FindProduct/']
        const buyPage = onPages['Buy/']
        const receiptPage = onPages['Order Receipt/']
        const ordersPage = onPages['ListOfOrders/']
        const cartPage = onPages['Cart/']
        const faq_Page = onPages['FAQs/']
        if (UpdateLandingPages){UpdateLandingPages(homePage, searchPage, buyPage, receiptPage, ordersPage, cartPage, faq_Page)}
    };

    function attemptConnection() {
        const socket = new WebSocket(url);
        console.log(url)
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data).message
            handleVisitorsCount(message);
            handleLandedPages(message);
            debounce(GetInteractions, 999)()
        };
        socket.onopen = () => {console.log('WebSocket connection established.')};
        socket.onerror = (error) => {console.log('WebSocket connection error:', error);retryConnection();};
        socket.onclose = (event) => {if (!event.wasClean) {console.log('WebSocket connection closed unexpectedly.');retryConnection();} else {console.log('WebSocket connection closed.');}};
        function retryConnection() {
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
                setTimeout(attemptConnection, retryDelay);
            } else {
                console.log('Max retries reached. Giving up.');
            }
        }
    }
    attemptConnection();
}

const runAnalytics = ()=>{
    PlaceAnalysisStructure();
    setTimeout(() => {
        connectWebSocket(2);
    }, 499);
}