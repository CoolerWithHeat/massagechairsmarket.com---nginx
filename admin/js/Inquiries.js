var retrieved_questions = [];
let allSelected = false;
let filterSet = false;
const getQuestion = (questions, id)=>questions.find(question => question.id === id);

const checkInquiryFilter = ()=>{
  const filterHolder = document.getElementById('InquiryFilterAll');
  if (filterHolder){
    filterHolder.addEventListener('change', (event)=>{
      allSelected = event.target.checked;
      FetchAllQuestions(!allSelected);
    })
  }; 
};

const openInquiryMode = (inquiry_id)=>{
  const requestedQuestion = getQuestion(retrieved_questions, inquiry_id)
  HandleID(inquiry_id)
  if (requestedQuestion){
    const structure = `
          <div style="height:50px;">
            <svg style="cursor:pointer;" onclick="FetchAllQuestions(${!allSelected});" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg>
          </div>
          <hr>
          <div class="QuestionItem">
            <div>
              <h1 style="font-size: 22px;" class="display-1">Question By ${requestedQuestion.customer_name}</h1>
            </div>
            <hr>
            <div style="width: 100%; height: auto;">
              <h1 style="font-size: 12px;" class="display-1">${requestedQuestion.customer_email}</h1>
            </div>
            <hr>
            <div style="width: 100%; height: auto;">
                <p style="font-size: 11px;">${requestedQuestion.customer_question}</p>
            </div>
            <hr>
            <div style="display: flex; justify-content: space-between;">
              <div>
                <input ${requestedQuestion.handled ? 'checked' : ''} class="form-check-input" type="checkbox" id="QuestionStatus-${inquiry_id}" /> <small>Handled</small>
              </div>
              <div>
                <a style="width: 50px; height: 50px;" href="javascript:void(0);" onclick="SaveInquiryStatus(${inquiry_id});" class="main-btn primary-btn square-btn btn-hover">Save</a>
              </div>
            </div>
          </div>
        `;
    const questionsWindow = document.getElementById('ProductListWindow');
    if (questionsWindow){questionsWindow.innerHTML = structure};
  };
};

function SaveInquiryStatus(question_id){
  if (question_id){
    const inquiryStatus = document.getElementById(`QuestionStatus-${question_id}`)
    const doAfter = (response)=>{
      if (response){ShowMessage('success', 'Updated!'); return '';}
      ShowMessage('error', 'failed!');
    };
    MakeRequest('UpdateInquiryStatus/', {id: question_id, handled:inquiryStatus.checked}, 'POST', doAfter)
  };
};

function listQuestions(data=[]){
  const questionsWindow = document.getElementById('ProductListWindow')
  const structure = (id, inquiry_sender, handled)=> `
      <div class="col-xl-4 col-lg-6 col-16 productCardSided">
        <div style="height:236px;" class="card-style-5 mb-30">
          <div class="card-content">
            <h4><a>Question By ${inquiry_sender}</a></h4>
            <a href="javascript:void(0);" class="main-btn primary-btn btn-hover" onclick="openInquiryMode(${id})">See</a>
            <div style="width:100%; heigh:50px; display:flex; justify-content:right; margin-top:-15%">
              ${handled ? '<small style="color:white; background-color:#28a745; width:65px; border-radius:46%; height:40px; display:flex; justify-content:center; align-items:center;">handled</small>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  if (questionsWindow){
    const all_questions = data.map(each=>structure(each.id, each.customer_name, each.handled))
    questionsWindow.innerHTML = `
        <div style="width: 100%; display: flex; justify-content: right;">
          <input ${allSelected ? 'checked' : ''} class="form-check-input" type="checkbox" id="InquiryFilterAll" /> 
          <small style="margin-left: 5px;">All</small>
        </div>
      `;
    questionsWindow.innerHTML += all_questions.join('')
    if(!filterSet){checkInquiryFilter();}
  }
};
function FetchAllQuestions(unhandledOnly=true){
  const filterQuestions = (data)=>data.filter(each=>!each.handled)
  const doAfter = (response)=>{listQuestions(unhandledOnly ? filterQuestions(response) : response); retrieved_questions=response || [];};
  MakeRequest('GetQuestions/', null, 'GET', doAfter)
}