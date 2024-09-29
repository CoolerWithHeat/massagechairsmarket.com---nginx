const getProduct = (products, id)=>products.find(product => product.id === id);
const shutProductsList = ()=> document.getElementById('ProductListWindow').innerHTML = ''
const shutFieldWindow = ()=> document.getElementById('FieldWindow').innerHTML = ''
const isObject = (variable)=>variable !== null && typeof variable === 'object' && !Array.isArray(variable);

function openEditMode(product_id, updated_data=null){
  edit_mode = true
  if (product_id){
    current_product = product_id
    const product = updated_data || getProduct(product_base, product_id);
    if (isObject(product)){
      SetMenuHeader(product.title)
      setInputStructure(true, product)
      shutProductsList()
    }
    return '';
  }
  current_product = 0;
}

function PlaceFeatures(features){
    if(features && Array.isArray(features)){
      const cascaded_features = features.forEach(each=>{
        HandleID(each.id)
        ShowUploadedFeature(each.image, {'side': each.showcase_side, 'description': each.information}, each.id)
      })
    }
}
function PlaceColorOptions(colors=[]){
  const dataWindow = document.getElementById('AlreadyExistingColors')
  if(features && Array.isArray(colors) && dataWindow){
    colors.forEach(each_color=>{
      const color_id = each_color.id;
      const color_name = each_color.color_name;
      const color_image = each_color.image;
      const color_card = GenerateProductColorCard(color_image, color_name, color_id)
      HandleID(color_id)
      dataWindow.innerHTML += color_card;
    })
  }
}
const GenerateAdditionalImage = (id, image)=> `
        <div id="ImageUpload-${id}" style="padding: 2px;">
          <svg onclick="RemoveImage(2, ${id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
          <div>
            <img style="margin-left: 15px; margin-top: 5px; max-width: 145px; max-height: 145px;" src="${image}" alt="" />
          </div>
        </div>
    `;

function PlaceAdditionalImages(images=[]){
  const dataWindow = document.getElementById('AdditionalImagesHub');
  if(images && Array.isArray(images) && dataWindow){
    images.forEach(each_image=>{
      const image_id = each_image.id;
      const image_url = each_image.image;
      const color_card = GenerateAdditionalImage(image_id, image_url)
      HandleID(image_id)
      dataWindow.innerHTML += color_card;
    })
  }
}

function PlaceVideoShowcases(showcases=[]){
  const dataWindow = document.getElementById('AdditionalImagesHub');
  if(showcases && Array.isArray(showcases) && dataWindow){
    showcases.forEach(each_video=>{
      const system_id = each_video.id;
      const video_id = each_video.video_id;
      const video_side = each_video.video_side;
      const video_platform = each_video.platform;
      const video_side_text = each_video.information;
      HandleID(system_id)
      PlaceVideoShowcase(video_platform, video_id, video_side, video_side_text, system_id)
    })
  }
}
const HandleID = (id)=>{
  if (id > item_id){
    item_id = id+1;
  }
}
function GetBrand(selected_brand=null){
  const generateBrandOption = (brandName)=>`<option ${brandName == selected_brand ? 'selected' : ''} value="${brandName}">${brandName}</option>`
  if (brands_registered && Array.isArray(brands_registered)){
    const brands = brands_registered.map(each_brand=>generateBrandOption(each_brand.brand_name))
    const brandsForm = `
        <div class="select-position">
          <select id="product-brand" required>
            <option value="">Select Brand</option>
            ${brands.join('')}
          </select>
        </div>
    `
    return brandsForm;
  }
  return '';
}

function SyncProduct(product_id){
  if (typeof product_id == 'number'){
    ShowMessage('warning', 'Synchronizing...')
    const doAfter = (response)=>{
      if(response){
        ShowMessage('success', 'Done!')
      }
    };
    MakeRequest(`reindex-product/${product_id}/`, null, 'POST', doAfter)
  }
};

