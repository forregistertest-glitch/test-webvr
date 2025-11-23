// This is app-data.js (BETA 5.6 Revised 3 - Full Data & Problem List Restored)

// =================================================================
// 1. MASTER DATA - SERVICE CATALOG
// =================================================================

// CLINICAL LABORATORY (LIS)
const labServiceCatalog = {
    "HEM": {
        name: "Hematology (โลหิตวิทยา)", icon: "droplet",
        items: [
            { id: "CBC", name: "Complete Blood Count (CBC)", price: 350, container: "Lavender (EDTA)", type: "Panel" },
            { id: "BLP", name: "Blood Parasite Smear", price: 150, container: "Lavender (EDTA)", type: "Test" },
            { id: "COAG", name: "Coagulation (PT/APTT)", price: 850, container: "Light Blue", type: "Panel" }
        ]
    },
    "CHEM": {
        name: "Clinical Chemistry (เคมีคลินิก)", icon: "flask-conical",
        items: [
            { id: "PREOP", name: "Pre-anesthetic Panel", price: 650, container: "Red/SST", type: "Panel" },
            { id: "COMP", name: "Comprehensive Panel", price: 1400, container: "Red/SST", type: "Panel" },
            { id: "RENAL", name: "Renal Panel", price: 500, container: "Red/SST", type: "Panel" },
            { id: "LIVER", name: "Liver Panel", price: 550, container: "Red/SST", type: "Panel" },
            { id: "ELEC", name: "Electrolytes", price: 350, container: "Red/SST", type: "Panel" },
            { id: "GLU", name: "Glucose", price: 100, container: "Grey", type: "Test" }
        ]
    },
    "IMM": {
        name: "Immunology (ภูมิคุ้มกัน)", icon: "shield-check",
        items: [
            { id: "4DX", name: "4Dx Plus Test", price: 950, container: "Lavender", type: "Rapid" },
            { id: "PARVO", name: "Parvovirus Test", price: 500, container: "Feces", type: "Rapid" }
        ]
    }
};

// PATHOLOGY
const pathologyServiceCatalog = {
    "CY": {
        name: "Cytology (เซลล์วิทยา)", icon: "microscope",
        items: [
            { id: "CY01", name: "Cytology - 1 Site", price: 400, req_site: true },
            { id: "CY02", name: "Cytology - 2 Sites", price: 700, req_site: true }
        ]
    },
    "SP": {
        name: "Biopsy (ชิ้นเนื้อ)", icon: "file-text",
        items: [
            { id: "SP-S", name: "Biopsy - Small", price: 1200, req_site: true },
            { id: "SP-ORG", name: "Biopsy - Whole Organ", price: 2500, req_site: true }
        ]
    }
};

// PROBLEM LIST TAGS (กู้คืนแล้ว)
const categoryData = {
    "common": [ { term: "Depressed", tags: "General" }, { term: "Anorexia", tags: "GI" }, { term: "Vomiting", tags: "GI" } ],
    "eye": [ { term: "Corneal ulcer", tags: "Eye" }, { term: "Glaucoma", tags: "Eye" }, { term: "Conjunctivitis", tags: "Eye" } ],
    "ear": [ { term: "Otitis externa", tags: "Ear, Infection" }, { term: "Ear mites", tags: "Ear, Parasite" }, { term: "Aural hematoma", tags: "Ear, Trauma" } ],
    "nose": [ { term: "Nasal discharge", tags: "Nose, Symptom" }, { term: "Sneezing", tags: "Nose, Symptom" } ],
    "throat": [ { term: "Coughing", tags: "Throat, Symptom" }, { term: "Pharyngitis", tags: "Throat, Inflammation" } ],
    "abdomen": [ { term: "Abdominal pain", tags: "Abdomen, Symptom" }, { term: "Diarrhea", tags: "Abdomen, GI" }, { term: "Foreign body", tags: "Abdomen, GI" } ],
    "trauma": [ { term: "Laceration", tags: "Trauma, Skin" }, { term: "Hit by car", tags: "Trauma, HBC" } ],
    "bone": [ { term: "Fracture", tags: "Bone, Trauma" }, { term: "Arthritis", tags: "Bone, Chronic" } ],
    "behavier": [ { term: "Aggression", tags: "Behavior" }, { term: "Anxiety", tags: "Behavior" } ]
};

