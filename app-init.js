// This is app-init.js (BETA 3.1 - Bug Fix v5 - COMPLETE FILE)
// It contains all the logic formerly inside app.js's DOMContentLoaded listener

function initializeApp() {
    
    // +++ START: EMR Tab Loading Logic (NEW) +++
    initializeTabSwitching();
    initializeVitalSignsSaveLogic(); // (เรียกฟังก์ชัน Save ใหม่)
    
    // Load the initial content (Assessment)
    const activeTab = document.querySelector('.emr-tab.tab-active');
    const initialContent = activeTab ? activeTab.dataset.target : 'assessment_content.html';
    loadModuleContent(initialContent || 'assessment_content.html');
    // +++ END: EMR Tab Loading Logic (NEW) +++
    
    // --- (ใหม่) BETA 3.1 Logic สำหรับปุ่มลอยด้านขวา ---
    const htmlRoot = document.documentElement; 
    const themeBtnLight = document.getElementById('theme-btn-light');
    const themeBtnDark = document.getElementById('theme-btn-dark');
    const goToTopBtn = document.getElementById('go-to-top-btn');

    // 1. ฟังก์ชันสลับธีม (ยังคงใช้ .dark class เหมือนเดิม)
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlRoot.classList.add('dark');
        } else {
            htmlRoot.classList.remove('dark');
        }
        // บันทึกธีมที่เลือกลงใน localStorage
        localStorage.setItem('theme', theme);
    }

    // 2. ผูก Event ให้ปุ่มธีม
    if (themeBtnLight) {
        themeBtnLight.addEventListener('click', () => {
            applyTheme('light');
        });
    }
    if (themeBtnDark) {
        themeBtnDark.addEventListener('click', () => {
            applyTheme('dark'); // (เรายังเรียกธีมสีเบจว่า 'dark' ในระบบ)
        });
    }

    // 3. โหลดธีมตอนเปิดหน้า
    const preference = localStorage.getItem('theme');
    applyTheme(preference || 'light'); // (ถ้าไม่มีค่า ให้ใช้ 'light')

    // 4. ผูก Event ให้ปุ่ม Go to Top
    if (goToTopBtn) {
        goToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // --- (จบ) BETA 3.1 Logic สำหรับปุ่มลอยด้านขวา ---
    

    // --- Modal: DF (*** แก้ไข: คง Logic ปิดไว้ ***) ---
    const modal = document.getElementById('df-popup-modal');
    const closeButtonX = document.getElementById('df-popup-close-x');
    const cancelButton = document.getElementById('df-popup-cancel');
    const showPopup = () => { if (modal) modal.classList.remove('hidden'); };
    const hidePopup = () => { if (modal) modal.classList.add('hidden'); };
    // (ลบ openButton เก่า)
    if (closeButtonX) closeButtonX.addEventListener('click', hidePopup);
    if (cancelButton) cancelButton.addEventListener('click', hidePopup);
    if (modal) { modal.addEventListener('click', (event) => { if (event.target === modal) hidePopup(); }); }

    // --- Modal: TF (*** แก้ไข: คง Logic ปิดไว้ ***) ---
    const modalTF = document.getElementById('tf-popup-modal');
    const closeButtonXTF = document.getElementById('tf-popup-close-x');
    const cancelButtonTF = document.getElementById('tf-popup-cancel');
    const showPopupTF = () => { if (modalTF) modalTF.classList.remove('hidden'); };
    const hidePopupTF = () => { if (modalTF) modalTF.classList.add('hidden'); };
    // (ลบ openButtonTF เก่า)
    if (closeButtonXTF) closeButtonXTF.addEventListener('click', hidePopupTF);
    if (cancelButtonTF) cancelButtonTF.addEventListener('click', hidePopupTF);
    if (modalTF) { modalTF.addEventListener('click', (event) => { if (event.target === modalTF) hidePopupTF(); }); }

    
    // --- (ใหม่) BETA 3.1 Logic สำหรับปุ่มลอยด้านซ้าย (เมนูเลื่อน) ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const actionMenu = document.getElementById('action-menu-container');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (menuToggleBtn && actionMenu && iconOpen && iconClose) {
        menuToggleBtn.addEventListener('click', () => {
            // (*** FIX ***) สลับ class 'active' บน container ของเมนู
            actionMenu.classList.toggle('active');
            
            // (*** FIX ***) สลับไอคอนปุ่ม
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });
    }

    // (*** FIX ***) (ย้าย Event Listener มาผูกกับปุ่ม FAB ใหม่)
    const openButtonDF_fab = document.getElementById('open-df-popup-fab');
    const openButtonTF_fab = document.getElementById('open-tf-popup-fab');
    const openVitalsButton_fab = document.getElementById('open-vitals-popup-fab');
    const openEyeButton_fab = document.getElementById('open-eye-popup-fab');

    // (Logic การเปิด Modal (ที่เราคงไว้ข้างบน) จะถูกเรียกโดยปุ่มใหม่นี้)
    if (openButtonDF_fab) openButtonDF_fab.addEventListener('click', showPopup);
    if (openButtonTF_fab) openButtonTF_fab.addEventListener('click', showPopupTF);
    // (showVitalsPopup และ showEyePopup อยู่ด้านล่าง)
    // --- (จบ) BETA 3.1 Logic สำหรับปุ่มลอยด้านซ้าย ---


    // --- Modal: Vital Signs (อัปเกรด BETA 3.1) ---
    // (*** ลบโค้ดที่ซ้ำซ้อนออกแล้ว ***)
    // (*** (แก้ไข) ลบ openVitalsButton เก่าออก ***)
    const vitalsModal = document.getElementById('vitals-popup-modal');
    const closeVitalsX = document.getElementById('close-vitals-popup-x');
    const closeVitalsCancel = document.getElementById('close-vitals-popup-cancel');
    const vitalsTabLinks = vitalsModal.querySelectorAll('.vitals-tab-link');
    const vitalsTabContents = vitalsModal.querySelectorAll('.vitals-tab-content');

    const showVitalsPopup = () => { 
        if (vitalsModal) vitalsModal.classList.remove('hidden'); 
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); 
        }
        
        // --- (FIX 1/2) แปลงข้อมูล activityLogData ให้ตารางเดิมอ่านได้ ---
        const filteredVitals = activityLogData.filter(entry => 
            entry.activity_type === "Vital Signs" && entry.status === "Done"
        );
        
        const legacyVsHistoryData = filteredVitals.map(entry => {
            return {
                id: entry.entry_id,
                datetimeSort: new Date(entry.effective_time).toISOString(), 
                datetime: entry.effective_time.split(',')[0], 
                bp: entry.parameters.BP,
                pulse: entry.parameters.Pulse,
                hr: entry.parameters.HR,
                rr: entry.parameters.RR,
                temp: entry.parameters.Temp,
                fbs: entry.parameters.FBS,
                crt: entry.parameters.CRT,
                mucous: entry.parameters.MM,
                pulse_quality: entry.parameters.Pulse_Quality,
                lung: entry.parameters.Lung,
                heart: entry.parameters.Heart,
                loc: entry.parameters.LOC,
                pain: entry.parameters.Pain,
                cyanosis: (entry.parameters.Cyanosis === 'Yes'),
                seizure: (entry.parameters.Seizure === 'Yes'),
                arrest: (entry.parameters.Arrest === 'Yes'),
                note: entry.parameters.Note
            };
        });
        
        // (ย้าย Logic การ Sort และ Render มาไว้ "ข้างใน" นี้)
        sortVsData(legacyVsHistoryData, vsCurrentSort.column, vsCurrentSort.direction);
        renderVsHistoryTable(legacyVsHistoryData);
        vsHistoryHeaders.forEach(header => {
            if (header.dataset.sort === vsCurrentSort.column) {
                 updateVsSortUI(header);
            }
        });
    };
    const hideVitalsPopup = () => { if (vitalsModal) vitalsModal.classList.add('hidden'); };

    // (*** (แก้ไข) ผูก Event กับปุ่ม FAB ใหม่ ***)
    if (openVitalsButton_fab) openVitalsButton_fab.addEventListener('click', showVitalsPopup);
    if (closeVitalsX) closeVitalsX.addEventListener('click', hideVitalsPopup);
    if (closeVitalsCancel) closeVitalsCancel.addEventListener('click', hideVitalsPopup);
    if (vitalsModal) { 
        vitalsModal.addEventListener('click', (event) => { 
            if (event.target === vitalsModal) hideVitalsPopup(); 
        }); 
    }
    
    // --- Modal: Eye Exam (อัปเกรด BETA 3.1) ---
    // (*** (แก้ไข) ลบ openEyeButton เก่าออก ***)
    const eyeModal = document.getElementById('eye-exam-modal');
    const closeEyeX = document.getElementById('close-eye-popup-x');
    const closeEyeCancel = document.getElementById('close-eye-popup-cancel');
    const eyeTabLinks = eyeModal.querySelectorAll('.eye-tab-link');
    const eyeTabContents = eyeModal.querySelectorAll('.eye-tab-content');
    const openDrawingBtn = document.getElementById('open-drawing-tool');

    const showEyePopup = () => { 
        if (eyeModal) eyeModal.classList.remove('hidden'); 
        
        // --- (FIX 2/2) แปลงข้อมูล activityLogData ให้ตาราง Eye Exam อ่านได้ ---
        const filteredEye = activityLogData.filter(entry => 
            entry.activity_type === "Eye Exam" && entry.status === "Done"
        );

        const legacyEyeHistoryData = filteredEye.map(entry => {
            return {
                datetimeSort: new Date(entry.effective_time).toISOString(),
                datetime: entry.effective_time.split(',')[0],
                dvm: entry.dvm || '', 
                plr_od: entry.parameters.plr_od,
                plr_os: entry.parameters.plr_os,
                palpebral_od: entry.parameters.palpebral_od,
                palpebral_os: entry.parameters.palpebral_os,
                dazzle_od: entry.parameters.dazzle_od,
                dazzle_os: entry.parameters.dazzle_os,
                menace_od: entry.parameters.menace_od,
                menace_os: entry.parameters.menace_os,
                stt_od: entry.parameters.stt_od,
                stt_os: entry.parameters.stt_os,
                iop_od: entry.parameters.iop_od,
                iop_os: entry.parameters.iop_os,
                fluorescein_od: entry.parameters.fluorescein_od,
                fluorescein_os: entry.parameters.fluorescein_os,
                imageUrl: (entry.parameters.Note) ? 'eyeexam.png' : null 
            };
        });

        renderEyeExamHistoryTable(legacyEyeHistoryData); 
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); 
        }
    };
    const hideEyePopup = () => { if (eyeModal) eyeModal.classList.add('hidden'); };
    
    // (*** (แก้ไข) ผูก Event กับปุ่ม FAB ใหม่ ***)
    if (openEyeButton_fab) openEyeButton_fab.addEventListener('click', showEyePopup);
    if (closeEyeX) closeEyeX.addEventListener('click', hideEyePopup);
    if (closeEyeCancel) closeEyeCancel.addEventListener('click', hideEyePopup);
    
    // --- Modal: Drawing Demo (NEW) ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    const drawingModal = document.getElementById('drawing-demo-modal');
    const closeDrawingX = document.getElementById('close-drawing-demo-x');
    const cancelDrawingBtn = document.getElementById('drawing-demo-cancel');
    const saveDrawingBtn = document.getElementById('drawing-demo-save');
    const drawingResultImg = document.getElementById('drawing-result-image');
    
    const showDrawingPopup = () => {
        if (drawingModal) drawingModal.classList.remove('hidden');
        initializeDrawingDemo('eyeexam.png'); 
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    const hideDrawingPopup = () => { if (drawingModal) drawingModal.classList.add('hidden'); }

    if (openDrawingBtn) openDrawingBtn.addEventListener('click', showDrawingPopup);
    if (closeDrawingX) closeDrawingX.addEventListener('click', hideDrawingPopup);
    if (cancelDrawingBtn) cancelDrawingBtn.addEventListener('click', hideDrawingPopup);
    
    if (saveDrawingBtn) {
        saveDrawingBtn.addEventListener('click', () => {
            if (fabricCanvas) {
                const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 0.8 });
                drawingResultImg.src = dataURL;
                hideDrawingPopup();
            }
        });
    }

    // --- Modal: Image Viewer (NEW) ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    const imageViewerModal = document.getElementById('image-viewer-modal');
    const closeImageViewerX = document.getElementById('close-image-viewer-x');
    const fullImageViewerSrc = document.getElementById('full-image-viewer-src');
    const eyeHistoryTableBody = document.getElementById('eyeHistoryTableBody');

    const hideImageViewer = () => { if (imageViewerModal) imageViewerModal.classList.add('hidden'); };
    
    if (eyeHistoryTableBody) {
        eyeHistoryTableBody.addEventListener('click', function(event) {
            if (event.target.classList.contains('history-thumbnail')) {
                fullImageViewerSrc.src = event.target.dataset.fullSrc;
                imageViewerModal.classList.remove('hidden');
            }
        });
    }
    if (closeImageViewerX) closeImageViewerX.addEventListener('click', hideImageViewer);
    if (imageViewerModal) imageViewerModal.addEventListener('click', (event) => {
        if (event.target === imageViewerModal) hideImageViewer();
    });

    // --- (NEW) Numpad Modal Logic ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    const numpadModal = document.getElementById('numpad-modal');
    const numpadTargetInput = document.getElementById('numpad-target-id');
    const numpadInputs = document.querySelectorAll('input[data-numpad="true"]');

    numpadInputs.forEach(input => {
        input.addEventListener('click', (e) => {
            numpadTargetInput.value = e.target.id;
            numpadModal.classList.remove('hidden');
        });
    });

    if (numpadModal) {
        numpadModal.addEventListener('click', (e) => {
            const target = e.target.closest('.numpad-btn');
            if (!target) {
                 if (e.target === numpadModal) {
                     numpadModal.classList.add('hidden');
                 }
                 return;
            }
            const value = target.dataset.value;
            const targetInput = document.getElementById(numpadTargetInput.value);
            if (!targetInput) return;
            switch(value) {
                case 'close': numpadModal.classList.add('hidden'); break;
                case 'clear': targetInput.value = ''; break;
                case 'backspace': targetInput.value = targetInput.value.slice(0, -1); break;
                case '.': if (!targetInput.value.includes('.')) { targetInput.value += value; } break;
                default: targetInput.value += value; break;
            }
        });
    }

    // --- Tab Switching Logic (Vital Signs) ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    vitalsTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;
            vitalsTabLinks.forEach(tab => {
                tab.classList.remove('tab-active');
                tab.classList.add('tab-inactive');
            });
            link.classList.remove('tab-inactive');
            link.classList.add('tab-active');
            vitalsTabContents.forEach(content => {
                content.classList.add('hidden');
            });
            vitalsModal.querySelector(`#content-${tabId}`).classList.remove('hidden');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
    // --- Tab Switching Logic (Eye Exam) (NEW) ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    eyeTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;
            eyeTabLinks.forEach(tab => {
                tab.classList.remove('tab-active');
                tab.classList.add('tab-inactive');
            });
            link.classList.remove('tab-inactive');
            link.classList.add('tab-active');
            eyeTabContents.forEach(content => {
                content.classList.add('hidden');
            });
            eyeModal.querySelector(`#content-${tabId}`).classList.remove('hidden');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // --- Problem List Modal (Tagging Section) ---
    // ( ... โค้ดส่วนนี้คงเดิม ... )
    const categoryList = document.getElementById('category-list');
    const categoryItems = categoryList ? categoryList.querySelectorAll('li[data-category-id]') : [];
    const resultTableBody = document.getElementById('result-table-body');
    const resultHeader = document.getElementById('result-header'); 

    function updateSelectedCount() {
        if (!resultTableBody || !resultHeader) return;
        const selectedCount = resultTableBody.querySelectorAll('input[type="checkbox"]:checked').length;
        resultHeader.textContent = `Result (${selectedCount} selected)`;
    }
    function renderResultTable(categoryId) {
        if (!resultTableBody || !categoryData[categoryId]) return;
        const data = categoryData[categoryId];
        resultTableBody.innerHTML = ''; 
        if (data.length === 0) {
            resultTableBody.innerHTML = `<tr><td colspan="3" class="p-3 text-center text-gray-500 dark:text-[--color-text-muted]">No items in this category.</td></tr>`;
        } else {
            data.forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('hover:bg-gray-50', 'dark:hover:bg-[--color-bg-secondary]/50');
                row.innerHTML = `<td class="p-3"><input type="checkbox"></td><td class="p-3">${item.term}</td><td class="p-3 text-xs text-gray-600 dark:text-[--color-text-muted]">${item.tags}</td>`;
                resultTableBody.appendChild(row);
            });
        }
        updateSelectedCount(); 
    }
    if (categoryList && categoryItems.length > 0 && resultTableBody) {
        resultTableBody.addEventListener('click', (event) => {
            if (event.target.type === 'checkbox') {
                updateSelectedCount();
            }
        });
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.categoryId;
                categoryItems.forEach(li => {
                    li.classList.remove('bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]', 'font-semibold');
                    li.classList.add('hover:bg-gray-50', 'dark:hover:bg-[--color-bg-secondary]/50');
                });
                item.classList.add('bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]', 'font-semibold');
                item.classList.remove('hover:bg-gray-50', 'dark:hover:bg-[--color-bg-secondary]/50');
                renderResultTable(categoryId);
            });
        });
        renderResultTable('common');
    }
    
    
    // **** START: Vital Signs Internal Script (Merged - อัปเกรด BETA 3.1) ****
    // (*** (แก้ไข) ลบ const vsHistoryData = [...] ออก ***)
    const vsTableBody = document.getElementById('historyTableBody');
    const vsNoHistoryMessage = document.getElementById('noHistoryMessage');
    const vsHistoryHeaders = document.querySelectorAll('#historyTable .history-sort-header'); 

    let vsCurrentSort = {
        column: 'datetimeSort',
        direction: 'desc'
    };

    function renderVsHistoryTable(data) {
        if (!vsTableBody) return; 
        vsTableBody.innerHTML = ''; 

        if (data.length === 0) {
            if (vsNoHistoryMessage) vsNoHistoryMessage.classList.remove('hidden');
            if (vsTableBody.parentNode) vsTableBody.parentNode.classList.add('hidden');
            return;
        }
        
        if (vsNoHistoryMessage) vsNoHistoryMessage.classList.add('hidden');
        if (vsTableBody.parentNode) vsTableBody.parentNode.classList.remove('hidden');

        data.forEach(item => {
            const cyanosisText = item.cyanosis ? '<span class="font-semibold text-[var(--color-danger)]">Yes</span>' : '<span class="text-[var(--color-text-muted)]">No</span>';
            const seizureText = item.seizure ? '<span class="font-semibold text-[var(--color-danger)]">Yes</span>' : '<span class="text-[var(--color-text-muted)]">No</span>';
            const arrestText = item.arrest ? '<span class="font-semibold text-[var(--color-danger)]">Yes</span>' : '<span class="text-[var(--color-text-muted)]">No</span>';
            const noteSnippet = (item.note && item.note.length > 20) ? item.note.substring(0, 20) + '...' : (item.note || '');

            const row = `
                <tr>
                    <td class="text-[var(--color-text-base)] sticky left-0">${item.datetime}</td>
                    <td class="text-[var(--color-text-base)]">${item.temp || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.rr || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.hr || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.bp || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.pulse || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.crt || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.fbs || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.mucous || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.lung || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.heart || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.pulse_quality || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.loc || ''}</td>
                    <td class="text-[var(--color-text-base)]">${item.pain || ''}</td>
                    <td class="text-center">${cyanosisText}</td>
                    <td class="text-center">${seizureText}</td>
                    <td class="text-center">${arrestText}</td>
                    <td class="text-[var(--color-text-muted)]" title="${item.note || ''}">${noteSnippet}</td>
                    <td class="text-[var(--color-text-base)]">
                        <button class="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]" title="View/Edit">
                            <i data-lucide="more-vertical" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `;
            const rowElement = document.createElement('tr');
            rowElement.innerHTML = row;
            const firstTd = rowElement.querySelector('td:first-child');
            firstTd.style.backgroundColor = 'var(--color-bg-content)';
            
            rowElement.addEventListener('mouseenter', () => firstTd.style.backgroundColor = 'var(--color-bg-secondary)');
            rowElement.addEventListener('mouseleave', () => firstTd.style.backgroundColor = 'var(--color-bg-content)');
            
            vsTableBody.appendChild(rowElement);
        });
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function sortVsData(data, column, direction) {
        data.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (column === 'datetime') {
                valA = a['datetimeSort'];
                valB = b['datetimeSort'];
                return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (['pulse', 'hr', 'rr', 'temp', 'pain', 'fbs'].includes(column)) {
                valA = valA === null ? (direction === 'asc' ? Infinity : -Infinity) : valA;
                valB = valB === null ? (direction === 'asc' ? Infinity : -Infinity) : valB;
                return direction === 'asc' ? valA - valB : valB - valA;
            }
            if (['cyanosis', 'seizure', 'arrest'].includes(column)) {
                 return direction === 'asc' ? (valA === valB ? 0 : valA ? 1 : -1) : (valA === valB ? 0 : valA ? -1 : 1);
            }
            valA = valA === null ? '' : String(valA).toLowerCase();
            valB = valB === null ? '' : String(valB).toLowerCase();

            if (column === 'crt') {
                valA = valA.toString().replace('<', '0').replace('>', '9');
                valB = valB.toString().replace('<', '0').replace('>', '9');
            }
            if (valA < valB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    function updateVsSortUI(activeHeader) {
        vsHistoryHeaders.forEach(header => {
            const iconWrapper = header.querySelector('.sort-icon');
            if (iconWrapper) {
                iconWrapper.innerHTML = '<i data-lucide="minus" class="w-4 h-4"></i>';
                iconWrapper.classList.remove('asc', 'desc');
            }
        });
        const activeIconWrapper = activeHeader.querySelector('.sort-icon');
        if (activeIconWrapper) {
            activeIconWrapper.classList.add(vsCurrentSort.direction);
            activeIconWrapper.innerHTML = `<i data-lucide="${vsCurrentSort.direction === 'asc' ? 'arrow-up' : 'arrow-down'}" class="w-4 h-4"></i>`;
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); 
        }
    }
    
    // (*** (แก้ไข) ผูก Event Listener ของ Header ที่นี่ ***)
    if (vsHistoryHeaders.length > 0) {
        vsHistoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortColumn = header.dataset.sort;
                if (!sortColumn) return; 

                if (vsCurrentSort.column === sortColumn) {
                    vsCurrentSort.direction = vsCurrentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    vsCurrentSort.column = sortColumn;
                    vsCurrentSort.direction = sortColumn === 'datetime' ? 'desc' : 'asc';
                }
                
                // (เรียก showVitalsPopup() ใหม่เพื่อกรอง, แปลง, และเรียงลำดับข้อมูลใหม่)
                showVitalsPopup(); 
                updateVsSortUI(header);
            });
        });
    }


    // --- (FIX 3/3) แก้ไขปุ่ม Chart ---
    const bpChartBtn = document.getElementById('bp-chart-btn');
    const vitalsChartBtn = document.getElementById('vitals-chart-btn');

    // (Helper Function สำหรับแปลงข้อมูลให้ Chart)
    function getLegacyVsDataForChart() {
        const filteredVitals = activityLogData.filter(entry => 
            entry.activity_type === "Vital Signs" && entry.status === "Done"
        );
        return filteredVitals.map(entry => {
            return {
                datetimeSort: new Date(entry.effective_time).toISOString(),
                datetime: entry.effective_time, // (Chart ต้องการ Full Datetime)
                bp: entry.parameters.BP,
                pulse: entry.parameters.Pulse,
                hr: entry.parameters.HR,
                rr: entry.parameters.RR,
                temp: entry.parameters.Temp,
                fbs: entry.parameters.FBS,
            };
        });
    }

    if (bpChartBtn) {
        bpChartBtn.addEventListener('click', () => {
            const chartData = getLegacyVsDataForChart();
            openBpChart(chartData); // (ส่งข้อมูลที่แปลงแล้วไปให้ Chart)
        });
    }
    if (vitalsChartBtn) {
        vitalsChartBtn.addEventListener('click', () => {
            const chartData = getLegacyVsDataForChart();
            openVitalsChart(chartData); // (ส่งข้อมูลที่แปลงแล้วไปให้ Chart)
        });
    }
    
    // **** END: Vital Signs Internal Script (Merged) ****


    // --- Initialize Lucide Icons (Final call on initial load) ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