function setInputStructure(edit_mode=false, data=null){
  const structureWindow = document.getElementById('FieldWindow');
  const title = edit_mode && data ? data.title : '';
  const brand = GetBrand(edit_mode && data ? data.brand.brand_name : null);
  const price = edit_mode && data ? data.price : '';
  const reducedBy = edit_mode && data ? data.discount_amount : '';
  const description = edit_mode && data ? data.description : '';
  const has_reviewers = edit_mode && data ? data.has_reviewers || false : false;
  const algolia_sync = edit_mode ? `<img src="images/algolia.png"><a onclick="SyncProduct(${data.id});" href="javascript:void(0);" class="main-btn primary-btn btn-hover">Sync With Algolia</a>` : '';
  const delete_button = `
    <div style="width:100%; height:50px; display:flex; justify-content:right;">
      <a onclick="ShowWarning(DeleteProduct);" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Delete</a>
    </div>
    <br>
  `;
  const sync_button = `
    <div style="width:100%; height:50px; display:flex; justify-content:right;">
    <div style="display:flex; width:100%; height:100%; justify-content:right;">
      ${algolia_sync}
    </div>
    </div>
    <br>
  `;
  const structure = `
  <div style="height:50px;">
    <svg style="cursor:pointer;" onclick="FetchAllProducts();" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
    </svg>
  </div>
  ${edit_mode ? `<div style="display:flex; justify-content:right; width:100%"><a href="${host_itself}Buy/${current_product}/" class="main-btn info-btn square-btn btn-hover">See</a></div>` : ''}
    <!-- field 1 -->
    <div class="input-style-2">
      <input value="${title}" id="product-title" type="text" placeholder="Title " required/>
    </div>
    <!-- field 2 -->
    <div class="select-style-1">
      ${brand}
    </div>
    <!-- field 3 -->
    <div class="input-style-2">
      <input value="${price}" id="product-price" type="number" placeholder="Price " required/>
    </div>
    <!-- field 4 -->
    <div class="input-style-2">
      <input value="${reducedBy}" id="product-reducedBy" type="number" placeholder="Price Reduced by  "/> 
    </div>
    <!-- field 4 -->
    <div class="input-style-1">
      <textarea id="product-description" placeholder="Product Description" rows="5" required>${description}</textarea>
    </div>
    <!-- field 5 -->
    <div style="width: 170px;"><a onclick="fetchProductMeta(${current_product})" class="main-btn dark-btn-outline btn-hover">Configure Meta<i class="lni lni-plus"></i></a></div>
    <hr>
    <h2>Colors</h2>
    <hr>
    <div>
      <div class="fileUploadField">
        <label for="file">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
        <input id="file" type="file" />
      </div>
      <div id="AlreadyExistingColors"></div>
      <div id="NewImageHub"></div>
    </div>
    <br>
      <h2>Additional Images</h2>
      <hr>
      <div>
        <div style="width: 170px;">
          <label for="AdditionalImageInput">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label>
        </div>
        <div style="width: 100%; min-height: 15px; background-color: rgb(255, 255, 255); border-radius: 15px;">
            <div class="fileUploadField">
              <input id="AdditionalImageInput" type="file" />
            </div>
            <div id="existingAdditionalImages"></div>
            <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: left;" id="AdditionalImagesHub"></div>
        </div>
      </div>
      <br>
      <h2>Features</h2>
      <hr>
      <div>
        <div style="width: 170px;"><a onclick="ShowFeatureForm();" class="main-btn dark-btn-outline btn-hover"><i class="lni lni-plus"></i></a></div>
        <div style="width: 100%; min-height: 15px; background-color: rgb(255, 255, 255); border-radius: 15px;">
            <div class="fileUploadField">
              <input id="FeatureImageInput" type="file" />
            </div>
            <div id="ExistingFeatures"></div>
            <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: left;" id="FeatureFormHub"></div>
        </div>
      </div>
      <br>
      <h2>Video Showcase</h2>
      <hr>
      <div>
        <div style="width: 170px;"><a onclick="setVideoStructure();" class="main-btn dark-btn-outline btn-hover"><i class="lni lni-plus"></i></a></div>
        <div style="width: 100%; min-height: 15px; background-color: rgb(255, 255, 255); border-radius: 15px;">
            <div class="fileUploadField">
              <input id="VideoShowcaseInput" type="file" />
            </div>
            <div id="existingShowcases"></div>
            <div id="VideoShowcaseHub"></div>
        </div>
      </div>
      <div class="form-check form-switch toggle-switch mb-30">
        <br>
        <br>
        <input ${has_reviewers ? 'checked' : ''} id="product-hasReviewers" class="form-check-input" type="checkbox" id="toggleSwitch1" />
        <label class="form-check-label" for="toggleSwitch1">Has reviewers</label>
      </div>
      ${(edit_mode && current_product) ? delete_button : ''}
      ${(edit_mode && current_product) ? sync_button : ''}
      <a href="javascript:void(0);" onclick="ValidateData();" class="main-btn secondary-btn-outline btn-hover">Save</a>
  `;
  if (structureWindow){
      shutProductsList();
      structureWindow.innerHTML = structure;
      if (edit_mode && data){
        setTimeout(() => {
          PlaceFeatures(data.chair_features);
          PlaceColorOptions(data.available_colors);
          PlaceAdditionalImages(data.additional_images_admin);
          PlaceVideoShowcases(data.video_demonstrations);
        }, 99);
      }
      setTimeout(() => {
        ListToImageUploads();
        ListToAdditionalImageUploads();
      }, 99);
  }
}


