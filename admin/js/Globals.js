const debug = true
const domain = 'massagechairsmarket.com'
const protocol = window.location.protocol;
const current_host = window.location.host;
const host = `${protocol}`+"//" + (debug ? current_host : domain) + '/serverdestination/';
const host_itself = 'http://192.168.180.22/';
// const host = 'http://127.0.0.1:8000/serverdestination/';
const admin_token = localStorage.getItem('MC-admin');
var brand_image_data = null;
var all_brands = [];
var openedBrand = 0;  
var no_brand_image_state = false;
var current_color = null;
var item_id = 0;
var colors_upload = [];
var additional_image_uploads = [];
var video_showcases = [];
var features = [];
var product_base = [];
var brands_registered = [];
var edit_mode = false;
var feature_on_probe = null;
var video_on_probe = null;
var TrackingData = [];
var current_IDs =  [];
var current_product = 0;
var currentOperation = null;

function RemovePreviousMessage(message_id){
  const message = document.getElementById(message_id);
  if(message){
    message.classList.add('fadeaway')
  }
};

function SetMenuHeader(text=null){
  const header = document.getElementById('MenuHeader');
  if (header && text){
    header.textContent = text;
  }
}

function HandleAfterVerification(){
  if(typeof currentOperation === 'function'){currentOperation(); ShowWarning(null, true)}
};

function ShowWarning(callback, remove=false, additional_explanation=null){
  const warningWindow = document.getElementById('WarningWindow');
  if (warningWindow && !remove && (typeof callback === 'function')){
    warningWindow.removeAttribute('style');
    currentOperation = callback;
    const warningPanel = `
        <div id="warningAction">
          <div id="actionPanelAlert">
            <h1 class="Display-3" style="color: white;">You Sure ?</h1>
            <br>
            ${additional_explanation ? `<small style='color:white;'>${additional_explanation}</small><br>` : ''}
            <br>
            <button onclick="HandleAfterVerification();" class="btn btn-light">YES</button>
            <button onclick="ShowWarning(null, true);" class="btn btn-success">NO</button>
          </div>
        </div>
      `;
    warningWindow.innerHTML = warningPanel;
  }
  else{
    warningWindow.innerHTML = '';
    warningWindow.style.display = 'none';
  }
};

function ShowMessage(type, message){
  item_id += 1;
  const messageWindow = document.getElementById('MessagesWindow');
  const assigned_id = `message-${item_id}`;
  const errorMessage = (id, text)=>`
          <div id="${id}" class="error-container">
            <div class="error-text">${text}</div>
          </div>
        `
  const successMessage = (id, text)=>`
          <div id="${id}" class="success-container">
            <div class="success-text">${text}</div>
          </div>
      `
  const warningMessage = (id, text)=>`
          <div id="${id}" class="warning-container">
            <div class="success-text">${text}</div>
          </div>
      `
  const operation_indecies = {
    'error': errorMessage,
    'warning': warningMessage,
    'success': successMessage,
  };
  if (messageWindow){
    const Message = operation_indecies[type](assigned_id, message);
    if (Message){messageWindow.innerHTML = Message;}
  }
  setTimeout(() => {
    RemovePreviousMessage(assigned_id);
  }, 2499);
}

function debounceImmediate(func, wait) {
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

function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

async function MakeRequest(pathname, body, type, callback, additional_callback=null, needs_stringify=true){
    const request = await fetch(host+pathname, {
        'method': type,
        'headers' : {
          'content-type':'applicationjson',
          'Authorization': `Bearer ${admin_token}`,
        },
        'body': type == "POST" ? needs_stringify ? JSON.stringify(body) : body : null,
    })
    if ((request.status == 201) || (request.status == 200)){
        const response = await request.json();
        try{
          if (callback){callback(response)}
          if (additional_callback){additional_callback()}
        }
        catch{}
    }
    if ((request.status == 403) || (request.status == 401)){
      window.location.href = '/admin/login/'
    }
    else if(callback){
        try{
            callback(false)
        }catch{console.log(request.status)}
    }
}