// =================================================================
// START: (ใหม่) BETA 3.0 - Logic สำหรับ Vital Signs Pop-up
// =================================================================

// (ฟังก์ชัน Helper ใหม่สำหรับ Format วันที่ตามที่คุณต้องการ)
function formatKAHISDateTime(dateObj) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = monthNames[dateObj.getMonth()]; 
    const y = dateObj.getFullYear();
    const h = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    const sec = String(dateObj.getSeconds()).padStart(2, '0');
    
    // 31 Dec 2025, 23:58:00
    return `${d} ${m} ${y}, ${h}:${min}:${sec}`; 
}

// (ฟังก์ชันนี้จะถูกเรียกโดย initializeApp() ที่อยู่ข้างบน)
function initializeVitalSignsSaveLogic() {
    
    const saveButton = document.getElementById('btn-save-vitals');
    const vitalsModal = document.getElementById('vitals-popup-modal');
    
    if (!saveButton) {
        console.error("Vital Signs Save Button not found!");
        return;
    }

    saveButton.addEventListener('click', () => {
        
        // --- 1. รวบรวมข้อมูลจากฟอร์ม ---
        const effectiveDate = document.getElementById('vs-effective-date').value;
        const effectiveTime = document.getElementById('vs-effective-time').value;
        const dvm = document.getElementById('vs-dvm').value;
        const department = document.getElementById('vs-department').value;
        
        // (*** (แก้ไข) ตรวจสอบค่าว่างของ Date/Time ก่อน ***)
        if (!effectiveDate || !effectiveTime) {
            alert("Please select Effective Date and Time.");
            return;
        }

        const effectiveTimestamp = formatKAHISDateTime(new Date(`${effectiveDate}T${effectiveTime}`));
        const recordTimestamp = formatKAHISDateTime(new Date()); 
        
        const parameters = {
            Temp: document.getElementById('vs-temp').value || null,
            RR: document.getElementById('vs-rr').value || null,
            HR: document.getElementById('vs-hr').value || null,
            BP: document.getElementById('vs-bp').value || null,
            Pulse: document.getElementById('vs-pulse').value || null,
            CRT: document.getElementById('vs-crt').value || null,
            FBS: document.getElementById('vs-fbs').value || null,
            MM: document.getElementById('mucous-dropdown').value || null,
            Lung: document.getElementById('lung-dropdown').value || null,
            Heart: document.getElementById('heart-dropdown').value || null,
            Pulse_Quality: document.getElementById('pulse-quality-dropdown').value || null,
            LOC: document.getElementById('gcs-dropdown').value || null,
            Pain: document.getElementById('pain-score-dropdown').value || null,
            Cyanosis: document.getElementById('check-cyanosis').checked ? 'Yes' : 'No',
            Seizure: document.getElementById('check-seizure').checked ? 'Yes' : 'No',
            Arrest: document.getElementById('check-arrest').checked ? 'Yes' : 'No',
            Note: document.getElementById('system-review-notes').value || ""
        };

        // --- 2. สร้าง Entry ใหม่ (ตาม Workflow A) ---
        const timestamp = Date.now();
        const newEntry = {
            entry_id: `E-${timestamp}`,
            order_no: `ORD-${timestamp}`, 
            acc_no: `VS-${timestamp}`,   
            activity_type: "Vital Signs",
            status: "Done", 
            
            effective_time: effectiveTimestamp, 
            target_time: null,
            order_note: "",

            parameters: parameters,

            recorded_by: "User (Login)", 
            dvm: dvm || null, 
            department: department, 
            
            last_updated_by: "User (Login)",
            last_updated_on: recordTimestamp, 
            disable_remark: ""
        };

        // --- 3. บันทึกข้อมูลลงฐานข้อมูลกลาง ---
        activityLogData.push(newEntry);

        alert("Vital Signs Saved!\n(Check activityLogData in console)");
        console.log("New Entry Added:", newEntry);
        console.log("Current activityLogData:", activityLogData);

        // (*** (ใหม่) เคลียร์ฟอร์มและปิด Modal ***)
        
        // (เคลียร์ค่า input)
        document.getElementById('vs-temp').value = '';
        document.getElementById('vs-rr').value = '';
        document.getElementById('vs-hr').value = '';
        document.getElementById('vs-bp').value = '';
        document.getElementById('vs-pulse').value = '';
        document.getElementById('vs-crt').value = '';
        document.getElementById('vs-fbs').value = '';
        document.getElementById('mucous-dropdown').value = '';
        document.getElementById('lung-dropdown').value = '';
        document.getElementById('heart-dropdown').value = '';
        document.getElementById('pulse-quality-dropdown').value = '';
        document.getElementById('gcs-dropdown').value = '';
        document.getElementById('pain-score-dropdown').value = '';
        document.getElementById('check-cyanosis').checked = false;
        document.getElementById('check-seizure').checked = false;
        document.getElementById('check-arrest').checked = false;
        document.getElementById('system-review-notes').value = '';
        document.getElementById('vs-effective-date').value = '';
        document.getElementById('vs-effective-time').value = '';
        document.getElementById('vs-dvm').value = '';
        // (ไม่ต้องเคลียร์ Department ที่เป็น Default)

        // (ปิด Modal)
        vitalsModal.classList.add('hidden');
    });
}

// =================================================================
// END: (ใหม่) BETA 3.0 - Logic
// =================================================================
}