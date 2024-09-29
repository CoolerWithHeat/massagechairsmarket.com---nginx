var orders = [];
var current_order = 0;
const getOrder = (orders, id) => orders.find(order => order.id === id);
function openPaymentEditMode(order_id) {
  const requested_order = getOrder(orders, order_id);
  if (requested_order) {
    current_order = order_id;
    setOrderFields(requested_order);
  }
}
function setOrderFields(data) {
  shutProductsList()
  if (data) {
    const fieldWindow = document.getElementById('FieldWindow');
    const shippingField = GetShippingData(data.shipping_address) || '';
    const structure = `
          <div style="width:100%; height:50px; display:flex; justify-content:right;">
            <a href="${host_itself}Order/${data.order_number}/" class="main-btn warning-btn-outline square-btn btn-hover">Check</a>
          </div>
          <br>
          <div style="width:100%; height:50px; display:flex; justify-content:right;">
            <a onclick="ShowWarning(()=>{DeleteOrder(${data.id})})" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Delete</a>
          </div>
          <br>
          <div style="height:50px;">
            <svg onclick="ListOrders();" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black"
              class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
          </div>
          <div class="input-style-2">
            <label for="order-number">Order Number</label>
            <input value="${data.order_number}" id="order-number" type="text" placeholder="Order Number " required />
          </div>
          <div class="input-style-2">
            <label for="order-email">Associated Email</label>
            <input value="${data.associated_email}" id="order-email" type="email" placeholder="Associated Email " required />
          </div>
          <div class="input-style-2">
            <label for="order-session">Order Session</label>
            <input value="${data.session}" id="order-session" type="text" placeholder="Order Session " required />
          </div>
          <div class="input-style-2">
            <label for="order-expected-amount">Expected Amount</label>
            <input value="${data.expected_amount}" id="order-expected-amount" type="text" placeholder="Expected Amount " required />
          </div>
          <div class="form-check form-switch toggle-switch mb-30">
            <input ${data.completed ? 'checked' : ''} id="order-completed" class="form-check-input" type="checkbox" id="toggleSwitch1" />
            <label class="form-check-label" for="toggleSwitch1">Order Completed</label>
          </div>
          <div id="ShippingField" class="input-style-2">
            ${shippingField}
          </div>
          <div class="input-style-2">
            <label for="order-products">Verified Cart</label>
            <textarea placeholder="Ordered Products" id="order-products">${String(data.verified_cart.join(''))}</textarea>
          </div>
          <div class="form-check form-switch toggle-switch mb-30">
            <input ${data.first_time_view ? 'checked' : ''} id="first_time_view" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="first_time_view">First Time View</label>
          </div>
          <div class="form-check form-switch toggle-switch mb-30">
            <input ${data.order_closed ? 'checked' : ''} id="order-closed" class="form-check-input" type="checkbox"/>
            <label class="form-check-label" for="order-closed">Order Closed</label>
          </div>
          <a onclick="HandleOrderChanges(${data.id});" class="main-btn active-btn-outline square-btn btn-hover">Save</a>
        `;
    if(fieldWindow){fieldWindow.innerHTML = structure;};
  }
}
const GenerateOrderCard = (data = []) => {
  const structure = (id, completed) => `
        <div class="col-xl-4 col-lg-6 col-12 productCardSided">
          <div class="card-style-5 mb-30">
            <div class="card-content">
              ${completed ? '<h4>Completed Order</h4>' : '<h4 style="color:red;">Uncompleted Order</h4>'}
              <a href="javascript:void(0);" class="main-btn primary-btn btn-hover" onclick="openPaymentEditMode(${id})">Change</a>
            </div>
          </div>
        </div>
      `;
  if (data) {
    const ordersWindow = document.getElementById('ProductListWindow')
    if (ordersWindow) {
      data.forEach(each_payment => {
        if (each_payment.id) {
          HandleID(each_payment.id)
          const orderCard = structure(each_payment.id, each_payment.completed);
          ordersWindow.innerHTML += orderCard;
        }
      })
    }
  }
};
function GetShippingData(data) {
  if (data){
    const structure = `
                <div style="border-style: solid; border-radius: 12px; border-width: 1px; padding: 1%;">
                  <label for="order-shipment-details">Shipping Details</label>
                  <div style="width: 100%; min-height: 150px; display: flex; justify-content:left; flex-wrap: wrap; align-items: center;">
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_name">First Name</label>
                        <input value="${data.firstname}" id="customer_name" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_lastname">Last Name</label>
                        <input value="${data.lastname || ''}" id="customer_lastname" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="apt_suite_unit">Apt/Suite/Unit No</label>
                        <input value="${data.apartment_suite || ''}" id="apt_suite_unit" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_address">Address</label>
                        <input value="${data.address}" id="customer_address" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_zipcode">Zip Code</label>
                        <input value="${data.zipcode}" id="customer_zipcode" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_city">City</label>
                        <input value="${data.city}" id="customer_city" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_state">State</label>
                        <input value="${data.state || ''}" id="customer_state" type="text" required/>
                      </div>
                    </div>
                    <div style="width: 160px; height: 100px;">
                      <div class="input-style-2">
                        <label for="customer_phone_number">Phone Number</label>
                        <input value="${data.phone_number}" id="customer_phone_number" type="text" required/>
                      </div>
                    </div>
                  </div>
                  <div style="width: 100%; display: flex; justify-content: right;"><a onclick="UpdateCustomerShippingAddress(${data.id});" class="main-btn info-btn-outline rounded-full btn-hover">Save</a></div>
                </div>
              `;
        return structure;
  }
  return '';
}
function UpdateCustomerShippingAddress(id){
  const firstname = document.getElementById('customer_name').value || null;
  const lastname = document.getElementById('customer_lastname').value || null;
  const apartment_suite = document.getElementById('apt_suite_unit').value || null;
  const address = document.getElementById('customer_address').value || null;
  const zipcode = document.getElementById('customer_zipcode').value || null;
  const city = document.getElementById('customer_city').value || null;
  const state = document.getElementById('customer_state').value || null;
  const phone_number = document.getElementById('customer_phone_number').value || null;
  if (!firstname || !address || !zipcode || !city || !state || !phone_number){ShowMessage('error', 'Insufficient Data !'); return 0};
  UpdateShippingInformation(id, {firstname, lastname, apartment_suite, address, zipcode, city, state, phone_number})
  return 0;
}
function HandleOrderChanges(id){
  const order_number = document.getElementById('order-number').value || null;
  const associated_email = document.getElementById('order-email').value || null;
  const session = document.getElementById('order-session').value || null;
  const expected_amount = document.getElementById('order-expected-amount').value || null;
  const completed = document.getElementById('order-completed').checked || false;
  const first_time_view = document.getElementById('first_time_view').checked || false;
  const order_closed = document.getElementById('order-closed').checked || false;
  if (!order_number || !associated_email || !session || !expected_amount){ShowMessage('error', 'Insufficient Data !'); return 0};
  UpdateOrderInformation(id, {order_number, associated_email, session, expected_amount, completed, first_time_view, order_closed})
  return 0;
}
function DeleteOrder(id){
  const doAfter = (response)=>{
    ShowMessage('success', 'Order Deleted !')
    ListOrders();
  };
  MakeRequest(`UpdateOrder/${id}/`, {operation:'delete'}, 'POST', doAfter)
  return 0;
}
function UpdateOrderInformation(data_id, data){
  if (data_id && data){
    const doAfter = (response)=>{
      ShowMessage('success', 'Order Data Updated !'); 
      HandleID(response.id)
    };
    MakeRequest(`UpdateOrder/${data_id}/`, data, 'POST', doAfter)
  }
}
function UpdateShippingInformation(data_id, data){
  if (data_id && data){
    const doAfter = (response)=>{
      ShowMessage('success', 'Shipping Data Updated !'); 
      HandleID(response.id)
    };
    MakeRequest(`UpdateShipping/${data_id}/`, data, 'POST', doAfter)
  }
}
function ListOrders() {
  const doAfter = (response) => {
    shutFieldWindow();
    if (response) { orders = response; GenerateOrderCard(response); }
  }
  MakeRequest('GetOrders/', null, 'GET', doAfter)
}
// ListOrders();