function DeleteProduct(){
  if (current_product && edit_mode){
    ShowMessage('warning', 'Deleting...')
    const doAfter = (response)=>{ShowMessage('success', 'Deleted !'); FetchAllProducts();};
    MakeRequest(`UpdateProduct/${current_product}/`, {operation:'delete'}, 'POST', doAfter)
  }
}

const openProductForm = ()=>{
  edit_mode = false;
  setInputStructure(edit_mode);
}

function listProducts(products=[]){
  const window = document.getElementById('ProductListWindow');
  const structure = (product_img, product_title, id)=> `
    <div class="col-xl-4 col-lg-6 col-12 productCardSided">
      <div style="height:236px;" class="card-style-5 mb-30">
        <div class="card-image">
          <div class="productImageWindow">
            <img class="productImage" src="${product_img}" alt="">
          </div>
        </div>
        <div class="card-content">
          <h4><a href="https://massagechairsmarket.com/Buy/${id}/">${product_title}</a></h4>
          <a href="javascript:void(0);" class="main-btn primary-btn btn-hover" onclick="openEditMode(${id})">Change</a>
        </div>
      </div>
    </div>
  `;
  if (Array.isArray(products) && products.length && window) {
    window.innerHTML = '<div style="width:100%; height:60px;"><a onclick="openProductForm();" style="float:right;" href="javascript:void(0);" class="main-btn dark-btn-outline square-btn btn-hover">Add</a></div>';
    
    let currentBrand = '';
    let brandContainer = null;

    products.forEach(each_product => {
        if (each_product.brand.brand_name !== currentBrand) {
            currentBrand = each_product.brand.brand_name;
            brandContainer = document.createElement('div');
            brandContainer.style.display = 'flex';
            brandContainer.style.justifyContent = 'left';
            window.innerHTML += `<nav class="bg-dark" style="height:30px;"><h4 style="color:white; text-align:center; margin-top:7px;">${currentBrand}</h4></nav><br>`;
            window.appendChild(brandContainer);
        }
        const image_exists = each_product.available_colors.length ? each_product.available_colors[0].image : null;
        const productList = structure(image_exists, each_product.title, each_product.id);
        brandContainer.innerHTML += productList;
    });
}


}


const side_indecies = {
    'any side': 1,
    'left' : 2,
    'right' : 3,
  }

const side_indecies_reversed = {
    1 : 'any side',
    2 : 'left',
    3 : 'right',
  }

const platform_indecies = {
    'youtube': 1,
    'vimeo' : 2,
  }

function FetchAllProducts(){
  SetMenuHeader('Products')
  edit_mode = false
  current_product = 0;
  const placeProducts = (response)=>{
    shutFieldWindow();
    const products = response.products;
    const brands = response.brands;
    if (Array.isArray(products) && products && brands){
      product_base = products;
      brands_registered = brands;
      setTimeout(() => {
        listProducts(product_base);
      }, 99);
    }
  }
  MakeRequest('GetProducts/', null, 'GET', placeProducts)
}

function UpdateProduct(data, callback=null){
  ShowMessage('warning', 'Updating..')
  const handleResponse = (response)=>{console.log(response)}
  if (isObject(data)){
    MakeRequest(`UpdateProduct/${current_product}/`, data, 'POST', callback, null, true)
  }
}

const GuessOneOrTwo = ()=>{
  const digit = Math.floor(Math.random() * 2) + 1;
  return digit
}
const GuessLeftOrRight = ()=>{
  const data = Math.floor(Math.random() * 2) + 1;
  const sideIndecies = {
    1: 'left',
    2: 'right',
  };
  return sideIndecies[data]
}
function setColorStructure() {
  const formInsertionPoint = document.getElementById('NewImageHub');
  if (formInsertionPoint) {
    const formStructure = `
      <div class="card-style-5">
        <div class="input-style-2">
          <input type="text" placeholder="Color Name " id="ProductColorImage" required/>
        </div>
        <div class="card-image">
          <a href="javascript:void(0);">
            <img id="ImageBeingSaved" src="" alt="" />
          </a>
        </div>
        <svg onclick="SaveImage(event);" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
        </svg>
      </div>
    `;
    formInsertionPoint.innerHTML = formStructure;
  }
}

const GenerateProductColorCard = (image, color_name, id)=>`
          <div id="ColorUpload-${id}" class="card-style-5">
            <div class="card-content">
              <h4><a href="javascript:void(0);">${color_name}</a></h4>
            </div>
            <div class="card-image">
              <a href="javascript:void(0);">
                <img src="${image}" alt="" />
              </a>
            </div>
            <svg onclick="RemoveImage(1, ${id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
          </div>
        `

