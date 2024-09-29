function createRedirectSlug(title) {return title.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');}
function ListReviews(reviewsList=[]){
    const reviewsWindow = document.getElementById('ProductListWindow');
    const reviews = reviewsList.map(each_review=>{
    const structure = (review_text, review_author, product_details, customer_location, customer_rating, review_id)=> `
        <div class="col-xl-4 col-lg-6 col-12 productCardSided">
          <div style="width: auto; min-width: 100%;"  class="card-style-5 mb-30">
            <div style="max-width: 46px; " class="card-image">
              <img style="width: 45px; height: 45px;" src="images/reviews.png" alt="">
            </div>
            <div class="card-content">
              <h4><a>By ${review_author || ''}</a></h4>
              <div style="height:25px;">
                <small style="font-size:9px;">${customer_location || ''}</small>
              </div>
              <div style="border-left:solid; border-bottom:solid; border-width:1px;">
                <p class="ReviewTextBox" style="padding:1px;">${review_text || ''}</p>
              </div>
              <hr>
              <div><p style="font-size:12px;">For product: <a style="font-size:13px;" href="/Buy/${product_details.id}/${createRedirectSlug(product_details.title)}/">${product_details.title}</a></p></div>
              <div style="display:flex; justify-content:right;">
                <a onclick="ShowWarning(()=>DeleteReview(${review_id}))" style="width:40px; height:30px;" href="javascript:void(0);" class="main-btn danger-btn square-btn btn-hover">Remove</a>
              </div>
              <small style="font-size:9px;">Rating: ${customer_rating || ''}</small>
            </div>
          </div>
        </div>
    `;
    const review_id = each_review.id;
    const text = each_review.review_text;
    const poster = each_review.poster;
    const poster_for_product = each_review.posted_for;
    const customer_location = each_review.poster_location;
    const rate = each_review.customer_rate;
    return structure(text, poster, poster_for_product, customer_location, rate, review_id)
    })
    reviewsWindow.innerHTML = reviews.join('')
  };
  function DeleteReview(id){
    if (!id){return true};
    const doAfter = (response)=>{if (response){ShowMessage('success', 'Removed!'); getReviews()}};
    MakeRequest(`DeleteReview/${id}/`, null, 'POST', doAfter);
  };
  function getReviews(){
    const doAfter = (response)=>{ListReviews(response)};
    MakeRequest('GetReviews/', null, 'GET', doAfter)
  };