

      let chart1;
      let chart2;
      
      // =========== chart one start
      function PlaceYearlyIncomeAnalytics(analysis){
        const ctx1 = document.getElementById("Chart1").getContext("2d");
        const yearlyTotal = document.getElementById('YearlyIncomeStat');
        const incomeSoFar = analysis.monthly_income_analysis ? analysis.monthly_income_analysis.total : 0;
        const mongthlyIncomeSoFar = analysis.monthly_income_analysis ? analysis.monthly_income_analysis.each_month : 0;
        if (yearlyTotal){yearlyTotal.textContent = `$${incomeSoFar}`}
        if (ctx1)
          chart1 = new Chart(ctx1, {
            type: "line",
            data: {
              labels: [
                "Jan",
                "Fab",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: "",
                  backgroundColor: "transparent",
                  borderColor: "#365CF5",
                  data: mongthlyIncomeSoFar,
                  pointBackgroundColor: "transparent",
                  pointHoverBackgroundColor: "#365CF5",
                  pointBorderColor: "transparent",
                  pointHoverBorderColor: "#fff",
                  pointHoverBorderWidth: 5,
                  borderWidth: 5,
                  pointRadius: 8,
                  pointHoverRadius: 8,
                  cubicInterpolationMode: "monotone",
                },
              ],
            },
            options: {
              plugins: {
                tooltip: {
                  callbacks: {
                    labelColor: function (context) {
                      return {
                        backgroundColor: "#ffffff",
                        color: "#171717"
                      };
                    },
                  },
                  intersect: false,
                  backgroundColor: "#f9f9f9",
                  title: {
                    fontFamily: "Plus Jakarta Sans",
                    color: "#8F92A1",
                    fontSize: 12,
                  },
                  body: {
                    fontFamily: "Plus Jakarta Sans",
                    color: "#171717",
                    fontStyle: "bold",
                    fontSize: 16,
                  },
                  multiKeyBackground: "transparent",
                  displayColors: false,
                  padding: {
                    x: 30,
                    y: 10,
                  },
                  bodyAlign: "center",
                  titleAlign: "center",
                  titleColor: "#8F92A1",
                  bodyColor: "#171717",
                  bodyFont: {
                    family: "Plus Jakarta Sans",
                    size: "16",
                    weight: "bold",
                  },
                },
                legend: {
                  display: false,
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: false,
              },
              scales: {
                y: {
                  grid: {
                    display: false,
                    drawTicks: false,
                    drawBorder: false,
                  },
                  ticks: {
                    padding: 35,
                    max: 1200,
                    min: 500,
                  },
                },
                x: {
                  grid: {
                    drawBorder: false,
                    color: "rgba(143, 146, 161, .1)",
                    zeroLineColor: "rgba(143, 146, 161, .1)",
                  },
                  ticks: {
                    padding: 20,
                  },
                },
              },
            },
          });
      }
      // =========== chart one end

      // =========== chart two start
      function PlaceSalesAnalytics(analysis){
        const ctx2 = document.getElementById("Chart2").getContext("2d");
        if (ctx2)
          chart2 = new Chart(ctx2, {
          type: "bar",
          data: {
            labels: [
              "Jan",
              "Fab",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "",
                backgroundColor: "#365CF5",
                borderRadius: 30,
                barThickness: 6,
                maxBarThickness: 8,
                data: analysis.monthly_sales_analysis,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  titleColor: function (context) {
                    return "#8F92A1";
                  },
                  label: function (context) {
                    let label = context.dataset.label || "";

                    if (label) {
                      label += ": ";
                    }
                    label += context.parsed.y;
                    return label;
                  },
                },
                backgroundColor: "#F3F6F8",
                titleAlign: "center",
                bodyAlign: "center",
                titleFont: {
                  size: 12,
                  weight: "bold",
                  color: "#8F92A1",
                },
                bodyFont: {
                  size: 16,
                  weight: "bold",
                  color: "#171717",
                },
                displayColors: false,
                padding: {
                  x: 30,
                  y: 10,
                },
            },
            },
            legend: {
              display: false,
              },
            legend: {
              display: false,
            },
            layout: {
              padding: {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                grid: {
                  display: false,
                  drawTicks: false,
                  drawBorder: false,
                },
                ticks: {
                  padding: 35,
                  stepSize: 1,
                  max: 1200,
                  min: 0,
                },
              },
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                  color: "rgba(143, 146, 161, .1)",
                  drawTicks: false,
                  zeroLineColor: "rgba(143, 146, 161, .1)",
                },
                ticks: {
                  padding: 20,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
          },
        });
      }
      // =========== chart two end

      // =========== chart three start

        // =========== chart four end


        // CUSTOM CODE HERE !!!

      const AnalyticsWindowStructure = (callback=null)=>{
        const Requestedwindow = document.getElementById('OpenedWindow');
        const structure = `
              <section class="section">
                <div class="container-fluid">
                  <!-- ========== title-wrapper end ========== -->
                  <div id="FirstAnalyticsHub" class="row">
                    
                    </div>
                    <!-- End Col -->
                  </div>
                  <!-- End Row -->
                  <div class="row">
                    <div class="col-lg-7">
                      <div class="card-style mb-30">
                        <div class="title d-flex flex-wrap justify-content-between">
                          <div class="left">
                            <h6 class="text-medium mb-10">Monthly Stats</h6>
                            <h3 id="YearlyIncomeStat" class="text-bold">$0</h3>
                          </div>
                          <div class="right">
                            <div class="select-style-1">
                              <div class="select-position select-sm">
                                <select class="light-bg">
                                  <option value="">Monthly</option>
                                </select>
                              </div>
                            </div>
                            <!-- end select -->
                          </div>
                        </div>
                        <!-- End Title -->
                        <div class="chart">
                          <canvas id="Chart1" style="width: 100%; height: 400px; margin-left: -35px;"></canvas>
                        </div>
                        <!-- End Chart -->
                      </div>
                    </div>
                    <!-- End Col -->
                    <div class="col-lg-5">
                      <div class="card-style mb-30">
                        <div class="title d-flex flex-wrap align-items-center justify-content-between">
                          <div class="left">
                            <h6 class="text-medium mb-30">Sales</h6>
                          </div>
                          <div class="right">
                            <div class="select-style-1">
                              <div class="select-position select-sm">
                                <select class="light-bg">
                                  <option value="">Monthly</option>
                                  <!-- <option value="">Monthly</option>
                                  <option value="">Weekly</option> -->
                                </select>
                              </div>
                            </div>
                            <!-- end select -->
                          </div>
                        </div>
                        <!-- End Title -->
                        <div class="chart">
                          <canvas id="Chart2" style="width: 100%; height: 400px; margin-left: -45px;"></canvas>
                        </div>
                        <!-- End Chart -->
                      </div>
                    </div>
                    <!-- End Col -->
                  </div>
                  <!-- End Row -->
                </div>
                <!-- end container -->
              </section>
            `;
        if (Requestedwindow){Requestedwindow.innerHTML = structure;}
        if (callback){setTimeout(() => {callback()}, 99);}
      };

      function TwoDecimalsOnly(num) {
        const numStr = num.toString();
        const parts = numStr.split('.');
        if (parts.length === 1) return numStr;
        return `${parts[0]}.${parts[1].slice(0, 2)}`;
      }   
      
      async function MakeRequest(pathname, body, type, callback, additional_callback=null){
          const request = await fetch(host+pathname, {
              'method': type,
              headers: {
                  'Content-Type': 'applicationjson',
                  'Authorization': `Bearer ${admin_token}`,
              },  
              'body': type == "POST" ? JSON.stringify(body) : null,
          })
          if ((request.status == 201) || (request.status == 200)){
              const response = await request.json();
              if (callback){callback(response)}
              if (additional_callback){additional_callback()}
              return 1;
          }
          if ((request.status == 403) || (request.status == 401)){
            window.location.href = '/admin/login/'
          }
          else if(callback){
              try{
                  callback(false)
              }catch{
                console.log(request.status)
              }
          }
      }

      const getTodaysOrders = (data)=>{
        const changes = data.sales_change_percentage;
        const is_positive = changes > 0;
        const changes_sign = `
                 ${is_positive ? `
                  <p class="text-sm text-success">
                    <i class="lni lni-arrow-up"></i> +${TwoDecimalsOnly(changes || 0)}%
                    <span class="text-gray">(yesterday)</span>
                  </p>` 
                : 
                `<p class="text-sm text-danger">
                    <i class="lni lni-arrow-down"></i> ${TwoDecimalsOnly(changes || 0)}%
                    <span class="text-gray"> Decrease</span>
                  </p>`}`;
        return `
            <div class="col-xl-3 col-lg-4 col-sm-6">
              <div class="icon-card mb-30">
                <div class="icon purple">
                  <i class="lni lni-cart-full"></i>
                </div>
                <div class="content">
                  <h6 class="mb-10">Today Orders</h6>
                  <h3 class="text-bold mb-10">${data.todays_sales ? data.todays_sales.length : 0}</h3>
                  ${changes_sign}
                </div>
              </div>
              <!-- End Icon Cart -->
            </div>
        `
      }

      const getTotalIncome = (data)=>{
        const changes = data.income_change_percent;
        const is_positive = changes > 0;
        const Unchanged = (changes || 0) == 0;
        const changes_sign = `
                 ${is_positive ? `
                  <p class="text-sm text-success">
                    <i class="lni lni-arrow-up"></i> +${TwoDecimalsOnly(changes || 0)}%
                    <span class="text-gray">Increased</span>
                  </p>` 
                : 
                `<p class="text-sm text-danger">
                    <i class="lni lni-arrow-down"></i> ${TwoDecimalsOnly(changes || 0)}%
                    <span class="text-gray"> Decrease</span>
                  </p>`}`;
        return `
            <div class="col-xl-3 col-lg-4 col-sm-6">
              <div class="icon-card mb-30">
                <div class="icon success">
                  <i class="lni lni-dollar"></i>
                </div>
                <div class="content">
                  <h6 class="mb-10">Total Income</h6>
                  <h3 class="text-bold mb-10">$${data.total_income || 0}</h3>
                  ${Unchanged ? '<span class="text-gray">Unchanged</span>' : changes_sign}
                </div>
              </div>
              <!-- End Icon Cart -->
            </div>
        `}

      const getTotalOrders = (data)=>`
            <div class="col-xl-3 col-lg-4 col-sm-6">
              <div class="icon-card mb-30">
                <div class="icon primary">
                  <i class="lni lni-credit-cards"></i>
                </div>
                <div class="content">
                  <h6 class="mb-10">Total Orders</h6>
                  <h3 class="text-bold mb-10">${data.total_sales ? data.total_sales.length : 0}</h3>
                  <p class="text-sm text-danger">
                    <span class="text-gray">So Far</span>
                  </p>
                </div>
              </div>
              <!-- End Icon Cart -->
            </div>
        `
      const getTotalSubscribers = (data)=>`
            <div class="col-xl-3 col-lg-4 col-sm-6">
              <div class="icon-card mb-30">
                <div class="icon orange">
                  <i class="lni lni-user"></i>
                </div>
                <div class="content">
                  <h6 class="mb-10">Total Subscribers</h6>
                  <h3 class="text-bold mb-10">${data.total_subscribers}</h3>
                  <p class="text-sm text-danger">
                    <span class="text-gray">So Far</span>
                  </p>
                </div>
              </div>
              <!-- End Icon Cart -->
            </div>
        `
        function PlaceAnalytics(market_data){
          const analyticsWindow = document.getElementById('FirstAnalyticsHub');
            if (analyticsWindow){
              const analyticsData = `
                ${getTodaysOrders(market_data)}
                ${getTotalIncome(market_data)}
                ${getTotalOrders(market_data)}
                ${getTotalSubscribers(market_data)}
              `;
              analyticsWindow.innerHTML = analyticsData;
            };
            PlaceYearlyIncomeAnalytics(market_data);
            PlaceSalesAnalytics(market_data);
        };
        const RunDashboard = ()=>{
          MakeRequest('AdminDetails/', null, 'GET', (response)=>{AnalyticsWindowStructure(); PlaceAnalytics(response)});
        };