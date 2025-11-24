// Filename: patient-data.js
// Description: ข้อมูลผู้ป่วย (Queue), OPD Tags (Category), และประวัติการรับบริการ (History)
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // 1. MASTER DATA - OPD CATEGORY TAGS (Problem List)
    // (Source: Moved from app-data.js)
    // =================================================================
    window.categoryData = {
        "common": [ 
            { term: "Depressed", tags: "General" }, 
            { term: "Anorexia", tags: "GI" }, 
            { term: "Vomiting", tags: "GI" },
            { term: "Fever (Pyrexia)", tags: "General, Sign" },
            { term: "Dehydration", tags: "General, Status" }
        ],
        "eye": [ 
            { term: "Corneal ulcer", tags: "Eye" }, 
            { term: "Glaucoma", tags: "Eye" }, 
            { term: "Conjunctivitis", tags: "Eye" }
        ],
        "ear": [ 
            { term: "Otitis externa", tags: "Ear, Infection" }, 
            { term: "Ear mites", tags: "Ear, Parasite" }
        ],
        "skin": [
            { term: "Alopecia", tags: "Skin" },
            { term: "Pruritus", tags: "Skin" },
            { term: "Dermatitis", tags: "Skin, Inflammation" }
        ],
        "gi": [
            { term: "Diarrhea", tags: "GI" },
            { term: "Constipation", tags: "GI" }
        ]
    };

    // =================================================================
    // 2. MOCK DATA - ASSESSMENT HISTORY (OPD History)
    // (Source: Moved from app-data.js)
    // =================================================================
    window.assessmentHistoryData = [
        { datetime: '2025-12-31 09:00', datetimeStr: '31 Dec 2025 09:00', dvm: 'Dr. AAA', department: '101' },
        { datetime: '2025-12-30 14:00', datetimeStr: '30 Dec 2025 14:00', dvm: 'Dr. BBB', department: '201' },
        { datetime: '2025-12-28 10:30', datetimeStr: '28 Dec 2025 10:30', dvm: 'Dr. CCC', department: '301' },
        { datetime: '2025-12-25 11:15', datetimeStr: '25 Dec 2025 11:15', dvm: 'Dr. AAA', department: '101' },
        { datetime: '2025-12-20 16:45', datetimeStr: '20 Dec 2025 16:45', dvm: 'Dr. Surg', department: '102' }
    ];

    // =================================================================
    // 3. MOCK DATA - PATIENT QUEUE (For Main Dashboard)
    // (Source: Simplified Logic to provide a Queue List)
    // =================================================================
    const mockPets = [
        { hn: "52039575", name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner: "คุณพ่อส้มจี๊ด" },
        { hn: "52039888", name: "น้องมอมแมม", owner: "คุณสมชาย" },
        { hn: "52040123", name: "พี่ทองแดง", owner: "คุณวิชัย" },
        { hn: "52041555", name: "Lucky", owner: "Mrs. Smith" },
        { hn: "52042999", name: "ถุงเงิน", owner: "คุณยายศรี" }
    ];

    function generateQueue() {
        // Creates a simple list of patients currently in the hospital
        return mockPets.map((pet, index) => ({
            hn: pet.hn,
            pet_name: pet.name,
            owner_name: pet.owner,
            status: index === 0 ? 'In Progress' : 'Waiting',
            queue_no: index + 1,
            checkin_time: "09:00"
        }));
    }

    window.patientQueueData = generateQueue();
    console.log("Patient Queue Data Generated:", window.patientQueueData.length);

})();