// ASSESSMENT HISTORY (Mock)
let assessmentHistoryData = [
    { datetime: '2025-12-31 09:00', datetimeStr: '31 Dec 2025 09:00', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-12-30 14:00', datetimeStr: '30 Dec 2025 14:00', dvm: 'Dr. BBB', department: '201' }
];


// =================================================================
// 2. DATA GENERATOR ENGINE
// =================================================================

const MOCK_CONFIG = {
    dates: ["2025-12-30", "2025-12-25", "2025-12-20", "2025-12-10", "2025-12-01"],
    dvms: ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Eye', 'Dr. Surg'],
    depts: ['101 อายุรกรรม', '201 ฉุกเฉิน', '301 คลินิกพิเศษ', '102 ศัลยกรรม'],
    users: ['User Tech', 'User Nurse', 'User Admin', 'Dr. AAA'],
    // Status Logic: 
    // Order Status: Done, Pending, Disable
    // Lab Process: Waiting, Accepted, Approved, Completed, Reported, Cancelled
    lab_statuses: ['Waiting', 'Accepted', 'Approved', 'Completed', 'Reported', 'Cancel']
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomTime = () => {
    const h = String(Math.floor(Math.random() * 12) + 8).padStart(2,'0');
    const m = String(Math.floor(Math.random() * 60)).padStart(2,'0');
    return `${h}:${m}:00`;
};

const formatDateStr = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${timeStr}`;
};

function generateActivityLog() {
    let data = [];
    const modules = ['Vital Signs', 'Eye Exam', 'LIS', 'Pathology'];
    
    modules.forEach(mod => {
        for (let i = 0; i < 30; i++) {
            // 1. Date Logic (30 Dec gets priority)
            let dateBase;
            if (i < 10) dateBase = MOCK_CONFIG.dates[0]; // 30 Dec (10 items)
            else dateBase = MOCK_CONFIG.dates[(i % 4) + 1]; 

            const createTime = getRandomTime();
            const createDateTime = formatDateStr(dateBase, createTime);
            
            // 2. Status Logic
            // 70% Done, 20% Pending, 10% Disable
            const rand = Math.random();
            let orderStatus = 'Done';
            if (rand > 0.7 && rand <= 0.9) orderStatus = 'Pending';
            if (rand > 0.9) orderStatus = 'Disable';

            // 3. ID & Numbers
            const ts = Date.now() - (i * 100000) - (Math.random()*10000);
            const entryId = `E-${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0)}`;
            const orderNo = `ORD-${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0).substr(-6)}`;
            const accNo = (orderStatus === 'Done') ? `${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0).substr(-6)}` : null;

            // 4. Timestamps
            // - Create: createDateTime
            // - Target: if Pending -> createDateTime + 2hr
            // - Effective: if Done -> createDateTime + 10min
            // - Update: createDateTime + 15min
            
            let targetTime = null;
            let effectiveTime = null;
            let updateTime = createDateTime; // Default same as create

            if (orderStatus === 'Pending') {
                // Mock Target time (Future from create)
                targetTime = createDateTime; // Use same string for simplicity in mock or modify logic if needed
            }
            if (orderStatus === 'Done') {
                effectiveTime = createDateTime; 
                updateTime = createDateTime; 
            }

            // 5. Lab Specific Status
            let lisStatus = null;
            if (mod === 'LIS' || mod === 'Pathology') {
                if (orderStatus === 'Done') {
                    lisStatus = getRandom(MOCK_CONFIG.lab_statuses);
                } else if (orderStatus === 'Disable') {
                    lisStatus = 'Cancel'; // Logic: Disable = Lab Cancelled
                }
            }

            // 6. Parameters & Note
            let params = {};
            let orderNote = (Math.random() < 0.2) ? "" : "Routine Check"; // 20% empty note
            
            if (mod === 'Vital Signs') {
                params = {
                    Temp: (99 + Math.random() * 4).toFixed(1),
                    HR: Math.floor(80 + Math.random() * 60),
                    RR: Math.floor(20 + Math.random() * 20),
                    BP: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(60 + Math.random() * 30)}`,
                    Pulse: Math.floor(80 + Math.random() * 60),
                    Note: orderNote
                };
            } else if (mod === 'Eye Exam') {
                params = {
                    plr_od: getRandom(['+', '-', 'Sluggish']),
                    plr_os: getRandom(['+', '-', 'Sluggish']),
                    iop_od: Math.floor(10 + Math.random() * 15),
                    iop_os: Math.floor(10 + Math.random() * 15),
                    Note: orderNote
                };
            } else if (mod === 'LIS') {
                const testPool = ["CBC", "CHEM", "LYTES", "UA", "T4"];
                const tests = [getRandom(testPool)];
                if (Math.random() > 0.5) tests.push(getRandom(testPool));
                params = { tests: tests, note: orderNote };
            } else if (mod === 'Pathology') {
                const item = getRandom(pathologyServiceCatalog.SP.items);
                params = {
                    items: [{ name: item.name, site: "Skin Mass", history: "Chronic" }],
                    history_main: "Mass at leg",
                    items_count: 1
                };
            }

            // 7. Users
            const userRec = getRandom(MOCK_CONFIG.users);
            const userUpd = (Math.random() > 0.5) ? userRec : getRandom(MOCK_CONFIG.users);
            const dvm = getRandom(MOCK_CONFIG.dvms);
            const dept = getRandom(MOCK_CONFIG.depts);

            data.push({
                entry_id: entryId,
                order_no: orderNo,
                acc_no: accNo,
                activity_type: mod,
                order_status: orderStatus,
                lis_process_status: lisStatus,
                hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
                
                // Timestamps required
                order_create_date: createDateTime, // Record/Save time
                target_time: targetTime,
                effective_time: effectiveTime,
                order_update_date: updateTime,
                
                order_note: orderNote,
                parameters: params,
                
                recorded_by: userRec,
                dvm: dvm,
                department: dept,
                last_updated_by: userUpd,
                last_updated_on: updateTime,
                
                disable_remark: (orderStatus === 'Disable') ? "User Cancelled" : ""
            });
        }
    });

    return data.sort((a, b) => new Date(b.order_create_date) - new Date(a.order_create_date));
}

// 3. EXPORT DATA
let activityLogData = generateActivityLog();
console.log("Mock Data Generated: ", activityLogData.length, " items");