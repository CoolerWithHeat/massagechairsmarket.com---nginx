var discounts = [];
var discount_edit_mode = false;
var current_discount = 0;
const getDiscount = (discounts, id)=>discounts.find(discount => discount.id === id);
const ClearListingWindow = ()=> document.getElementById('ProductListWindow').innerHTML = '';
const ClearFieldWindow = ()=> document.getElementById('FieldWindow').innerHTML = '';
const GetDiscountData = (discount)=>{
  const discount_type = discount.discount_type;
  const discount_amount = discount.discount_amount;
  const eligiblity = discount.eligible == 'new_customer_only' ? 'For New Customers' : 'For Everyone';
  const id = discount.id;
  if(discount_type == "fixed"){
    return {id:id, amount: `$${discount_amount}`, text:eligiblity};
  }
  if(discount_type == "percentage"){
    return {id:id, amount: `${discount_amount}%`, text:eligiblity};
  }
}
const GenerateDiscountType = (selectedOption, total_options=['fixed', 'percentage'])=>{
  const option = (optiona_name, selected)=>`<option ${(selected && selected == optiona_name) ? 'selected' : ''} value="${optiona_name}">${optiona_name}</option>`;
  const options = total_options.map(each_option => option(each_option, selectedOption))
  const wholeChoice = `
    <select id="Discount-type" required>
      <option value="0">Select Type</option>
      ${options.join('')}
    </select>
  `;
  return wholeChoice;
};
const GenerateDiscountEligibilty = (selectedOption, total_options=['new_customer_only', 'everyone'])=>{
  const option = (optiona_name, selected)=>`<option ${(selected && selected == optiona_name) ? 'selected' : ''} value="${optiona_name}">${optiona_name}</option>`;
  const options = total_options.map(each_option => option(each_option, selectedOption))
  const wholeChoice = `
    <select id="Discount-eligibilty" required>
      <option value="0">Select Eligibility</option>
      ${options.join('')}
    </select>
  `;
  return wholeChoice;
};
function setDiscountFields(edit_mode=false, data=null){
  ClearListingWindow();
  let title;
  let amount;
  let type;
  let eligible;
  let code;
  if (edit_mode && data){
    if(data.id){current_discount = data.id}
    title = data.discount_title;
    amount = data.discount_amount;
    type = data.discount_type;
    eligible = data.eligible;
    code = data.discount_code;
  }
  const fieldWindow = document.getElementById('FieldWindow');
  if (fieldWindow){
      const structure = `
            ${discount_edit_mode ? `
              <div style="width:100%; height:50px; display:flex; justify-content:right;">
                <a onclick="ShowWarning(DeleteDiscount)" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Delete</a>
              </div>` : ''}
            <br>
            <div>
              <div style="height:50px;">
                <svg style="cursor:pointer;" onclick="GetDiscounts();" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                </svg>
              </div>
              <br>
              <div class="input-style-3"><input value="${title || ''}" id="Discount-title" type="text" placeholder="Discount Title" required/></div>
              <div class="input-style-3"><input value="${amount || ''}" id="Discount-amount" type="number" placeholder="Discount Amount" required/></div>
              <div style="display: flex; justify-content: left; align-items: center; flex-wrap: wrap;">
                <div style="width: 175px; margin-left: 7px;" class="select-style-1">
                  <div class="select-position">
                   ${GenerateDiscountType(type)}
                  </div>
                </div>
                <div style="width: 175px; margin-left: 7px;" class="select-style-1">
                  <div class="select-position">
                    ${GenerateDiscountEligibilty(eligible)}
                  </div>
                </div>
              </div>
              <div class="input-style-3"><input value="${code ? String(code) : ''}" id="Discount-code" type="text" placeholder="Discount Code" required/></div>
              <a onclick="ValidateDiscountData();" href="javascript:void(0);" class="main-btn primary-btn-outline btn-hover">Done</a>
            </div>
          `;
      fieldWindow.innerHTML = structure; 
  }
}
function DeleteDiscount(){
  if (current_discount){
    const doAfter = (response)=>{ShowMessage('success', 'Deleted !'); GetDiscounts()};
    MakeRequest(`UpdateDiscount/${current_discount}/`, {operation: 'delete'}, 'POST', doAfter)
  };
}
function GetDiscountFieldData(){
  const title = document.getElementById('Discount-title');
  const amount = document.getElementById('Discount-amount');
  const type = document.getElementById('Discount-type');
  const is_eligible = document.getElementById('Discount-eligibilty');
  const code = document.getElementById('Discount-code');
  const discount_title = String(title.value).length ? title.value : null;
  const discount_amount = Number(amount.value) ? amount.value : null;
  const discount_type = String(type.value).length >= 4 ? type.value : null;
  const eligible = String(is_eligible.value).length >= 4 ? is_eligible.value : null;
  const discount_code = String(code.value).length ? code.value : null;
  if(discount_amount && discount_type && eligible){return {discount_title,  discount_amount, discount_type, eligible, discount_code}}
  else{ShowMessage('error', 'discount type, amount and eligibilty is a must...'); return null}
}
function ValidateDiscountData(){
  const fieldDiscount = GetDiscountFieldData();
  if(fieldDiscount){
    if (discount_edit_mode && current_discount){
      const doAfter = (response)=>{
        if (response.id){HandleID(response.id)};
        GetDiscounts();
      };
      MakeRequest(`UpdateDiscount/${current_discount}/`, fieldDiscount, 'POST', doAfter)
    }else{
      const doAfter = (response)=>{
        if (response.id){HandleID(response.id)};
        GetDiscounts();
        ShowMessage('success', "Discount Created !")
      };
      MakeRequest(`CreateDiscount/`, fieldDiscount, 'POST', doAfter)
    }
  }
}
function listDiscounts(discounts=[]){
  ClearFieldWindow();
  const Discountswindow = document.getElementById('ProductListWindow');
  const structure = (Discount)=> `
      <div class="col-xl-4 col-lg-6 col-12 productCardSided">
        <div style="min-height:175px;" class="card-style-5 mb-30">
          <div class="card-content">
            <h4>${GetDiscountData(Discount).amount} discount</h4>
            <small>${GetDiscountData(Discount).text}</small>
            <div style="min-width:100%; border-top:solid; border-color:#FFBF00	;"></div>
            <a style="float:right;" class="main-btn primary-btn btn-hover" onclick="editDiscount(${GetDiscountData(Discount).id})">Change</a>
          </div>
        </div>
      </div>
    `;
  if (Discountswindow){Discountswindow.innerHTML = '<div style="width:100%; height:60px;"><a onclick="setDiscountFields();" style="float:right;" href="javascript:void(0);" class="main-btn dark-btn-outline square-btn btn-hover">Add</a></div>'}
  if (Array.isArray(discounts) && discounts.length && Discountswindow){
    discounts.forEach(each_discount=>{
      const brandComponent = structure(each_discount);
      Discountswindow.innerHTML += brandComponent;
    })
  }
}
function editDiscount(discount_id){
  if (discount_id){current_discount = discount_id; discount_edit_mode = true}
  const requested_discount = getDiscount(discounts, discount_id);
  if (requested_discount){
    setDiscountFields(true, requested_discount);
    ClearListingWindow();
  }
}
function GetDiscounts(){
  current_discount=null
  const doAfter = (response)=>{
    if (response){
      discounts = response;
      listDiscounts(discounts);
    }
  }
  MakeRequest('GetDiscounts/', null, 'GET', doAfter)
}
// GetDiscounts();