function setVideoStructure(video) {
  const formInsertionPoint = document.getElementById('VideoShowcaseHub');
  if (formInsertionPoint) {
    const formStructure = `
        <div>
          <br>
          <div style="display: flex; justify-content: left; align-items: center; flex-wrap: wrap;">
            <div style="width: 175px; margin-left: 7px;" class="select-style-1">
              <div class="select-position">
                <select id="ShowcasePlatform" required>
                  <option value="0">Select Platform</option>
                  <option value="1">YouTube</option>
                  <option value="2">Vimeo</option>
                </select>
              </div>
            </div>
            <div style="width: 175px; margin-left: 7px;" class="select-style-1">
              <div class="select-position">
                <select id="ShowcaseSide" required>
                  <option value="0">Select Side</option>
                  <option value="1">Any Side</option>
                  <option value="2">Left</option>
                  <option value="3">Right</option>
                </select>
              </div>
            </div>
            <div style="margin-left: 7px;"><div style="width: 150px;" class="input-style-3"><input id="ShowcasePlatformID" type="text" placeholder="video ID " required/></div></div>
          </div>
          <div class="input-style-1">
            <textarea id="ShowcaseText" placeholder="Showcase Description" rows="5"></textarea>
          </div>
          <a onclick="ValidateVideoShowcase();" href="javascript:void(0);" class="main-btn primary-btn-outline btn-hover">Done</a>
        </div>
    `;
    formInsertionPoint.innerHTML = formStructure;
  }
}

function ShowVideoDemo(platform=null, video_id=null, side=null, text=null){
  if (!platform && !video_id && !side){return ''}
  video_on_probe = {platform, video_id, side, text}
  const decided_side = side == 1 ? GuessOneOrTwo() : side;
  const video_url = platform == 1 ? `https://www.youtube.com/embed/${video_id}` : `https://player.vimeo.com/video/${video_id}`;
  const GetVideo = ()=>`<iframe width="420" height="420" src="${video_url}" allowfullscreen></iframe>`
  const structure = `
        <div class="card-style-5">
          <div style="min-width: 94%; display: flex; justify-content:space-between; align-items: center;" class="card-image videoMainContend">
            
          ${decided_side == 2 ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
          <div class="input-style-2"><textarea style="min-width: 320px; min-height: 320px;">${text || ''}</textarea></div>
          ${decided_side == 3 ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
          
            </div>
          <svg onclick="SaveVideo();" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
          </svg>
        </div>
      `;
  const videoWindow = document.getElementById('VideoShowcaseHub');
  if(videoWindow){videoWindow.innerHTML = structure;}
}

const ShowFeatureProbe = (image_data)=>{
  const read_image = image_data.readed_file;
  const image_itself = image_data.file_itself;
  const imageWindow = document.getElementById('FeatureImageHub');
  const imageForm = `<img width="200px" height="200px" src="${read_image}"><br><br>`
  if (imageWindow){imageWindow.innerHTML = imageForm; feature_on_probe=image_data;}
}

function ShowFeatureForm(){
  const formWindow = document.getElementById('FeatureFormHub');
  if (formWindow){
    const structure = `
          <div>
            <br>
            <div style="display: flex; justify-content: left; align-items: center; flex-wrap: wrap;">
              <div style="width: 175px; margin-left: 7px;" class="select-style-1">
                <div class="select-position">
                  <select id="FeatureSide" required>
                    <option value="0">Select Side</option>
                    <option value="1">Left</option>
                    <option value="2">Right</option>
                    <option value="3">Any Side</option>
                  </select>
                </div>
              </div>
              <div style="margin-left: 7px;"><div style="width: 175px;" class="input-style-3"><input id="FeatureName" type="text" placeholder="Feature Name " required/></div></div>
            </div>
            <div class="input-style-1">
              <textarea id="FeatureText" placeholder="Feature Description" rows="5"></textarea>
            </div>
            <div id="FeatureImageHub">
              <div style="width: 170px;"><label for="FeatureImageInput">Image Upload<ion-icon name="cloud-upload-outline"></ion-icon></label></div>
              <input id="FeatureImageInput" type="file" />
              <br>
            </div>
            <a onclick="ValidateFeatureData();" href="javascript:void(0);" class="main-btn primary-btn-outline btn-hover">Done</a>
          </div>
        `;
    formWindow.innerHTML = structure;
    ListFeatureUploads();
  }
};
function PlaceVideoShowcase(platform=null, video_id=null, side=null, text=null, uploaded_id=null){
  const string_side = typeof side === 'string';
  const videoWindow = document.getElementById('existingShowcases');
  if (videoWindow){
    const decided_side = side == 'any side' ? GuessLeftOrRight() : side;
    const video_url = platform == 'youtube' ? `https://www.youtube.com/embed/${video_id}` : `https://player.vimeo.com/video/${video_id}`;
    const GetVideo = ()=>`<iframe width="420" height="420" src="${video_url}" allowfullscreen></iframe>`;
    const structure = `
      <div id="videoUpload-${uploaded_id}" class="card-style-5">
        <div style="min-width: 94%; display: flex; justify-content:space-between; align-items: center;" class="card-image">
          
            ${decided_side == 'left' ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
            <div class="input-style-2"><textarea style="min-width: 320px; min-height: 320px;">${text || ''}</textarea></div>
            ${decided_side == 'right' ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
          
        </div>
          <svg onclick="RemoveImage(3, ${uploaded_id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
      </div>
    `;
    videoWindow.innerHTML += structure;
    const ExistingDemo = document.getElementById('VideoShowcaseHub');
    ExistingDemo.innerHTML = '';
  }
}

