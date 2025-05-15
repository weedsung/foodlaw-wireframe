


    // ... existing code ...

    // 단계별 이동 함수
    function nextStep() {
      const currentStep = document.querySelector('.step-content.active');
      
      // step4(표시사항)에서 다음 단계면 standards(제품품질관리규격화)로 이동
      if (currentStep && currentStep.id === 'step4') {
        showSection('standards');
        initializeStandards();
        return;
      }
      
      const nextStep = currentStep.nextElementSibling;
      if (nextStep) {
        // 현재 단계 숨기기
        currentStep.classList.remove('active');
        currentStep.classList.add('hidden');
        
        // 다음 단계 표시
        nextStep.classList.remove('hidden');
        nextStep.classList.add('active');
        
        // 단계 표시 업데이트
        const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
        document.querySelector(`.step[data-step="${currentStepNumber}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStepNumber + 1}"]`).classList.add('active');
        
        // 성분 입력 화면으로 이동 시 테이블 초기화
        if (nextStep.id === 'step2') {
          initializeIngredientTable();
        }
      }
    }

    function initializeIngredientTable() {
      // 제품 정보 표시
      const productName = document.getElementById('productName').value;
      const mainIngredients = document.getElementById('mainIngredients').value;
      
      document.getElementById('productNameDisplay').textContent = productName;
      document.getElementById('mainIngredientsDisplay').textContent = mainIngredients;
      
      // 성분 입력 테이블 초기화
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td><input type="text" placeholder="재료명" class="text-center"></td>
            <td><input type="number" placeholder="중량" class="text-center weight-input"></td>
            <td><input type="number" placeholder="배합비" class="text-center ratio-input" readonly></td>
          </tr>
          <tr class="total-row">
            <td>합계</td>
            <td><input type="number" value="0" class="text-center" readonly></td>
            <td><input type="number" value="0" class="text-center" readonly></td>
          </tr>
        `;
        
        // 중량 입력과 재료명 입력에 이벤트 리스너 추가
        const weightInput = tableBody.querySelector('.weight-input');
        const nameInput = tableBody.querySelector('td:first-child input');
        
        weightInput.addEventListener('input', calculateRatios);
        nameInput.addEventListener('input', updateMainIngredients);
      }
    }

    function updateMainIngredients() {
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      const mainIngredientsDisplay = document.getElementById('mainIngredientsDisplay');
      
      // 모든 재료명과 배합비를 수집
      const ingredients = [];
      rows.forEach(row => {
        const nameInput = row.querySelector('td:first-child input');
        const ratioInput = row.querySelector('.ratio-input');
        if (nameInput.value) {
          const ratio = ratioInput.value ? `(${ratioInput.value}%)` : '';
          ingredients.push(`${nameInput.value}${ratio}`);
        }
      });
      
      // 주요 성분 표시 업데이트
      mainIngredientsDisplay.textContent = ingredients.length > 0 ? ingredients.join(', ') : '-';
    }

    function calculateRatios() {
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      const totalRow = tableBody.querySelector('.total-row');
      
      let totalWeight = 0;
      
      // 총 중량 계산
      rows.forEach(row => {
        const weightInput = row.querySelector('.weight-input');
        if (weightInput && weightInput.value) {
          totalWeight += parseFloat(weightInput.value) || 0;
        }
      });
      
      // 배합비 계산 및 표시
      rows.forEach(row => {
        const weightInput = row.querySelector('.weight-input');
        const ratioInput = row.querySelector('.ratio-input');
        if (weightInput && ratioInput) {
          const weight = parseFloat(weightInput.value) || 0;
          const ratio = totalWeight > 0 ? (weight / totalWeight * 100).toFixed(1) : 0;
          ratioInput.value = ratio;
        }
      });
      
      // 합계 행 업데이트
      const totalWeightInput = totalRow.querySelector('td:nth-child(2) input');
      const totalRatioInput = totalRow.querySelector('td:nth-child(3) input');
      
      if (totalWeightInput) totalWeightInput.value = totalWeight.toFixed(1);
      if (totalRatioInput) totalRatioInput.value = '100.0';
      
      // 총 중량 표시 업데이트
      document.getElementById('totalWeightDisplay').textContent = `${totalWeight.toFixed(1)}g`;
      
      // 주요 성분 업데이트 (배합비가 변경되었으므로)
      updateMainIngredients();
    }

    function addRow() {
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const totalRow = tableBody.querySelector('.total-row');
      
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" placeholder="재료명" class="text-center"></td>
        <td><input type="number" placeholder="중량" class="text-center weight-input"></td>
        <td><input type="number" placeholder="배합비" class="text-center ratio-input" readonly></td>
      `;
      
      tableBody.insertBefore(newRow, totalRow);
      
      // 새 행의 입력 필드에 이벤트 리스너 추가
      const weightInput = newRow.querySelector('.weight-input');
      const nameInput = newRow.querySelector('td:first-child input');
      
      weightInput.addEventListener('input', calculateRatios);
      nameInput.addEventListener('input', updateMainIngredients);
    }

    function deleteRow() {
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      
      if (rows.length > 1) {
        const lastRow = rows[rows.length - 1];
        tableBody.removeChild(lastRow);
        calculateRatios();
      }
    }

    // AI 제품 유형 분석 함수
    function analyzeProductType() {
      const productName = document.getElementById('productName').value;
      const mainIngredients = document.getElementById('mainIngredients').value;
      
      // AI 분석 결과 표시
      const aiResult = document.getElementById('aiAnalysisResult');
      aiResult.classList.remove('hidden');
      
      // 여기에 실제 AI 분석 로직 구현
      console.log('제품명:', productName);
      console.log('주요 성분:', mainIngredients);
    }

    // ... existing code ...
  


    // ... existing code ...

    // 제품품질관리규격화 관련 함수들
    function initializeStandards() {
      // 제품 정보 표시
      const productName = document.getElementById('productName').value;
      const productType = document.getElementById('productTypeDisplay').textContent;
      const totalWeight = document.getElementById('totalWeightDisplay').textContent;
      const mainIngredients = document.getElementById('mainIngredientsDisplay').textContent;
      
      document.getElementById('productNameDisplayStandards').textContent = productName;
      document.getElementById('productTypeDisplayStandards').textContent = productType;
      document.getElementById('totalWeightDisplayStandards').textContent = totalWeight;
      document.getElementById('mainIngredientsDisplayStandards').textContent = mainIngredients;
      
      // 배합비 테이블 초기화
      initializeBlendingTable();
      
      // 제품규격 테이블 초기화
      initializeProductTable();
      
      // 원료규격 테이블 초기화
      initializeRawTable();
    }

    function initializeBlendingTable() {
      const tableBody = document.getElementById('blendingTableBody');
      const ingredientRows = document.querySelectorAll('#step2 .spreadsheet-table tbody tr:not(.total-row)');
      
      tableBody.innerHTML = '';
      ingredientRows.forEach(row => {
        const name = row.querySelector('td:nth-child(1) input')?.value || '';
        const weight = row.querySelector('td:nth-child(2) input')?.value || '';
        const ratio = row.querySelector('td:nth-child(3) input')?.value || '';
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td><input type="text" value="${name}" class="text-center"></td>
          <td><input type="text" value="${ratio}" class="text-center"></td>
          <td><input type="text" value="${weight}" class="text-center"></td>
        `;
        tableBody.appendChild(newRow);
      });
      
      // 합계 행 추가
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      totalRow.innerHTML = `
        <td>합계</td>
        <td><input type="text" value="100.0" class="text-center" readonly></td>
        <td><input type="text" value="${document.querySelector('#step2 .spreadsheet-table .total-row td:nth-child(2) input')?.value || '0'}" class="text-center" readonly></td>
      `;
      tableBody.appendChild(totalRow);
    }

    function initializeProductTable() {
      const tableBody = document.getElementById('productTableBody');
      tableBody.innerHTML = `
        <tr>
          <td><input type="text" value="미생물" class="text-center"></td>
          <td><input type="text" value="대장균군" class="text-center"></td>
          <td><input type="text" value="음성" class="text-center"></td>
          <td><input type="text" value="음성" class="text-center"></td>
        </tr>
        <tr>
          <td><input type="text" value="미생물" class="text-center"></td>
          <td><input type="text" value="세균수" class="text-center"></td>
          <td><input type="text" value="10,000 이하" class="text-center"></td>
          <td><input type="text" value="5,000 이하" class="text-center"></td>
        </tr>
      `;
    }

    function initializeRawTable() {
      const tableBody = document.getElementById('rawTableBody');
      tableBody.innerHTML = `
        <tr>
          <td><input type="text" value="미생물" class="text-center"></td>
          <td><input type="text" value="대장균군" class="text-center"></td>
          <td><input type="text" value="음성" class="text-center"></td>
          <td><input type="text" value="음성" class="text-center"></td>
        </tr>
        <tr>
          <td><input type="text" value="미생물" class="text-center"></td>
          <td><input type="text" value="세균수" class="text-center"></td>
          <td><input type="text" value="10,000 이하" class="text-center"></td>
          <td><input type="text" value="5,000 이하" class="text-center"></td>
        </tr>
      `;
    }

    function addStandardsRow(type) {
      const tableBody = document.getElementById(`${type}TableBody`);
      const newRow = document.createElement('tr');
      
      if (type === 'blending') {
        newRow.innerHTML = `
          <td><input type="text" class="text-center"></td>
          <td><input type="text" class="text-center"></td>
          <td><input type="text" class="text-center"></td>
        `;
      } else {
        newRow.innerHTML = `
          <td><input type="text" class="text-center"></td>
          <td><input type="text" class="text-center"></td>
          <td><input type="text" class="text-center"></td>
          <td><input type="text" class="text-center"></td>
        `;
      }
      
      tableBody.insertBefore(newRow, tableBody.lastElementChild);
    }

    function deleteStandardsRow(type) {
      const tableBody = document.getElementById(`${type}TableBody`);
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      
      if (rows.length > 1) {
        tableBody.removeChild(rows[rows.length - 1]);
      }
    }

    function analyzeStandardsAI(type) {
      // AI 분석 모달 표시
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      let analysisContent = '';
      if (type === 'blending') {
        analysisContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">배합비 분석</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>콩국 비율이 적절합니다 (74.1%)</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>소면 비율이 적절합니다 (21.2%)</span>
                </div>
              </div>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">개선 제안</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  <span>땅콩분태 비율을 1%로 높이면 맛이 개선될 수 있습니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'product') {
        analysisContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">제품규격 분석</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>미생물 기준이 적절합니다</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>관리규격이 기준보다 엄격합니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'raw') {
        analysisContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">원료규격 분석</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>원료별 미생물 기준이 적절합니다</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>관리규격이 기준보다 엄격합니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">AI 분석 결과</h3>
          <div class="mb-4">${analysisContent}</div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              닫기
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    }

    function analyzeStandardsLaw(type) {
      // 법령 분석 모달 표시
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      let lawContent = '';
      if (type === 'blending') {
        lawContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">배합비 관련 법령</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-book text-blue-500 mr-2"></i>
                  <span>식품공전 제2장 두류가공품 기준</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>주원료(콩국) 비율이 50% 이상으로 적절합니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'product') {
        lawContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">제품규격 관련 법령</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-book text-blue-500 mr-2"></i>
                  <span>식품위생법 시행규칙 제XX조</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>미생물 기준이 법령 기준을 충족합니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'raw') {
        lawContent = `
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-blue-600 mb-2">원료규격 관련 법령</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <i class="fas fa-book text-blue-500 mr-2"></i>
                  <span>식품위생법 시행규칙 제XX조</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  <span>원료별 미생물 기준이 법령 기준을 충족합니다</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">법령 분석 결과</h3>
          <div class="mb-4">${lawContent}</div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              닫기
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    }

    // ... existing code ...
  


    function showSection(sectionId) {
      // 모든 섹션 숨기기
      document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
      });
      
      // 선택한 섹션 표시
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log(`Switched to section: ${sectionId}`);
      }
    }

    function showLawDetails(productType) {
      // 법령 상세 페이지로 전환
      showSection('lawDetails');
      
      // 선택된 제품 유형에 따른 법령 내용 표시
      const contentArea = document.querySelector('.w-3/4');
      if (contentArea) {
        let lawContent = '';
        if (productType === '두류가공품') {
          lawContent = `
            <h3 class="text-lg font-semibold mb-4">두류가공품 기준 및 규격</h3>
            <div class="text-gray-700">
              <p>1. 정의: 두류를 주원료로 하여 가공한 제품</p>
              <p>2. 원료: 콩, 팥, 녹두 등 두류</p>
              <p>3. 기준: 대장균군 음성, 나트륨 500mg 이하</p>
            </div>
          `;
        } else if (productType === '밀키트') {
          lawContent = `
            <h3 class="text-lg font-semibold mb-4">밀키트 기준 및 규격</h3>
            <div class="text-gray-700">
              <p>1. 정의: 조리된 식품을 키트 형태로 제공하는 제품</p>
              <p>2. 기준: 냉장보관(0~10℃), 유통기한 7일 이내</p>
              <p>3. 표시사항: 보관방법, 조리방법 필수 표시</p>
            </div>
          `;
        }
        contentArea.innerHTML = lawContent;
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      // 초기 페이지 설정
      showSection('dashboard');

      // 목차 토글 기능
      const menuTitles = document.querySelectorAll('.menu-title');
      menuTitles.forEach(title => {
        title.addEventListener('click', function(e) {
          e.preventDefault();
          const subMenu = this.nextElementSibling;
          const isOpen = subMenu.style.display === 'block';
          
          // 다른 모든 서브메뉴 닫기
          document.querySelectorAll('.sub-menu').forEach(menu => {
            menu.style.display = 'none';
          });
          document.querySelectorAll('.menu-title').forEach(t => {
            t.classList.remove('active');
          });
          
          // 클릭된 메뉴 토글
          if (!isOpen) {
            subMenu.style.display = 'block';
            this.classList.add('active');
          }
        });
      });

      // 서브메뉴 링크 클릭 시 컨텐츠 업데이트
      const subMenuLinks = document.querySelectorAll('.sub-menu a');
      subMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 컨텐츠 영역 업데이트
          const contentArea = document.querySelector('.w-3/4');
          if (contentArea) {
            contentArea.innerHTML = `
              <h3 class="text-lg font-semibold mb-4">${this.textContent}</h3>
              <div class="text-gray-700">
                <p>해당 법령 내용이 여기에 표시됩니다...</p>
              </div>
            `;
          }
        });
      });

      // 검색 기능 추가
      const searchInput = document.getElementById('lawSearch');
      const contentSections = document.querySelectorAll('.content-section');
      
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
          // 검색어가 없을 때는 모든 섹션 표시
          contentSections.forEach(section => {
            section.style.display = 'block';
            section.style.backgroundColor = '';
            const text = section.innerHTML;
            section.innerHTML = text.replace(/<mark class="bg-yellow-200">/g, '').replace(/<\/mark>/g, '');
          });
          return;
        }

        contentSections.forEach(section => {
          const text = section.textContent.toLowerCase();
          const html = section.innerHTML;
          
          if (text.includes(searchTerm)) {
            section.style.display = 'block';
            // 검색어 하이라이트 처리
            const regex = new RegExp(searchTerm, 'gi');
            const highlightedHtml = html.replace(regex, match => `<mark class="bg-yellow-200">${match}</mark>`);
            section.innerHTML = highlightedHtml;
            
            // 첫 번째 검색 결과로 스크롤
            if (text.indexOf(searchTerm) === 0) {
              section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            section.style.display = 'none';
          }
        });
      });

      // Enter 키 입력 시 첫 번째 검색 결과로 이동
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const firstVisible = document.querySelector('.content-section[style="display: block;"]');
          if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });

      // 전역 검색 기능 추가
      const globalSearch = document.getElementById('globalSearch');
      globalSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          // 여기에 전역 검색 로직 구현
          console.log('전역 검색:', this.value);
        }
      });

      // 식품 법령 검색창 엔터키 이벤트 추가
      const lawSearchInput = document.getElementById('lawSearchInput');
      lawSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          showLawDetails();
        }
      });
    });

    // 로그인 상태 변수
    let isLoggedIn = true;

    // 로그아웃 시 동작
    function logout() {
      isLoggedIn = false;
      const authBtn = document.getElementById('authButton');
      authBtn.innerText = '로그인';
      authBtn.setAttribute('onclick', "showSection('loginPage')");
      console.log("로그아웃됨");
    }

    // 로그인 시 동작
    function login() {
      isLoggedIn = true;
      const authBtn = document.getElementById('authButton');
      authBtn.innerText = '로그아웃';
      authBtn.setAttribute('onclick', "logout()");
      showSection('dashboard');
      console.log("로그인됨");
    }
  


    function openPopup() {
      const popupContent = document.querySelector('.w-3/4').innerHTML;
      const popupWindow = window.open('', 'LawDetailsPopup', 'width=800,height=600');
      const popupHTML = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>법령 상세 팝업</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="bg-white rounded-lg shadow p-6">
            ${popupContent}
          </div>
        </body>
        </html>
      `;
      popupWindow.document.write(popupHTML);
      popupWindow.document.close();
    }
  


    function aiAutoFill() {
      // 현재 입력된 재료 정보 수집
      const ingredients = [];
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      
      rows.forEach(row => {
        const nameInput = row.querySelector('td:first-child input');
        const weightInput = row.querySelector('.weight-input');
        if (nameInput.value || weightInput.value) {
          ingredients.push({
            name: nameInput.value,
            weight: weightInput.value
          });
        }
      });

      // AI 자동채우기 모달 표시
      const modal = document.getElementById('aiAutoFillModal');
      const resultDiv = document.getElementById('aiAutoFillResult');
      
      // AI 추천 결과 생성 (실제로는 API 호출 필요)
      const recommendation = {
        ingredients: [
          { name: '콩국', weight: '700', ratio: '74.1' },
          { name: '소면', weight: '200', ratio: '21.2' },
          { name: '오이', weight: '40', ratio: '4.2' },
          { name: '땅콩분태', weight: '5', ratio: '0.5' }
        ],
        explanation: '입력된 재료를 바탕으로 AI가 제품 유형에 맞는 최적의 배합을 추천합니다.'
      };

      // 추천 결과 표시
      resultDiv.innerHTML = `
        <div class="mb-4">
          <p class="text-gray-700 mb-2">${recommendation.explanation}</p>
          <div class="border border-gray-200 rounded-lg p-4">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="p-2 text-left">재료명</th>
                  <th class="p-2 text-right">중량 (g)</th>
                  <th class="p-2 text-right">배합비 (%)</th>
                </tr>
              </thead>
              <tbody>
                ${recommendation.ingredients.map(ing => `
                  <tr>
                    <td class="p-2">${ing.name}</td>
                    <td class="p-2 text-right">${ing.weight}</td>
                    <td class="p-2 text-right">${ing.ratio}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function analyzeLaw() {
      // 현재 입력된 재료 정보 수집
      const ingredients = [];
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      
      rows.forEach(row => {
        const nameInput = row.querySelector('td:first-child input');
        const weightInput = row.querySelector('.weight-input');
        if (nameInput.value || weightInput.value) {
          ingredients.push({
            name: nameInput.value,
            weight: weightInput.value
          });
        }
      });

      // 법령 분석 모달 표시
      const modal = document.getElementById('lawAnalysisModal');
      const resultDiv = document.getElementById('lawAnalysisResult');
      
      // 법령 분석 결과 생성 (실제로는 API 호출 필요)
      const analysis = {
        compliance: true,
        issues: [],
        references: [
          {
            title: '식품공전 제2. 식품일반에 대한 공통기준 및 규격',
            content: '두류가공품의 기준 및 규격에 따라 원료와 배합비가 적절합니다.'
          },
          {
            title: '식품위생법 시행규칙',
            content: '나트륨 기준 500mg 이하를 준수하고 있습니다.'
          }
        ]
      };

      // 분석 결과 표시
      resultDiv.innerHTML = `
        <div class="mb-4">
          <div class="flex items-center mb-4">
            <i class="fas fa-${analysis.compliance ? 'check-circle text-green-500' : 'exclamation-circle text-red-500'} text-2xl mr-2"></i>
            <span class="font-medium">${analysis.compliance ? '법령 준수' : '법령 미준수'}</span>
          </div>
          
          ${analysis.issues.length > 0 ? `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 class="font-medium text-red-700 mb-2">주의사항</h4>
              <ul class="list-disc pl-5 text-red-600">
                ${analysis.issues.map(issue => `<li>${issue}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="space-y-4">
            <h4 class="font-medium text-gray-700">참고 법령</h4>
            ${analysis.references.map(ref => `
              <div class="border border-gray-200 rounded-lg p-4">
                <h5 class="font-medium text-blue-600 mb-2">${ref.title}</h5>
                <p class="text-gray-700">${ref.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function applyAiRecommendation() {
      const tableBody = document.querySelector('#step2 .spreadsheet-table tbody');
      const totalRow = tableBody.querySelector('.total-row');
      
      // 기존 행 제거 (합계 행 제외)
      const rows = tableBody.querySelectorAll('tr:not(.total-row)');
      rows.forEach(row => tableBody.removeChild(row));
      
      // AI 추천 결과 적용
      const recommendation = {
        ingredients: [
          { name: '콩국', weight: '700', ratio: '74.1' },
          { name: '소면', weight: '200', ratio: '21.2' },
          { name: '오이', weight: '40', ratio: '4.2' },
          { name: '땅콩분태', weight: '5', ratio: '0.5' }
        ]
      };
      
      recommendation.ingredients.forEach(ing => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td><input type="text" value="${ing.name}" class="text-center"></td>
          <td><input type="number" value="${ing.weight}" class="text-center weight-input"></td>
          <td><input type="number" value="${ing.ratio}" class="text-center ratio-input" readonly></td>
        `;
        tableBody.insertBefore(newRow, totalRow);
        
        // 중량 입력과 재료명 입력에 이벤트 리스너 추가
        const weightInput = newRow.querySelector('.weight-input');
        const nameInput = newRow.querySelector('td:first-child input');
        
        weightInput.addEventListener('input', calculateRatios);
        nameInput.addEventListener('input', updateMainIngredients);
      });
      
      // 합계 업데이트
      calculateRatios();
      // 주요 성분 업데이트
      updateMainIngredients();
      
      // 모달 닫기
      closeModal('aiAutoFillModal');
    }
  


    // ... existing code ...

    // 영양성분 관련 함수들
    function connectFoodDB() {
      // 식약처 DB 연결 모달 표시
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">식약처 식품DB 연결</h3>
          <div class="mb-4">
            <input type="text" 
                   placeholder="식품명 검색..." 
                   class="w-full p-2 border border-gray-300 rounded-lg mb-4">
            <div class="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer">
                  <span>콩국수 (식약처 DB)</span>
                  <button class="text-blue-600 hover:underline">선택</button>
                </div>
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer">
                  <span>콩국 (식약처 DB)</span>
                  <button class="text-blue-600 hover:underline">선택</button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-2">
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              취소
            </button>
            <button onclick="applyFoodDBData()" 
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
              적용하기
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    function applyFoodDBData() {
      // 식약처 DB 데이터 적용
      const nutritionData = {
        energy: 200,
        carbohydrate: 35,
        protein: 8,
        fat: 3,
        sugar: 2,
        sodium: 500,
        saturatedFat: 1,
        transFat: 0
      };
      
      // 테이블 데이터 업데이트
      const table = document.querySelector('#step3 .spreadsheet-table tbody');
      const rows = table.querySelectorAll('tr');
      
      rows.forEach((row, index) => {
        const input = row.querySelector('td:nth-child(3) input');
        if (input) {
          const value = Object.values(nutritionData)[index];
          input.value = value;
        }
      });
      
      // 모달 닫기
      document.querySelector('.fixed').remove();
      
      // 영양소 기준치 대비 계산
      calculateNutritionRatios();
    }

    function calculateNutritionRatios() {
      const table = document.querySelector('#step3 .spreadsheet-table tbody');
      const rows = table.querySelectorAll('tr');
      
      rows.forEach(row => {
        const value = parseFloat(row.querySelector('td:nth-child(3) input').value);
        const dailyValue = parseFloat(row.querySelector('td:nth-child(5) input').value);
        
        if (!isNaN(value) && !isNaN(dailyValue)) {
          const ratio = (value / dailyValue * 100).toFixed(1);
          row.querySelector('td:nth-child(4) input').value = ratio;
        }
      });
    }

    function aiAnalyzeNutrition() {
      // AI 영양성분 분석 모달 표시
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">AI 영양성분 분석</h3>
          <div class="mb-4">
            <div class="space-y-4">
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">영양성분 분석 결과</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>나트륨 함량이 기준치(500mg)를 충족합니다.</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>당류 함량이 저당 기준(5g)을 충족합니다.</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>단백질 함량이 권장량(8g)을 충족합니다.</span>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">개선 제안</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    <span>포화지방 함량을 0.5g 이하로 낮추면 더 건강한 제품이 될 수 있습니다.</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    <span>식이섬유 함량을 3g 이상으로 높이면 좋습니다.</span>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">시장 경쟁력 분석</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-chart-line text-blue-500 mr-2"></i>
                    <span>유사 제품 대비 나트륨 함량이 20% 낮습니다.</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-chart-line text-blue-500 mr-2"></i>
                    <span>단백질 함량이 시장 평균보다 15% 높습니다.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              닫기
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    function analyzeNutritionLaw() {
      // 영양성분 법령 분석 모달 표시
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">영양성분 법령 분석</h3>
          <div class="mb-4">
            <div class="space-y-4">
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">법령 준수 상태</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>식품위생법 시행규칙 제XX조: 영양성분 기준 충족</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>식품 등의 표시기준: 영양성분 표시 방법 준수</span>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">주의사항</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    <span>나트륨 함량이 500mg 이하로 유지되어야 합니다.</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    <span>당류 함량이 5g 이하로 유지되어야 합니다.</span>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-blue-600 mb-2">최근 법령 변경사항</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                    <span>2025년 4월 10일: 나트륨 기준 600mg → 500mg으로 강화</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                    <span>2025년 4월 1일: 당류 표시 기준 신설</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              닫기
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // ... existing code ...
  


    function updateStepIndicator(stepNum) {
      document.querySelectorAll('.step').forEach(step => {
        const circle = step.querySelector('.step-circle');
        if (parseInt(step.getAttribute('data-step')) === stepNum) {
          circle.classList.remove('bg-gray-300');
          circle.classList.add('bg-blue-500');
        } else {
          circle.classList.remove('bg-blue-500');
          circle.classList.add('bg-gray-300');
        }
      });
    }

    function nextStep() {
      const currentStep = document.querySelector('.step-content.active');
      const nextStep = currentStep.nextElementSibling;
      if (nextStep) {
        currentStep.classList.remove('active');
        currentStep.classList.add('hidden');
        nextStep.classList.remove('hidden');
        nextStep.classList.add('active');
        const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
        updateStepIndicator(currentStepNumber + 1);
        if (nextStep.id === 'step2') {
          initializeIngredientTable();
        }
      } else {
        // step4(표시사항)에서 다음 단계면 standards(제품품질관리규격화)로 이동
        if (currentStep && currentStep.id === 'step4') {
          currentStep.classList.remove('active');
          currentStep.classList.add('hidden');
          document.getElementById('standards').classList.remove('hidden');
          document.getElementById('standards').classList.add('active');
        }
      }
    }

    function prevStep() {
      const currentStep = document.querySelector('.step-content.active');
      const prevStep = currentStep.previousElementSibling;
      if (prevStep) {
        currentStep.classList.remove('active');
        currentStep.classList.add('hidden');
        prevStep.classList.remove('hidden');
        prevStep.classList.add('active');
        const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
        updateStepIndicator(currentStepNumber - 1);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateStepIndicator(1);
    });
  


    // ... existing code ...
    // 표시사항 표 자동 연동
    function updateLabelTable() {
      // 재료 입력 테이블에서 값 추출
      const ingredientRows = document.querySelectorAll('#step2 .spreadsheet-table tbody tr:not(.total-row)');
      const labelTableBody = document.getElementById('labelTableBody');
      labelTableBody.innerHTML = '';
      ingredientRows.forEach((row, idx) => {
        const name = row.querySelector('td:nth-child(1) input')?.value || '';
        const weight = row.querySelector('td:nth-child(2) input')?.value || '';
        const ratio = row.querySelector('td:nth-child(3) input')?.value || '';
        labelTableBody.innerHTML += `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td><input type="text" value="${name}" class="text-center"></td>
            <td><input type="text" value="${ratio}" class="text-center"></td>
            <td><input type="text" value="${weight}" class="text-center"></td>
            <td><input type="text" value="" class="text-center"></td>
            <td><input type="text" value="" class="text-center"></td>
            <td><input type="text" value="" class="text-center"></td>
          </tr>
        `;
      });
    }
    // step4 진입 시 자동 연동
    function showStep4() {
      updateLabelTable();
    }
    // nextStep, prevStep에서 step4 진입 시 호출
    const oldNextStep = nextStep;
    nextStep = function() {
      const currentStep = document.querySelector('.step-content.active');
      const nextStepDiv = currentStep.nextElementSibling;
      if (nextStepDiv && nextStepDiv.id === 'step4') {
        showStep4();
      }
      oldNextStep();
    }
    const oldPrevStep = prevStep;
    prevStep = function() {
      const currentStep = document.querySelector('.step-content.active');
      const prevStepDiv = currentStep.previousElementSibling;
      if (prevStepDiv && prevStepDiv.id === 'step4') {
        showStep4();
      }
      oldPrevStep();
    }
    // ... existing code ...
  


    // ... existing code ...
    // 표시사항 표 행 추가/삭제 함수
    function addLabelRow() {
      const labelTableBody = document.getElementById('labelTableBody');
      const rowCount = labelTableBody.querySelectorAll('tr').length;
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td class="text-center">${rowCount + 1}</td>
        <td><input type="text" value="" class="text-center"></td>
        <td><input type="text" value="" class="text-center"></td>
        <td><input type="text" value="" class="text-center"></td>
        <td><input type="text" value="" class="text-center"></td>
        <td><input type="text" value="" class="text-center"></td>
        <td><input type="text" value="" class="text-center"></td>
      `;
      labelTableBody.appendChild(newRow);
    }
    function deleteLabelRow() {
      const labelTableBody = document.getElementById('labelTableBody');
      const rows = labelTableBody.querySelectorAll('tr');
      if (rows.length > 0) {
        labelTableBody.removeChild(rows[rows.length - 1]);
      }
    }
    // ... existing code ...
  


    // ... existing code ...
    // 표시사항 AI 식품유형 분석 기능
    function analyzeLabelAI() {
      const labelTableBody = document.getElementById('labelTableBody');
      const rows = labelTableBody.querySelectorAll('tr');
      rows.forEach(row => {
        const name = row.querySelector('td:nth-child(2) input')?.value || '';
        // 예시: 콩, 두부, 두류가 들어가면 두류가공품, 면/소면이면 건면, 오이/채소류면 농산물, 땅콩/견과류면 견과류가공품
        let type = '';
        if (/콩|두부|두류/.test(name)) type = '두류가공품';
        else if (/면|소면/.test(name)) type = '건면';
        else if (/오이|채소|야채|상추|배추|무/.test(name)) type = '농산물';
        else if (/땅콩|호두|아몬드|견과/.test(name)) type = '견과류가공품';
        else if (name) type = '기타';
        row.querySelector('td:nth-child(5) input').value = type;
      });
    }
    // 표시사항 법령 분석 기능
    function analyzeLabelLaw() {
      const labelTableBody = document.getElementById('labelTableBody');
      const rows = labelTableBody.querySelectorAll('tr');
      let issues = [];
      rows.forEach((row, idx) => {
        const name = row.querySelector('td:nth-child(2) input')?.value || '';
        const type = row.querySelector('td:nth-child(5) input')?.value || '';
        // 예시: 두류가공품은 알레르기(대두) 표시 필요, 견과류가공품은 땅콩/견과 표시 필요
        if (type === '두류가공품' && !/대두/.test(row.querySelector('td:nth-child(7) input')?.value || '')) {
          issues.push(`${idx+1}번 재료(두류가공품)는 알레르기(대두) 표시 필요`);
        }
        if (type === '견과류가공품' && !/(땅콩|호두|아몬드|견과)/.test(row.querySelector('td:nth-child(7) input')?.value || '')) {
          issues.push(`${idx+1}번 재료(견과류가공품)는 알레르기(땅콩/견과) 표시 필요`);
        }
        // 기타 예시: 식품유형 미입력 경고
        if (!type) {
          issues.push(`${idx+1}번 재료의 식품유형을 입력하세요.`);
        }
      });
      let html = '';
      if (issues.length === 0) {
        html = `<div class='flex items-center text-green-600'><i class='fas fa-check-circle mr-2'></i>모든 표시사항이 법령에 적합합니다.</div>`;
      } else {
        html = `<div class='mb-2 text-red-600 font-semibold'>법령상 주의사항</div><ul class='list-disc pl-5 text-red-600'>` + issues.map(i=>`<li>${i}</li>`).join('') + '</ul>';
      }
      showLabelLawModal(html);
    }
    function showLabelLawModal(html) {
      let modal = document.getElementById('labelLawModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'labelLawModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class='bg-white rounded-lg p-6 max-w-xl w-full mx-4'>
            <h3 class='text-lg font-semibold mb-4'>표시사항 법령 분석 결과</h3>
            <div id='labelLawModalContent' class='mb-4'>${html}</div>
            <div class='flex justify-end'>
              <button onclick="document.getElementById('labelLawModal').remove()" class='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all'>닫기</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        document.getElementById('labelLawModalContent').innerHTML = html;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }
    // ... existing code ...
  


    // ... existing code ...
    // AI 식품유형 분석 팝업 후보군 기능 (UI 개선)
    function analyzeLabelAIWithPopup() {
      const labelTableBody = document.getElementById('labelTableBody');
      const rows = labelTableBody.querySelectorAll('tr');
      let modalHtml = '';
      let aiCandidates = [];
      rows.forEach((row, idx) => {
        const name = row.querySelector('td:nth-child(2) input')?.value || '';
        let candidates = [];
        let reasons = [];
        if (/콩|두부|두류/.test(name)) {
          candidates = ['두류가공품', '기타'];
          reasons = [
            '식품→식품원료→자사투입→두류',
            '식품공전 제2장 두류가공품 기준에 의거함',
            '주원료가 콩/두부이므로 두류가공품으로 분류'
          ];
        } else if (/면|소면/.test(name)) {
          candidates = ['건면', '기타'];
          reasons = [
            '식품→식품원료→자사투입→면류',
            '식품공전 제3장 건면류 기준에 의거함',
            '주원료가 소면이므로 건면으로 분류'
          ];
        } else if (/오이|채소|야채|상추|배추|무/.test(name)) {
          candidates = ['농산물', '기타'];
          reasons = [
            '식품→식품원료→자사투입→과채류',
            '식품공전 제4장 농산물 기준에 의거함',
            '주원료가 오이/채소이므로 농산물로 분류'
          ];
        } else if (/땅콩|호두|아몬드|견과/.test(name)) {
          candidates = ['견과류가공품', '기타'];
          reasons = [
            '식품→식품원료→자사투입→견과류',
            '식품공전 제2장 견과류가공품 기준에 의거함',
            '주원료가 땅콩/견과이므로 견과류가공품으로 분류'
          ];
        } else if (name) {
          candidates = ['기타'];
          reasons = [
            '식품공전 및 식품위생법 기준에 따라 기타로 분류'
          ];
        }
        aiCandidates.push(candidates);
        modalHtml += `
          <div class='mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
            <div class='font-semibold mb-2 text-blue-700 text-lg flex items-center'><i class="fas fa-utensils mr-2"></i>${idx+1}번 재료: <span class='ml-2'>${name || '(미입력)'}</span></div>
            <div class='flex gap-4 flex-wrap'>
              ${candidates.map((c, i)=>`
                <div class='flex flex-col items-center bg-white border border-blue-200 rounded-lg px-4 py-3 shadow hover:shadow-lg transition-all w-48'>
                  <button type='button' class='ai-type-btn bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded px-3 py-1 font-semibold mb-2' data-row='${idx}' data-type='${c}'>${c}</button>
                  <div class='text-xs text-gray-600 text-center mt-1'>
                    <div class='mb-1'><i class="fas fa-lightbulb text-yellow-400 mr-1"></i><span class='font-semibold'>추천 근거</span></div>
                    <div>${reasons[i] || '식품공전 및 식품위생법 기준 참고'}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });
      if (!rows.length) {
        modalHtml = `<div class='text-gray-500'>재료를 먼저 입력해 주세요.</div>`;
      }
      showAITypeModal(modalHtml, aiCandidates);
    }
    function showAITypeModal(html, aiCandidates) {
      let modal = document.getElementById('aiTypeModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'aiTypeModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class='bg-white rounded-lg p-6 max-w-xl w-full mx-4'>
            <h3 class='text-lg font-semibold mb-4'>AI 식품유형 후보 선택</h3>
            <div id='aiTypeModalContent' class='mb-4'>${html}</div>
            <div class='flex justify-end'>
              <button onclick="document.getElementById('aiTypeModal').remove()" class='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all'>닫기</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        document.getElementById('aiTypeModalContent').innerHTML = html;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
      // 버튼 클릭 이벤트
      setTimeout(()=>{
        document.querySelectorAll('.ai-type-btn').forEach(btn => {
          btn.onclick = function() {
            const rowIdx = parseInt(this.getAttribute('data-row'));
            const type = this.getAttribute('data-type');
            const labelTableBody = document.getElementById('labelTableBody');
            const rows = labelTableBody.querySelectorAll('tr');
            if (rows[rowIdx]) {
              rows[rowIdx].querySelector('td:nth-child(5) input').value = type;
            }
            this.classList.add('bg-blue-500','text-white');
            this.classList.remove('bg-gray-100','hover:bg-blue-100');
          };
        });
      }, 100);
    }
    // ... 기존 analyzeLabelAI, analyzeLabelLaw 등은 그대로 유지 ...
    // ... existing code ...
  