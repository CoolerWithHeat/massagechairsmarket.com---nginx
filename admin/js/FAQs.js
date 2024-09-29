let FAQs = [];
let openedFAQ = null;
let additionMode = false;
let existingPriorites = [];
let next_FAQ_priority = 1;
const getFAQ = (faqs, id)=>faqs.find(faqs => faqs.id === id);
const handleFAQAddition = ()=>{
  const FAQ_window = document.getElementById('ProductListWindow');
  additionMode = true;
  FAQ_window.innerHTML = insideFAQ_strucutre();
};
const insideFAQ_strucutre = (question, answer, priority)=>`
      <div style="height:50px;">
        <svg style="cursor:pointer;" onclick="GetFAQs();" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </div>
      <div class="input-style-2">
        <input value="${question || ''}" id="FAQ-question" type="text" placeholder="Question " required/>
      </div>
      <div class="input-style-2">
        <input value="${answer || ''}" id="FAQ-answer" type="text" placeholder="Answer " required/>
      </div>
      <div class="input-style-2">
        <input value="${additionMode ? next_FAQ_priority : priority || ''}" id="FAQ-priority" type="number" placeholder="priority " required/>
      </div>
      <br>
      <div style="display:flex; width:75px; height:50px; float:right">
        <a onclick="SaveFAQ();" class="main-btn secondary-btn-outline btn-hover">Save</a>
      </div>
      ${openedFAQ ? 
      `
        <div>
          <a onclick="FAQ_remove_request();" style="width:75px; height:50px;" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Remove</a>
        </div>
      ` : ''
      }
    `;
function FAQ_remove_request(){
  if (openedFAQ.id){
    const doAfter = (response)=>{
      if (response){ShowMessage('success', 'Removed!'), GetFAQs()}
    }
    ShowWarning(()=>{MakeRequest(`RemoveFAQ/${openedFAQ.id}/`, null, 'POST', doAfter)})
  };
};
function DataWithout(array, value) {
    const index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}
function SaveFAQ(){
  if (openedFAQ || additionMode){
    const FAQ_id = openedFAQ ? openedFAQ.id : null;
    const FAQ_Question = document.getElementById('FAQ-question');
    const FAQ_answer = document.getElementById('FAQ-answer');
    const FAQ_priority = document.getElementById('FAQ-priority');
    const question = FAQ_Question.value;
    const answer = FAQ_answer.value;
    const priority = FAQ_priority.value;
    if ((FAQ_id || additionMode) && question && answer && priority){
      const doAfter = (response)=>{
        if(!response){return ShowMessage('error', 'Priority clash !')};
        ShowMessage('success', 'Saved !');
        return GetFAQs();
      };
      if (additionMode){
        if (existingPriorites.includes(Number(priority))){
          ShowWarning(()=>MakeRequest(`SwapFAQ/${priority}/`, {question, answer, priority}, 'POST', doAfter), false, 'Priority clash expected')
        }else{
          MakeRequest('CreateFAQ/', {question, answer, priority}, 'POST', doAfter)
        }
      }else{
        const isDuplicate = DataWithout(existingPriorites, Number(openedFAQ.priority)).includes(Number(priority));
        const duplicateRequest = ()=>MakeRequest(`SwapEach/${openedFAQ.id}/${priority}/`, {question, answer, priority}, 'POST', doAfter);
        const saveRequest = ()=>MakeRequest(`UpdateFAQ/${FAQ_id}/`, {question, answer, priority}, 'POST', doAfter);
        if (isDuplicate){ShowWarning(duplicateRequest, false, 'priorities gets swapped!')}
        if (!isDuplicate){saveRequest()}
      }
    }else{
      ShowMessage('error', 'All fields needs to be filled!')
    }
  };
}
function OpenFAQ(id){
  const requested_FAQ = getFAQ(FAQs, id);
  if (requested_FAQ){
    openedFAQ = requested_FAQ;
    const FAQ_window = document.getElementById('ProductListWindow')
    FAQ_window.innerHTML = insideFAQ_strucutre(requested_FAQ.question, requested_FAQ.answer, requested_FAQ.priority)
  };
};
function listFAQs(data=[]){
  if (Array.isArray(data)){FAQs = data}
  const FAQ_window = document.getElementById('ProductListWindow');
  const structure = (id, priority)=> `
      <div class="col-xl-4 col-lg-6 col-12 productCardSided">
        <div style="height:236px;" class="card-style-5 mb-30">
          <div class="card-content">
            <h4><a>FAQ at priority ${priority}</a></h4>
            <a href="javascript:void(0);" class="main-btn primary-btn btn-hover" onclick="OpenFAQ(${id})">Change</a>
          </div>
        </div>
      </div>
    `;
  FAQ_window.innerHTML = '<div style="width:100%; height:60px;"><a onclick="handleFAQAddition();" style="float:right;" href="javascript:void(0);" class="main-btn dark-btn-outline square-btn btn-hover">Add</a></div>';  
  next_FAQ_priority=data.length ? data.length+1 : 1;
  if (FAQ_window){
    const all_FAQs = data.map(each=>{existingPriorites.push(each.priority); return structure(each.id, each.priority);});
    FAQ_window.innerHTML += all_FAQs.join('');
  };
};
function GetFAQs(){
  additionMode = false;
  existingPriorites = [];
  const ClearAllFirst = ()=> (document.getElementById('ProductListWindow').innerHTML = '', document.getElementById('FieldWindow').innerHTML = '', document.getElementById('OpenedWindow').innerHTML = '');
  ClearAllFirst();
  MakeRequest('GetAllFAQs/', null, 'GET', listFAQs)
};