function PlaceProbedVideo(platform=null, video_id=null, side=null, text=null, uploaded_id=null){
  const videoWindow = document.getElementById('existingShowcases');
  if (!platform && !video_id && !side && !uploaded_id){return ''}
  if (edit_mode){
    const video_object = {showcase_text:text, video_side:side, video_platform:platform, video_id:video_id};
    const doAfter = (response)=>{
      if (response.id && videoWindow){
        ShowMessage('success', 'Added !')
        HandleID(response.id)
        const decided_side = response.video_side == 'any side' ? GuessOneOrTwo() : response.video_side;
        const video_url = response.video_platform == 'youtube' ? `https://www.youtube.com/embed/${response.video_id}` : `https://player.vimeo.com/video/${response.video_id}`;
        const GetVideo = ()=>`<iframe width="420" height="420" src="${video_url}" allowfullscreen></iframe>`;
        const structure = `
            <div id="videoUpload-${response.id}" class="card-style-5">
              <div style="min-width: 94%; display: flex; justify-content:space-between; align-items: center;" class="card-image">
                
                ${decided_side == 'left' ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
                <div class="input-style-2"><textarea style="min-width: 320px; min-height: 320px;">${response.showcase_text || ''}</textarea></div>
                ${decided_side == 'right' ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
                
              </div>
                <svg onclick="RemoveImage(3, ${response.id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                </svg>
            </div>
          `;
        videoWindow.innerHTML += structure;
        const ExistingDemo = document.getElementById('VideoShowcaseHub');
        ExistingDemo.innerHTML = '';
      }
    };
    UpdateProduct({to_model:'video_demo', do: 'add', data: video_object}, doAfter)
    return '';
  }
  const string_side = typeof side === 'string';
  const string_platform = typeof platform === 'string';
  const decided_platform = string_platform ? platform_indecies[platform] : platform
  if (videoWindow){
    const decided_side = string_side ? side_indecies[side] : side == 3 ? GuessOneOrTwo() : side;
    const video_url = decided_platform == 1 ? `https://www.youtube.com/embed/${video_id}` : `https://player.vimeo.com/video/${video_id}`;
    const GetVideo = ()=>`<iframe width="420" height="420" src="${video_url}" allowfullscreen></iframe>`;
    const structure = `
        <div id="videoUpload-${uploaded_id}" class="card-style-5">
          <div style="min-width: 94%; display: flex; justify-content:space-between; align-items: center;" class="card-image">
            
            ${decided_side == 1 ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
            <div class="input-style-2"><textarea style="min-width: 320px; min-height: 320px;">${text || ''}</textarea></div>
            ${decided_side == 2 ? `<div><a href="javascript:void(0);">${GetVideo()}</a></div>` : ''}
            
          </div>
            <svg onclick="RemoveImage(3, ${uploaded_id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
        </div>
      `;
    videoWindow.innerHTML += structure;
    const ExistingDemo = document.getElementById('VideoShowcaseHub');
    ExistingDemo.innerHTML = '';
  }
};

function SaveVideo(){
  if (video_on_probe){
    item_id += 1;
    const id = item_id;
    const saved = saveFileUpload(3, id, false, video_on_probe);
    PlaceProbedVideo(video_on_probe.platform, video_on_probe.video_id, video_on_probe.side, video_on_probe.text, id)
    video_on_probe = null
  };};

function ValidateVideoShowcase(){
  video_on_probe = null;
  const showcasePlatform = document.getElementById('ShowcasePlatform')
  const showcaseSide = document.getElementById('ShowcaseSide')
  const showcaseID = document.getElementById('ShowcasePlatformID')
  const showcaseText = document.getElementById('ShowcaseText')
  // Sanitized
  const platform = showcasePlatform && (Number(showcasePlatform.value) > 0) ? Number(showcasePlatform.value) : null
  const side = showcaseSide && (Number(showcaseSide.value) > 0) ? Number(showcaseSide.value) : null
  const video_id = showcaseID && String(showcaseID.value).length ? showcaseID.value : null
  const text = showcaseText && String(showcaseText.value).length ? showcaseText.value : null
  if (!platform || !video_id || !side){return ShowMessage('error', 'Video needs platform, side and id!')}
  ShowVideoDemo(platform, video_id, side, text)
}

