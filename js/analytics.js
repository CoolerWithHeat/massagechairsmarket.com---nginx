const analyticsServerHost = '127.0.0.1:7999';
const socketProtocol = window.location.protocol == 'http:' ? 'ws' : 'wss';
const analyticsProtol = window.location.protocol;

const GetPageIndex = ()=>{
    const ladedPage = String(window.location.pathname);
    if (ladedPage == '/'){return 1;}
    if (ladedPage.includes('/FindProduct/')){return 2}
    if (ladedPage.includes('/Buy/')){return 3}
    if (ladedPage.includes('/Cart/')){return 4}
    if (ladedPage.includes('/Orders/')){return 5}
    if (ladedPage.includes('/Order/')){return 6}
    if (ladedPage.includes('/FAQ/')){return 7}
    return 1;
};

function connectWebSocket(landedPage) {
    const url = `${socketProtocol}://${analyticsServerHost}/analyticsdestination/${landedPage}/CLI`;
    let retryCount = 0;
    const maxRetries = 2;
    const retryDelay = 3000;
    try{
        function attemptConnection() {
            const socket = new WebSocket(url);
            socket.onopen = () => {console.log('WebSocket connection established.')};
            socket.onerror = (error) => {console.log('WebSocket connection error:', error);retryConnection();};
            socket.onclose = (event) => {if (!event.wasClean) {console.log('WebSocket connection closed unexpectedly.');retryConnection();} else {console.log('WebSocket connection closed.');}};
            function retryConnection() {
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
                    setTimeout(attemptConnection, retryDelay);
                } else {
                    console.log('Socket connection failed');
                }
            }
        }
        attemptConnection();
    }
    catch{}
}

window.addEventListener('pageshow', ()=>{let landedPage = GetPageIndex(); connectWebSocket(landedPage);})