let selected_og_image = {};
let product_dealing_with;
let image_ids = [];
const selected_style = 'border-style: solid; border-width: 5px; border-color: #4e6ff3; border-radius: 7px; margin-left: 7px; margin-top:7px;';
const default_style = 'margin-left: 7px; margin-top:7px; cursor:pointer;';

function handleImageSelect(selected_image_id){
  const images = image_ids.map(each_id=>document.querySelector(`[data-id="${each_id}"]`))
  images.forEach(each_image=>{
    const image_id = each_image.getAttribute('data-id');
    if(image_id){
      const selectedImage = Number(image_id) === Number(selected_image_id);
      if(selectedImage){
        const modelPath = each_image.getAttribute('path_type');
        selected_og_image = {path: modelPath, id:image_id};
        each_image.setAttribute('style', selectedImage ? selected_style : default_style);
      }else{
        each_image.setAttribute('style', selectedImage ? selected_style : default_style);
      }
    };
  })
}
function PlaceMeta(meta_description, meta_keywords, og_description, og_image, og_title, og_type, og_url, found_images){
  const paramsWindow = document.getElementById('FieldWindow');
  function GenerateMetaImages(data_list=[], selected_url, sourceType){
    if (Array.isArray(data_list)){
      const mappedImages = data_list.map(each_data=>{
        const isSelected = selected_url === each_data.image;
        const image_id = each_data.id;
        const path = sourceType;
        if (isSelected){selected_og_image = {path: sourceType, id:image_id}};
        image_ids.push(image_id)
        return `<img onclick='handleImageSelect(${image_id})' style='${isSelected ? selected_style : default_style}' path_type="${sourceType}" data-id='${each_data.id}' src="${each_data.image}" width="80px" height="80px">`;
      });
      return mappedImages.length ? mappedImages.join() : null;
    };
    return null;
  };
  const color_options = GenerateMetaImages(found_images.color_images, og_image, 'color_options');
  const additional_images = GenerateMetaImages(found_images.additional_images, og_image, 'additional_images');
  const generateMetaImageWindow = (data, title)=>`
              <br><h6>${title}</h6><hr>
              <div style="width: 100%; height: 150px; display: flex; justify-content: left; flex-wrap: wrap;">
                ${data}
              </div>
            `;
  const structure = `
            <div style="height:50px;">
                <svg style="cursor:pointer;" onclick="openEditMode(${product_dealing_with})" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                </svg>
            </div>
            <br>
            <label for="product-meta_description">Meta Description</label>
            <div class="input-style-2">
              <input maxlength="160" data-field_name="meta_description" value="${meta_description || ''}" id="product-meta_description" type="text" placeholder="Meta Description " required/>
            </div>
            <label for="product-meta_keywords">Comma Seperated Keywords</label>
            <div class="input-style-2">
              <input maxlength="255" data-field_name="meta_keywords" value="${meta_keywords || ''}" id="product-meta_keywords" type="text" placeholder="Meta Keywords " required/>
            </div>
            <hr>
            <h3>Social Media Params ↓</h3>
            <hr>
            <label for="product-meta_keywords">Open Graph Title</label>
            <div class="input-style-2">
              <input maxlength="255" data-field_name="og_title" value="${og_title || ''}" id="product-og_title" type="text" placeholder="Open Graph Title " required/>
            </div>
            <label for="product-og_description">Open Graph Description</label>
            <div class="input-style-2">
              <input maxlength="255" data-field_name="og_description" value="${og_description || ''}" id="product-og_description" type="text" placeholder="Open Graph Description " required/>
            </div>
            <label for="product-og_image">Open Graph Image</label>
            <div class="input-style-2">
              ${color_options ? generateMetaImageWindow(color_options, 'Of Color Options') : ''}
              ${additional_images ? generateMetaImageWindow(additional_images, 'Of Additional Images') : ''}
            </div>
            <label for="product-og_url">Open Graph Url</label>
            <div class="input-style-2">
              <input data-field_name="og_url" value="${og_url || ''}" id="product-og_url" type="text" placeholder="Open Graph Url " required/>
            </div>
            <div class="select-style-1">
              <label>Open Graph Type</label>  
              <div class="select-position">
                <select id="product-og_type" data-field_name="og_type">
                  <option value="product">Product</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
            </div>
            <div style="width:100%; display:flex; justify-content:right;">
              <a href="javascript:void(0);" onclick="SaveMetaData();" class="main-btn secondary-btn-outline btn-hover">Save</a> 
            </div>
        `;
  paramsWindow.innerHTML = structure;
}
function GetMetaData(){
  const description = document.getElementById('product-meta_description')
  const keywords = document.getElementById('product-meta_keywords')
  const title = document.getElementById('product-og_title')
  const description2 = document.getElementById('product-og_description');
  const url = document.getElementById('product-og_url')
  const type = document.getElementById('product-og_type')
  const meta_description = description.value || null;
  const meta_keywords = keywords.value || null;
  const og_title = title.value || null;
  const og_description = description2.value || null;
  const og_url = url.value || null;
  const og_type = type.value || null;
  const og_image = selected_og_image.id ? selected_og_image : null;
  return {meta_description, meta_keywords, og_title, og_url, og_type, og_image, og_description}
};
function SaveMetaData(){
  const data = GetMetaData();
  if (data && product_dealing_with){
    const doAfter = (response)=>{
      if (response){
        ShowMessage('success', 'Product Meta Saved!');
      }
    };
    MakeRequest(`Product_Meta/${product_dealing_with}/`, data, 'POST', doAfter)
  };
};
const fetchProductMeta = (product_id)=> {
  product_dealing_with = null;
  if(product_id){
        product_dealing_with = product_id
        document.getElementById('MenuHeader').textContent = 'Product Meta';
        const doAfter= (response)=>{
            if (response){
              const meta_description = response.meta_description || '';
              const meta_keywords = response.meta_keywords || '';
              const og_description = response.og_description || '';
              const og_image = response.og_image || '';
              const og_title = response.og_title || '';
              const og_type = response.og_type || '';
              const og_url = response.og_url || '';
              const all_images = response.images_found || {};
              PlaceMeta(meta_description, meta_keywords, og_description, og_image, og_title, og_type, og_url, all_images);
            }
        };
        MakeRequest(`Product_Meta/${product_dealing_with}/`, null, 'GET', doAfter)
    }else{
        ShowMessage('error', 'Meta cannot be set, id not found!')
    }
}