function setAdditionalColor(image_data) {
  const image_file = image_data.file_itself;
  const image_read = image_data.readed_file;
  item_id += 1;
  const id = item_id;
  const imageView = document.getElementById('AdditionalImagesHub');
  if (edit_mode && imageView){
    const upload_object = {image: image_file};
    const doAfter = (response)=>{
      if (response.id){
        ShowMessage('success', 'Added !')
        HandleID(response.id)
        const image = `
          <div id="ImageUpload-${response.id}" style="padding: 2px;">
            <svg onclick="RemoveImage(2, ${response.id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
            <div>
              <img style="margin-left: 15px; margin-top: 5px; max-width: 145px; max-height: 145px;" src="${response.image}" alt="" />
            </div>
          </div>
      `;
      imageView.innerHTML += image;
      }
    }
    UpdateProduct({to_model:'additional_images', do: 'add', data: upload_object}, doAfter)
    return '';
  }
  if (imageView && !edit_mode) {
    const upload_object = {image: image_file};
    saveFileUpload(2, id, false, upload_object)
    const image = `
        <div id="ImageUpload-${id}" style="padding: 2px;">
          <svg onclick="RemoveImage(2, ${id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
          <div>
            <img style="margin-left: 15px; margin-top: 5px; max-width: 145px; max-height: 145px;" src="${image_read}" alt="" />
          </div>
        </div>
    `;
    imageView.innerHTML += image;
  }
}

const AddColorDynamically = (element)=>{
  const colorsWindow = document.getElementById('AlreadyExistingColors');
  if (colorsWindow && element){
    colorsWindow.innerHTML += element;
    const formWindow = document.getElementById('NewImageHub');
    if (formWindow){formWindow.innerHTML='';}
  };
};

function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

function ListToImageUploads() {
  const inputField = document.getElementById('file');
  inputField.addEventListener('change', function() {
    setColorStructure();
    setTimeout(async () => {
      const imageTag = document.getElementById('ImageBeingSaved');
      const file = this.files[0];
      if (file) {
        const redied_file = await encodeFileToBase64(file);
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploaded_image = e.target.result;
          imageTag.src = uploaded_image;
          current_color = {file_itself: redied_file, readed_file:uploaded_image};
        };
        reader.readAsDataURL(file);
      }
    }, 199);
  });
}

function ShowUploadedFeature(img, data, id){
  if (!img && !data){return ''}
  const videoWindow = document.getElementById('ExistingFeatures');
  if (videoWindow){
    const side = typeof data.side === 'string' ? side_indecies[data.side] : data.side;
    const decided_side = side == 3 ? GuessOneOrTwo() : side;
    const feature_image = `<img style="max-width: 320px; max-height: 320px;" src="${img}"><br>`;
    const text = data.description;
    const structure = `
        <div id="featureUpload-${id}" class="card-style-5">
          <div class="featureCard" class="card-image">
            ${decided_side == 1 ? `<div><a href="javascript:void(0);">${feature_image}</a></div>` : ''}
            <div class="input-style-2"><textarea style="min-width: 320px; min-height: 320px;">${text || ''}</textarea></div>
            ${decided_side == 2 ? `<div><a href="javascript:void(0);">${feature_image}</a></div>` : ''}
            
          </div>
          <div class="feature-cancel-window">
            <svg onclick="RemoveImage(4, ${id})" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
          </div>
        </div>
      `;
    videoWindow.innerHTML += structure;
    const ExistingDemo = document.getElementById('FeatureFormHub');
    ExistingDemo.innerHTML = '';
  }
};

function GetFeatureDetails(){
  const feature_side = document.getElementById('FeatureSide');
  const feature_name = document.getElementById('FeatureName');
  const feature_description = document.getElementById('FeatureText');
  const side = feature_side && (Number(feature_side.value) > 0) ? Number(feature_side.value) : null;
  const name = feature_name && String(feature_name.value).length ? String(feature_name.value) : null;
  const description = feature_description && String(feature_description.value).length ? String(feature_description.value) : null;
  return (side && name && description) ? {side, name, description} : null;
};

function ValidateFeatureData(){
  const data = GetFeatureDetails();
  if (data && feature_on_probe){
    if (edit_mode){
      ShowMessage('success', 'Added !')
      const feature_data = {called:data.name, feature_side:side_indecies_reversed[data.side], feature_description:data.description, feature_showcase:feature_on_probe.file_itself};
      const doAfter = (response)=>{
        if(response.id){HandleID(response.id)}
        ShowUploadedFeature(response.feature_showcase, {side: response.feature_side, description:response.feature_description}, response.id);
      }
      UpdateProduct({to_model:'features', do: 'add', data: feature_data}, doAfter)
    }else{
      item_id += 1;
      data['image'] = feature_on_probe.file_itself;
      const upload_id = item_id;
      saveFileUpload(4, upload_id, false, data);
      ShowUploadedFeature(feature_on_probe.readed_file, data, upload_id);
      feature_on_probe = null;
    }
  }else{ShowMessage('error', 'Feature Needs all details and image')}
};

