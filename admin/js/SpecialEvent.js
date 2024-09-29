let imageLeft = null;
let imageRight = null;
let imageMobile = null;
function ListLeftImageUploads() {
  const inputField = document.getElementById('leftImage');
  inputField.addEventListener('change', function() {
    setTimeout(async () => {
      const file = this.files[0];
      if (file) {
        const redied_file = await encodeFileToBase64(file);
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploaded_image = e.target.result;
          current_image = {file_itself: redied_file, readed_file:uploaded_image};
          const imageWindow = document.getElementById('UploadedImageWindow1');
          imageWindow.innerHTML = `<br/><img width="100px" height="100px" style="border-radius:4px;" src="${uploaded_image}"/>`;
          imageLeft = redied_file;
        };
        reader.readAsDataURL(file);
      }
    }, 199);
  });
};
function ListRightImageUploads() {
  const inputField = document.getElementById('rightImage');
  inputField.addEventListener('change', function() {
    setTimeout(async () => {
      const file = this.files[0];
      if (file) {
        const redied_file = await encodeFileToBase64(file);
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploaded_image = e.target.result;
          current_image = {file_itself: redied_file, readed_file:uploaded_image};
          const imageWindow = document.getElementById('UploadedImageWindow2');
          imageWindow.innerHTML = `<br/><img width="100px" height="100px" style="border-radius:4px;" src="${uploaded_image}"/>`;
          imageRight = redied_file;
        };
        reader.readAsDataURL(file);
      }
    }, 199);
  });
};
function ListMobileImageUploads() {
  const inputField = document.getElementById('mobileImage');
  inputField.addEventListener('change', function() {
    setTimeout(async () => {
      const file = this.files[0];
      if (file) {
        const redied_file = await encodeFileToBase64(file);
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploaded_image = e.target.result;
          current_image = {file_itself: redied_file, readed_file:uploaded_image};
          const imageWindow = document.getElementById('UploadedImageWindow3');
          imageWindow.innerHTML = `<br/><img width="100px" height="100px" style="border-radius:4px;" src="${uploaded_image}"/>`;
          imageMobile = redied_file;
        };
        reader.readAsDataURL(file);
      }
    }, 199);
  });
};

function GetEventData(){
  const title = document.getElementById('event-title');
  const event_offer_amount = document.getElementById('event-offer-amount');
  const event_offer_code = document.getElementById('event-offer-code');
  const onScrollOnly = document.getElementById('event-onscroll-only');
  const stillActive = document.getElementById('event-active');
  const called = title.value || '';
  const offer_amount = event_offer_amount.value || '';
  const offer_code = event_offer_code.value || '';
  const show_on_scroll = onScrollOnly.checked;
  const offer_active = stillActive.checked;
  const constructedData = {called, offer_amount, offer_code, show_on_scroll, offer_active};
  if (imageLeft){constructedData['left_image'] = imageLeft};
  if (imageRight){constructedData['right_image'] = imageRight}; 
  if (imageMobile){constructedData['mobile_image'] = imageMobile};
  return constructedData;
};

function SavePromotionData(){
  const data = GetEventData();
  if (data){
    ShowMessage('warning', 'saving...');
    const doAfter = (response)=>{
      if (response){
        SetSpecialEvent(response);
        ShowMessage('success', 'Updated!');
      }else{
        ShowMessage('error', 'Failed!, Promotion title, amount, code needed!');
      }
    };
    MakeRequest('SpecialEvent/', data, 'POST', doAfter);
  };
};

function SetSpecialEvent(data={}){
  const eventWindow = document.getElementById('ProductListWindow');
  const generateImage = (url)=>`<br/><img width="100px" height="100px" style="border-radius:4px;" src="${url}"/>`
  const title = data.called;
  const left_image = data.left_image ? generateImage(data.left_image) : '';
  const right_image = data.right_image ? generateImage(data.right_image) : '';;
  const mobile_image = data.mobile_image ? generateImage(data.mobile_image) : '';;
  const amount = data.offer_amount;
  const code = data.offer_code;
  const only_on_scroll = data.show_on_scroll;
  const active = data.offer_active;
  const structure = `
          <div>
            <label for="event-title">Event Title</label>
            <div class="input-style-2"><input value="${title || ''}" id="event-title" type="text" placeholder="Called " required/></div>
          </div>
          <br>
          <div style="min-height: 235px;">
            <label for="fileUploadField">Left Background</label>
            <hr>
            <div class="fileUploadField">
              <label for="leftImage">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
              <input id="leftImage" type="file" />
            </div>
            <div id="UploadedImageWindow1">${left_image}</div>
          </div>
          <br>
          <div style="min-height: 235px;">
            <label for="fileUploadField">Right Background</label>
            <hr>
            <div class="fileUploadField">
              <label for="rightImage">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
              <input id="rightImage" type="file" />
            </div>
            <div id="UploadedImageWindow2">${right_image}</div>
          </div>
          <br>
          <div style="min-height: 235px;">
            <label for="fileUploadField">Mobile Background</label>
            <hr>
            <div class="fileUploadField">
              <label for="mobileImage">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
              <input id="mobileImage" type="file" />
            </div>
            <div id="UploadedImageWindow3">${mobile_image}</div>
          </div>
          <br>
          <div>
            <label for="event-offer-amount">Offer Amount</label>
            <div class="input-style-2"><input value="${amount || 0}" id="event-offer-amount" type="number" placeholder="Amount " required/></div>
          </div>
          <div>
            <label for="event-offer-code">Offer Code</label>
            <div class="input-style-2"><input value="${code || ''}" id="event-offer-code" type="text" placeholder="Coupon Code " required/></div>
          </div>
          <div>
            <div class="form-check form-switch toggle-switch mb-30">
              <input ${only_on_scroll ? 'checked' : ''} id="event-onscroll-only" class="form-check-input" type="checkbox" id="toggleSwitch1" />
              <label class="form-check-label" for="toggleSwitch1">Show On Scroll Only</label>
            </div>
          </div>
          <div>
            <div class="form-check form-switch toggle-switch mb-30">
              <input ${active ? 'checked' : ''} id="event-active" class="form-check-input" type="checkbox" id="toggleSwitch1" />
              <label class="form-check-label" for="toggleSwitch1">Offer Active</label>
            </div>
          </div>
          <div>
            <a onclick="ShowWarning(()=>SavePromotionData())" href="javascript:void(0);" class="main-btn primary-btn-outline btn-hover">Save</a>
          </div>
        `;
    if(eventWindow){
      eventWindow.innerHTML = structure;
      ListLeftImageUploads();
      ListRightImageUploads();
      ListMobileImageUploads();
    }
};
const placeEventData = (response)=>{
  if (response){
    SetSpecialEvent(response);
  }else{
    ShowMessage('error', 'Server did not respond, check destination')
  }
}

function GetSpecialEvent(){
    MakeRequest('SpecialEvent/', null, 'GET', placeEventData);
}