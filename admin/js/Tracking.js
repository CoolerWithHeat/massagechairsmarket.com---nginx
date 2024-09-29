const getTrack = (data, id) => data.find(track => track.order_number === id);
const clearAll = ()=>document.getElementById('ProductListWindow').innerHTML = ''; document.getElementById('FieldWindow').innerHTML = '';
const trackingStages = ['Order Confirmed', 'Processing', 'On the way', 'Delivered'];
const GetTrackingStage = (stages=[], selected_stage=null, tracking_id)=>{
  const generateStageOption = (stageName)=>`<option ${selected_stage == stageName ? 'selected' : ''} value="${stageName}">${stageName}</option>`
  if (stages && Array.isArray(stages)){
    const Stages = stages.map(each_stage=>generateStageOption(each_stage))
    const stagesForm = `
      <div class="select-position">
        <select id="TrackingStage-${tracking_id}" required>
            ${Stages.join('')}
        </select>
      </div>
    `
    return stagesForm;
  }
  return '';
};
const GetTrackingSection = (tracking_id, title, brand, tracking_code, current_stage)=>{
  const Stages = GetTrackingStage(trackingStages, current_stage, tracking_id);
  const structure = `
          <div class="TrackingProduct">
            <hr>
            <div class="ProductNameAndBrand">
              <small>${title}</small>
              <div class="TrackingProductBrand">
                <small class="TrackingBrandText">${brand}</small>
              </div>
            </div>
            <br>
            <div style="display: flex; justify-content: left; align-items: center; flex-wrap: wrap;">
              <div style="margin-left: 7px;"><div style="width: 192px;" class="input-style-3"><input value="${tracking_code}" id="ProductTrackID-${tracking_id}" type="text" placeholder="Tracking Code " required/></div></div>
              <div style="width: 192px; margin-left: 7px;" class="select-style-1">
                ${Stages}
              </div>
            </div>
          </div>
        `;
  return structure;
};
const GenerateTrackingFrame = (order_number, tracking_products)=>{
  const structure = `
        <div>
          <br>
            <div style="height:50px;">
              <svg style="cursor:pointer;" onclick="OpenWindow(5);" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
              </svg>
            </div>
          <br>
          <div id="TrackChecker"><a href="${host_itself}Order/${order_number}/" class="main-btn warning-btn-outline square-btn btn-hover">Check</a></div>
          <div class="OrderWindow">
            <div id="TrackingHeader"><p id="OrderHeader">Order : ${order_number}</p></div>
            <br>
            ${tracking_products}
            <div class="TrackingSaveTrigger">
              <div class="childButton2">
                <a onclick="HandleTrackingChanges(true)" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Delete</a>
              </div>
              <div class="childButton1">
                <a onclick="HandleTrackingChanges()" style="margin-right:15px;" class="main-btn primary-btn-outline square-btn btn-hover">Save</a>
              </div>
            </div>
            <br>
          </div>
        </div>
        `;
  return structure;
};
function PlaceTrackingData(data=null){
  const TrackingWindow = document.getElementById('FieldWindow');
  const order_number = data ? data.order_number : null;
  const GetEachTrackingData = (products)=>{
    if (Array.isArray(products)){
      const processedData = products.map(each_product=>{
        const tracking_id = each_product.tracking_id;
        const product_name = each_product.tracking_product.title;
        const tracking_code = each_product.tracking_code;
        const product_brand = each_product.tracking_product.brand.brand_name;
        const tracking_stage = trackingStages[each_product.tracking_stage-1];
        const card = GetTrackingSection(tracking_id, product_name, tracking_code, tracking_stage);
        return GetTrackingSection(tracking_id, product_name, product_brand, tracking_code, tracking_stage);
      })
      return GenerateTrackingFrame(order_number, processedData.join('')) ;
    }
    return [];
  };
  const trackingInformation = GetEachTrackingData(data.products_associated);
  if (TrackingWindow && order_number){
    TrackingWindow.innerHTML = trackingInformation;
  }
}
const openTrackingEditMode = (id)=>{
  clearAll();
  const requestedTracking = getTrack(TrackingData, id);
  if (requestedTracking){
    PlaceTrackingData(requestedTracking)
  };
};

function PlaceTrackingCards(data=[]){
  const OrdersCardWindow = document.getElementById('ProductListWindow');
  const structure = (order_number, id)=> `
    <div class="col-xl-4 col-lg-6 col-12 productCardSided">
      <div class="card-style-5 mb-30">
        <div class="card-content">
          <h4><a>Order No: ${order_number}</a></h4>
          <a class="main-btn primary-btn btn-hover" onclick="openTrackingEditMode('${id}')">Change</a>
        </div>
      </div>
    </div>
  `;
  if (data && OrdersCardWindow){
    data.forEach(each_track =>  {
      const card = structure(each_track.order_number, each_track.order_number);
      OrdersCardWindow.innerHTML += card;
    })
  };
};

function ProcessTrackingProducts(data) {
  current_IDs = [];
  const orderMap = new Map();
  data.forEach(item => {
      const orderNumber = item.of_order.order_number;
      const productWithStage = {
          tracking_product: item.tracking_product,
          tracking_stage: item.tracking_stage,
          tracking_code: item.order_number_provided_by_brand,
          tracking_id : item.id,
      };
      current_IDs.push(item.id);
      if (!orderMap.has(orderNumber)) {
          orderMap.set(orderNumber, []);
      }
      orderMap.get(orderNumber).push(productWithStage);
  });
  
  const result = [];
  orderMap.forEach((products, orderNumber) => {
      result.push({ order_number: orderNumber, products_associated: products });
  });
  return result;
}

function HandleTrackingChanges(removalRequest=false){
  const data = current_IDs.map(each_id=>{
    let order_number_provided_by_brand = document.getElementById(`ProductTrackID-${each_id}`)
    if (order_number_provided_by_brand){
      order_number_provided_by_brand = order_number_provided_by_brand.value
      const tracking_stage = document.getElementById(`TrackingStage-${each_id}`).value
      const track_id = each_id;
      let preparedData = {track_id, order_number_provided_by_brand, tracking_stage};
      if (removalRequest){preparedData['operation'] = 'delete'};
      return preparedData;
    }
  })
  const doAfter = (response)=>{
    ShowMessage('success', 'Tracking Updated !')
  };
  ShowWarning(()=>debounceImmediate(MakeRequest('UpdateTrackingData/', data, 'POST', doAfter), 599))
};

function GetTrackingData(){
  clearAll();
  current_IDs = [];
  const doAfter = (response)=>{
    const processedTrackingData = ProcessTrackingProducts(response);
    TrackingData = processedTrackingData;
    PlaceTrackingCards(TrackingData);
  };
  MakeRequest('GetOrderTrackings/', null, 'GET', doAfter)
}