function ListFeatureUploads() {
  feature_on_probe = null;
  const inputField = document.getElementById('FeatureImageInput');
  inputField.addEventListener('change', function() {
    setTimeout(async () => {
      const imageTag = document.getElementById('FeatureFormHub');
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        const redied_file = await encodeFileToBase64(file);
        reader.onload = function(e) {
          const image_to_see = e.target.result;
          const image_data = current_color = {file_itself: redied_file, readed_file:image_to_see};
          ShowFeatureProbe(image_data);
        };
        reader.readAsDataURL(file);
      }
    }, 199);
  });
}

function removeObjectById(idToRemove, array){return array.filter(obj => !obj[idToRemove]);}

function saveFileUpload(where=1, upload_id, remove=false, data=null){
  if (where == 1){
    if (remove){
      const updated_data = removeObjectById(upload_id, colors_upload)
      colors_upload = [...updated_data];
      return true;
    }else{
      colors_upload.push({[upload_id]: data})
      return false;
    }
  }
  if (where == 2){
    if (remove){
      const updated_data = removeObjectById(upload_id, additional_image_uploads)
      additional_image_uploads = [...updated_data];
      return true;
    }else{
      additional_image_uploads.push({[upload_id]: data})
      return false;
    }
  }
  if (where == 3){
    if (remove){
      const updated_data = removeObjectById(upload_id, video_showcases)
      video_showcases = [...updated_data];
      return true;
    }else{
      video_showcases.push({[upload_id]: data})
      return false;
    }
  }
  if (where == 4){
    if (remove){
      const updated_data = removeObjectById(upload_id, features)
      features = [...updated_data];
      return true;
    }else{
      features.push({[upload_id]: data})
      return false;
    }
  }
}

function ListToAdditionalImageUploads() {
  const inputField = document.getElementById('AdditionalImageInput');
  inputField.addEventListener('change', function() {
    (async () => {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        const redied_file = await encodeFileToBase64(file);
        reader.onload = function(e) {
          const image_to_see = e.target.result;
          const image_data = {file_itself: redied_file, readed_file:image_to_see};
          setAdditionalColor(image_data);
        };
        reader.readAsDataURL(file);
      }
    })()
  });
}

function HandleImageRemoval(from_base, upload_id){
  if (edit_mode && upload_id){
    if (from_base == 1){
      const doAfter = (response)=>{
        if (response.id){
          ShowMessage('success', 'Removed !')
          HandleID(response.id)
          const object_card = document.getElementById(`ColorUpload-${response.id}`);
          if (object_card){object_card.remove()}
        }
      };
      UpdateProduct({to_model:'available_colors', do: 'remove', data: {color_id: upload_id}}, doAfter);
    }
    if (from_base == 2){
      const doAfter = (response)=>{
        if (response.id){
          ShowMessage('success', 'Removed !')
          HandleID(response.id)
          const object_card = document.getElementById(`ImageUpload-${response.id}`);
          if (object_card){object_card.remove()}
        }
      };
      UpdateProduct({to_model:'additional_images', do: 'remove', data: {image_id: upload_id}}, doAfter);
    }
    if (from_base == 3){
      const doAfter = (response)=>{
        if (response.id){
          ShowMessage('success', 'Removed !')
          HandleID(response.id)
          const object_card = document.getElementById(`videoUpload-${response.id}`);
          if (object_card){object_card.remove()}
        }
      };
      UpdateProduct({to_model:'video_demo', do: 'remove', data: {video_id: upload_id}}, doAfter)
    }
    if (from_base == 4){
      const doAfter = (response)=>{
        if (response.id){
          ShowMessage('success', 'Removed !')
          HandleID(response.id)
          const object_card = document.getElementById(`featureUpload-${response.id}`);
          if (object_card){object_card.remove()}
        }
      };
      UpdateProduct({to_model:'features', do: 'remove', data: {feature_id: upload_id}}, doAfter)
    }
    return '';
  }
  const removed = saveFileUpload(from_base, upload_id, true, null);
  if (removed){
    if (from_base == 1){
      const object_card = document.getElementById(`ColorUpload-${upload_id}`);
      if (object_card){object_card.remove()}
    }
    if (from_base == 2){
      const object_card = document.getElementById(`ImageUpload-${upload_id}`);
      if (object_card){object_card.remove()}
    }
    if (from_base == 3){
      const object_card = document.getElementById(`videoUpload-${upload_id}`);
      if (object_card){object_card.remove()}
    }
    if (from_base == 4){
      const object_card = document.getElementById(`featureUpload-${upload_id}`);
      if (object_card){object_card.remove()}
    }
  }
}

