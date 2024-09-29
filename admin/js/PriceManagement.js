function PlacePricingBar(){
    const formWindow = document.getElementById('FieldWindow');
    const interface = `
        <div style="border-radius:15px; padding: 1%; width: 320px; height: 350px; background-color: rgb(175, 2, 255); display: flex; margin: auto; margin-top:75px; flex-wrap: wrap;">
        <div style="width: 100%; height: 60px;">
            <h1 style="text-align: center; color: white;">Adjust Pricing</h1>
        </div>
        <div class="input-style-1">
            <input id="PriceChangeValue" type="number">
        </div>
        <div class="input-style-1">
            <select id="ChangeType" style="width: 50px;">
                <option value="$">$</option>
            </select>
        </div>
        <div style="width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <ul>
            <a id="PriceApplyPoint" href="javascript:void(0);" class="main-btn secondary-btn rounded-full btn-hover">
                Apply Price Globally
            </a>
            </ul>
            <br>
            <ul>
            <a id="PriceResetPoint" href="javascript:void(0);" class="main-btn warning-btn rounded-full btn-hover">
                Reset All Changes
            </a>
            </ul>
        </div>
        </div>
    `;
    if (formWindow){
        formWindow.innerHTML = interface;
        ListenToPriceChanges();
    };
};

function getPriceChanges(){
    const priceValue = document.getElementById('PriceChangeValue');
    const changeType = document.getElementById('ChangeType');
    if (priceValue && changeType){
        const value = priceValue.value || 0;
        const type = changeType.value;
        if (value){return {value, type}};
    };
    return 0;
}

function HandlePriceChange(){
    const data = getPriceChanges();
    if (data){
        ShowMessage('warning', 'Updating...');
        const doAfter = (response)=>{
            if (response){
                ShowMessage('success', 'Price Updated!');
            };
        };
        MakeRequest('AdjustPrice/', data, 'POST', doAfter)
    }else{
        ShowMessage('error', 'insufficient data');
    };
};

function HandlePriceReset(){
    ShowMessage('warning', 'Updating...');
    const doAfter = (response)=>{
        if (response){
            PlacePricingBar();
            ShowMessage('success', 'Price Updated!');
        };
    };
    MakeRequest('AdjustPrice/', {operation: 'reset'}, 'POST', doAfter)
};

function ListenToPriceChanges(){
    const applyButton = document.getElementById('PriceApplyPoint');
    const resetButton = document.getElementById('PriceResetPoint');
    if (applyButton){applyButton.addEventListener('click', HandlePriceChange)};
    if (resetButton){resetButton.addEventListener('click', HandlePriceReset)};
};