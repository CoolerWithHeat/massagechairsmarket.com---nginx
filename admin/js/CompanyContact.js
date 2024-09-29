const PlaceContactData = (data={})=>{
    const ContactWindow = document.getElementById('FieldWindow');
    if (data && ContactWindow){
      const structure = `
          <div class="input-style-2">
            <label for="company-number">Contact Number</label>
            <input value="${data.phone_number || ''}" id="company-number" type="text" placeholder="Phone Number " required />
          </div>
          <div class="input-style-2">
            <label for="company-email">Email</label>
            <input value="${data.company_email || ''}" id="company-email" type="email" placeholder="Email Address " required />
          </div>
          <div>
            <a onclick="SaveCompanyContact()" class="main-btn active-btn-outline square-btn btn-hover">Save</a>
          </div>
        `;
      ContactWindow.innerHTML = structure;
    }
  };
  const GetCompanyData = () => {
    const phone_number = document.getElementById('company-number').value;
    const company_email = document.getElementById('company-email').value;
    if (phone_number && company_email) {
      return { phone_number, company_email }
    } else {
      ShowMessage('error', 'Both fields are required !')
    }
  };

  function SaveCompanyContact() {
    const data = GetCompanyData();
    if (data) {
      const doAfter = (response) => {
        ShowMessage('success', 'Updated Successfully')
      };
      MakeRequest('UpdateCompanyContactInfo/', data, 'POST', doAfter)
    }
  }

  function GetCompanyContact() {
    const doAfter = (response) => {
      PlaceContactData(response)
    };
    MakeRequest('GetCompanyContactInfo/', null, 'GET', doAfter)
  }
//   GetCompanyContact();