function RemoveImage(from_base, upload_id){
  ShowWarning(()=>{HandleImageRemoval(from_base, upload_id)})  
};

function SaveImage() {
  const colorName = document.getElementById('ProductColorImage');
  if (colorName && String(colorName.value).length && current_color.file_itself) {
    if (edit_mode){
      const colorData = {color_name: colorName.value, image: current_color.file_itself}
      const doAfter = (response)=>{
        if (response.id){
          ShowMessage('success', 'Added !')
          HandleID(response)
          const productOfColor = GenerateProductColorCard(response.image, response.color_name, response.id);
          AddColorDynamically(productOfColor)
        }
      }
      UpdateProduct({to_model:'available_colors', do: 'add', data: colorData}, doAfter)
      return '';
    }
    item_id += 1;
    const id = item_id;
    const productOfColor = GenerateProductColorCard(current_color.readed_file, colorName.value, id);
    AddColorDynamically(productOfColor)
    const upload_object = {file: current_color.file_itself, color_name:colorName.value};
    saveFileUpload(1, id, false, upload_object)
  }
}
function RemovePreviousMessage(message_id){
  const message = document.getElementById(message_id);
  if(message){
    message.classList.add('fadeaway')
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
function WrapWithFormData(file) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}
function TranslationLayer(type=1, incoming_data=[]){
  const colorsLayer = (data)=>{return {color_name:data.color_name, image: data.file}};
  const featuresLayer = (data)=>{return {called:data.name, feature_side:data.side, feature_description: data.description, feature_showcase: data.image}};
  const videoShowcaseLayer = (data)=>{return {showcase_text: data.text, video_side:data.side, video_platform:data.platform, video_id:data.video_id}};
  const additionalImagesLayer = (data)=>{return {image: data.image}};
  const operation_indecies = {
    1: colorsLayer,
    2: featuresLayer,
    3: additionalImagesLayer,
    4: videoShowcaseLayer,
  }
  return incoming_data.map(each=>operation_indecies[type](each))
}
function GetObjectValues(data){return data.map(obj => Object.values(obj)[0])}

function ValidateData(){
  let productTitle = document.getElementById('product-title');
  let productBrand = document.getElementById('product-brand');
  let productPrice = document.getElementById('product-price');
  let productReducedBy = document.getElementById('product-reducedBy');
  let productDescription = document.getElementById('product-description');
  let productHasReviewers = document.getElementById('product-hasReviewers');
  const product_title = productTitle && String(productTitle.value).length ? productTitle.value : null;
  const product_brand = productBrand && String(productBrand.value).length ? productBrand.value : null;
  const product_price = productPrice && (Number(productPrice.value) > 0) ? productPrice.value : null;
  const product_reduced_by = productReducedBy && Number(productReducedBy.value) ? productReducedBy.value : 0;
  const product_description = productDescription && String(productDescription.value).length ? productDescription.value : null;
  const product_has_reviewers = productHasReviewers ? productHasReviewers.checked : null;
  const colors = GetObjectValues(colors_upload);
  const additional_images = GetObjectValues(additional_image_uploads);
  const all_features = GetObjectValues(features);
  const all_videos = GetObjectValues(video_showcases);
  if (!product_title || !product_brand || !product_price || !product_description){ShowMessage('error', 'Fill Required Fields !'); return 0;}
  const data = {title: product_title, brand: product_brand, price: product_price, description: product_description, has_reviewers: product_has_reviewers};
  if (edit_mode && current_product){
    const doAfter = (response)=>{
      if (response.id){
        ShowMessage('success', 'Done !')
        HandleID(response.id)
        openEditMode(response.id, response)
      }
    };
    UpdateProduct({to_model:'all_text', do: 'add', data: data}, doAfter)
    return 0;
  };
  if (!edit_mode){
    if (colors.length){data['available_colors'] = TranslationLayer(1, colors);}
    if (all_features.length){data['features'] = TranslationLayer(2, all_features);}
    if (additional_images.length){data['additional_images'] = TranslationLayer(3, additional_images);}
    if (all_videos.length){data['video_demo'] = TranslationLayer(4, all_videos);}
    if (product_reduced_by){data['discount_amount'] = product_reduced_by}
    const HandleResponse = (response)=>{
      if (response.id){HandleID(response.id); current_product=response.id; edit_mode=true; setInputStructure(true, response);}
    }
    ShowMessage('warning', 'Saving...')           
    MakeRequest('SaveProduct/', data, "POST", HandleResponse, null, true)
  }
  return 0;
};
// FetchAllProducts();