const getBrand = (brands, id)=>brands.find(brand => brand.id === id);
const editBrand = (brand_id)=>{
  const requested_brand = getBrand(all_brands, brand_id);
  if (requested_brand){
    openBrandEditMode(requested_brand)
  }
}

function clearBrandList(){
  const Brandwindow = document.getElementById('ProductListWindow');
  if (Brandwindow){Brandwindow.innerHTML = ''};
}
function clearBrandinputs(){
  const inputWindow = document.getElementById('FieldWindow');
  if (inputWindow){inputWindow.innerHTML = ''};
}
const ClearBrandImage = ()=>{
  const imageWindow = document.getElementById('AlreadyExistingImage');
  if (imageWindow){
    imageWindow.innerHTML = '';
  }
}

function listBrands(brands=[]){
  const Brandwindow = document.getElementById('ProductListWindow');
  const structure = (brand_img, brand_name, id)=> `
    <div class="col-xl-4 col-lg-6 col-12 productCardSided">
      <div class="card-style-5 mb-30">
      ${brand_img ? `
        <div class="card-image">
          <a href="javascript:void(0);">
            <img style="max-width: 100px; max-height: 100px; display:block; margin:auto;" src="${brand_img}" alt="">
          </a>
        </div>
      ` : 
      ''}
        <div class="card-content">
          <h4><a href="https://massagechairsmarket.com/Buy/${id}/">${brand_name}</a></h4>
          <a style="float:right;" class="main-btn primary-btn btn-hover" onclick="editBrand(${id})">Change</a>
        </div>
      </div>
    </div>
  `;
  if (Array.isArray(brands) && brands.length && Brandwindow){
    Brandwindow.innerHTML = '<div style="width:100%; height:60px;"><a onclick="setBrandFields();" style="float:right;" href="javascript:void(0);" class="main-btn dark-btn-outline square-btn btn-hover">Add</a></div>'
    brands.forEach(each_brand=>{
      const brand_id = each_brand.id;
      const brand_name = each_brand.brand_name;
      const brand_logo = each_brand.brand_logo;
      const brandComponent = structure(brand_logo, brand_name, brand_id);
      Brandwindow.innerHTML += brandComponent;
    })
  }
}
const GetUploadedBrandImage = (img)=>img ? `
        <div style="padding: 2px;">
          <svg onclick="ListenToBrandImageUploads();" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
          <div id="UploadedBrandImage">
            <img style="margin-left: 15px; margin-top: 5px; max-width: 145px; max-height: 145px;" src="${img}" alt="" />
          </div>
        </div>
  ` : '';

const setBrandFields = (editing_brand=false, data=null)=>{
  clearBrandList();
  const inputWindow = document.getElementById('FieldWindow');
  const brand_name = (editing_brand && data) ? data.brand_name : '';
  const brand_logo = (editing_brand && data) ? GetUploadedBrandImage(data.brand_logo) : '';
  const brand_tracking_allowed = (editing_brand && data) ? data.order_tracking_available : '';
  const delete_button = `
      <div style="width:100%; height:50px; display:flex; justify-content:right;">
        <a onclick="DeleteBrand()" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Delete</a>
      </div>
      <br>
    `;
  const structure = `
      <div style="height:50px;">
        <svg style="cursor:pointer;" onclick="GetBrands();" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </div>
      ${editing_brand ? delete_button : ''}
      <div class="input-style-2"><input value="${brand_name}" id="BrandName" type="text" placeholder="Brand Name " required/></div>
      <div>
        <div class="fileUploadField"></div>
        <div id="AlreadyExistingImage">
          ${brand_logo}
        </div>
        <div id="NewBrandImageHub"></div>
      </div>
      <div class="form-check checkbox-style checkbox-success mb-20">
        <br>
        <input ${brand_tracking_allowed ? 'checked' : ''} class="form-check-input" type="checkbox" value="" id="checkbox-3" />
        <label class="form-check-label" for="checkbox-3">
          Order tracking available</label>
      </div>
      <a onclick="HandleBrand();" class="main-btn secondary-btn-outline btn-hover">Save</a>
  `;
  if (inputWindow){
    inputWindow.innerHTML = structure;
    if(!brand_logo){ListenToBrandImageUploads()}
  };
};
const enableBrandImageUpload = (enable)=>{
  if (enable){ClearBrandImage()};
  const uploadWindow = document.getElementsByClassName('fileUploadField');
  if (uploadWindow[0]){
    const uploadField = `
      <label for="LogoPoint">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
      <input id="LogoPoint" type="file" />
    `;
    uploadWindow[0].innerHTML = enable ? uploadField : '';
  }
}
const setBrandImage = (image_data)=>{
  no_brand_image_state = false;
  if (image_data){
    const image_file = image_data.file_itself;
    const image_read_data = image_data.readed_file;
    brand_image_data = image_file;
    const uploadedImage = GetUploadedBrandImage(image_read_data);
    if (uploadedImage){
      const imageWindow = document.getElementById('NewBrandImageHub');
      if (imageWindow){imageWindow.innerHTML = uploadedImage;}
    }
  }
};
function ListenToBrandImageUploads(enable=true) {
  no_brand_image_state = true
  enableBrandImageUpload(enable)
  if (enable){
    const inputField = document.getElementById('LogoPoint');
    inputField.addEventListener('change', function() {
      setTimeout(async () => {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          const redied_file = await encodeFileToBase64(file);
          reader.onload = function(e) {
            const image_to_see = e.target.result;
            const brand_image = {file_itself: redied_file, readed_file:image_to_see};
            setBrandImage(brand_image);
          };
          reader.readAsDataURL(file);
        }
      }, 199);
    });
  }
}

function GetBrandData(){
  const brandName = document.getElementById('BrandName');
  const trackingData = document.getElementById('checkbox-3');
  return (brandName && trackingData) ? {brand_name: brandName.value, order_tracking_available:trackingData.checked} : null;
}

function DeleteBrand(){
  ShowMessage('warning', 'Deleting...')
  const doAfter = (response)=>{
    GetBrands();
    ShowMessage('success', 'Done !')
  }
  MakeRequest(`UpdateBrand/${openedBrand}/`, {operation: 'delete'}, 'POST', doAfter)
}

function HandleBrand(){
  const data = GetBrandData();
  if (('brand_name' in data) && ('order_tracking_available' in data) && String(data.brand_name).length){
    if (brand_image_data){data['brand_logo'] = brand_image_data;}
    if (no_brand_image_state){data['brand_logo'] = null;}
    if (openedBrand){
      ShowMessage('warning', 'Updating...')
      const doAfter = (response)=>{
        if (response.id){
          openBrandEditMode(response)
          ShowMessage('success', 'Done !')
        }
      }
      MakeRequest(`UpdateBrand/${openedBrand}/`, data, 'POST', doAfter)
    }
    if (!openedBrand){
      ShowMessage('warning', 'Creating...')
      const doAfter = (response)=>{
        if (response.id){
          openBrandEditMode(response)
          ShowMessage('success', 'Done !')
        }
      }
      MakeRequest(`CreateBrand/`, data, 'POST', doAfter)
    }
  }else{
    ShowMessage('error', 'brand name should be provided !')
  }
};
function openBrandEditMode(data){
  openedBrand = data.id;
  setBrandFields(true, data);
}
function GetBrands(){
  clearBrandinputs();
  const doAfter = (response)=>{
    if(Array.isArray(response)){
      all_brands = response;
      listBrands(all_brands);
    }
  }
  MakeRequest('GetBrands/', null, 'GET', doAfter)
}

// GetBrands()