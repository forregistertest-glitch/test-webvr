# KAHIS EMR PROTOTYPE - VERSION.MD
(เรียงลำดับจากใหม่ล่าสุดไปเก่าสุด)

## BETA 3.1 VERSION (Bug Fixing & Data Population)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ไข Bug ร้ายแรงที่เกิดขึ้นหลังจากเริ่มแผน BETA 3.0 (Data Model Refactor) ซึ่งทำให้หน้า Pop-up (Vital Signs, Eye Exam) ไม่สามารถแสดงข้อมูล History และ Chart ได้, รวมถึงแก้ไข Bug ที่หน้า UI

### สิ่งที่อัพเดท (Bugs Found & Updates)
* **[BUG 1] UI Pop-up พัง:** หน้า "New Vital Signs" มีโค้ดเก่าและใหม่ซ้ำซ้อนกัน ทำให้ส่วน "Note" หายไป และ Title "Effective Date/Time" เพี้ยน
* **[BUG 2] CSS ซ้อนทับ:** หัวตาราง (`thead th`) ของ `historyTable` มี `z-index` สูงหรือเท่ากับคอลัมน์แรก (`sticky-col`) ทำให้ตัวหนังสือซ้อนกัน
* **[BUG 3] History หาย:** ตาราง History (ทั้ง Vital Signs และ Eye Exam) ไม่มีข้อมูลแสดงผล (หรือมี 1 แถว)
* **[BUG 4] Chart ไม่ทำงาน:** ปุ่ม Chart (BP, Vitals) ไม่ทำงาน

### แผนการอัพเดท (The 4-Step Bug Fix Plan)
1.  **`index.html` (แก้ไข):** "รื้อ" โค้ดที่ซ้ำซ้อนกันภายใน `<div id="content-new-vitals">` ทิ้งทั้งหมด และ "แทนที่" ด้วยโค้ดที่ถูกต้อง (ที่มี Section "Note" และ Title `h2` ที่มีสไตล์ครบถ้วน)
2.  **`kahis-theme.css` (แก้ไข):** แก้ไข `z-index` ของ `#historyTable thead th` ให้เป็น `10` (ซึ่งต่ำกว่า `z-index: 20` ของ `th:first-child`) เพื่อแก้ปัญหาการซ้อนทับ
3.  **`app-data.js` (แก้ไข):** "อัดข้อมูล" ตัวอย่าง 33 รายการ (VS 20 "Done", VS 5 "Order/Cancel", Eye 5 "Done", Eye 3 "Order") เข้าไปใน `activityLogData`
4.  **`app-init.js` (แก้ไข):** "ต่อสายไฟใหม่"
    * แก้ไข `showVitalsPopup()` และ `showEyePopup()` ให้ดึงข้อมูลจาก `activityLogData` (โดยกรอง `status: "Done"`)
    * สร้าง "Adapter" (ตัวแปลงข้อมูล) เพื่อแปลง Data Model ใหม่ (26+ fields) กลับไปเป็น Model เก่า (18 fields) ที่ตาราง History (`renderVsHistoryTable`) ต้องการ
    * แก้ไข Logic ของปุ่ม Chart (`bpChartBtn`, `vitalsChartBtn`) ให้ดึงข้อมูลจาก `activityLogData` เช่นกัน

---

## BETA 3.0 VERSION (Data Model Refactor)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
เพื่อ "ผ่าตัด" ระบบข้อมูล (Data Model) ใหม่ทั้งหมด ให้รองรับแนวคิด **"ระบบ Order" (Order-Based System)** ซึ่งเป็นรากฐานที่จำเป็นก่อนที่จะสร้างแท็บ "Objective (Daily Log)"

### สิ่งที่อัพเดท (Core Concepts)
1.  **Central Database:** สร้างฐานข้อมูลกลาง `activityLogData` เพื่อเก็บ "ทุก" กิจกรรม (Vitals, Eye, Plan, Lab ฯลฯ)
2.  **Order vs Action:** แยก "คำสั่ง" (`order_no`) ออกจาก "การกระทำ" (`acc_no`)
3.  **Lifecycle:** กำหนดวงจรชีวิตของกิจกรรม (`Status: "Order", "Accept", "Process", "Done", "Cancelled"`)
4.  **Timestamping:** แยก "เวลาของข้อมูล" (`effective_time`) ออกจาก "เวลาที่บันทึก" (`last_updated_on` / `record_time`)
5.  **Planning:** เพิ่ม `target_time` (วัน-เวลาเป้าหมาย) และ `order_note` (บันทึกย่อยของแต่ละคำสั่ง)

### แผนการอัพเดท (The 5-Step Plan)
1.  **`app-data.js` (แก้ไข):** ลบ `vsHistoryData` และ `eyeExamHistoryData` สร้าง `activityLogData` ใหม่
2.  **`index.html` (แก้ไข):** อัปเกรด `#vitals-popup-modal` ให้มีช่อง `Effective Date/Time`, `DVM`, `Department`
3.  **`app-init.js` (แก้ไข):** อัปเกรดปุ่ม "Save Vital Signs" ให้บันทึกข้อมูล (Workflow A) ลงใน `activityLogData` (Status: "Done")
4.  **`order_pe_content.html` (แก้ไข):** สร้าง UI (Workflow B) ที่มีช่อง Target Time, DVM, Dept และปุ่ม Order (พร้อม Note Modal)
5.  **`order-pe-init.js` (สร้างใหม่):** สร้างไฟล์ JS นี้เพื่อควบคุม Workflow B ให้บันทึกลง `activityLogData` (Status: "Order") และเชื่อมต่อกับ `app-logic.js` / `index.html`

---

## BETA 2.1 VERSION (Ext Doc Fix - "New Ext Doc" Button)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ไข Bug ที่ปุ่ม "New Ext Doc" ไม่ทำงานหลังจากผนวกรวมโมดูล (BETA 2.0)

### สิ่งที่อัพเดท (Bugs Found & Updates)
* **[BUG] "Cannot GET /Extdoc_Module_Addnew.html":** เกิดขึ้นเพราะปุ่มถูกเปลี่ยนเป็น `<a href...>` ซึ่งเป็นการ "ลิงก์" (Navigation) แทนที่จะเป็นการ "โหลด" (Module Loading)
* **[FIX]** เปลี่ยนกลับไปใช้ `<button id="btn-goto-addnew">`
* **[FIX]** สร้างไฟล์ `extdoc_page_addnew.html` (ชิ้นส่วน HTML)
* **[FIX]** สร้างไฟล์ `extdoc-addnew-init.js` เพื่อควบคุมหน้า "Add New" และอัปเกรด Lightbox ให้เป็นแบบ "อัลบั้ม"
* **[FIX]** อัปเกรด `app-logic.js` ให้รู้จัก `extdoc_page_addnew.html`
* **[FIX]** อัปเกรด `extdoc-init.js` ให้ผูก Event Click กับปุ่ม `#btn-goto-addnew`
* **[FIX]** อัปเกรด `index.html` ให้โหลด `<script src="extdoc-addnew-init.js"></script>`

---

## BETA 2.0 VERSION (Ext Doc Integration - Concept)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
ผนวกรวม (Integrate) ฟีเจอร์จากไฟล์ต้นแบบ `Extdoc_Module_...html` เข้ากับโครงสร้าง SPA (BETA 1.0)

### แผนการอัพเดท (The 9-Step Plan)
1.  **สร้าง `extdoc_tab_date.html`** (ชิ้นส่วน HTML)
2.  **สร้าง `extdoc_tab_filter.html`** (ชิ้นส่วน HTML)
3.  **อัปเกรด `ext_doc_content.html`** (ให้เป็น Container)
4.  **อัปเกรด `index.html`** (เพิ่ม `#lightbox-album-modal`)
5.  **สร้าง `extdoc-data.js`** (ย้าย Data)
6.  **สร้าง `extdoc-logic.js`** (ย้าย Functions/Lightbox Logic)
7.  **สร้าง `extdoc-init.js`** (สร้าง `initializeExtDocScripts()`)
8.  **อัปเกรด `app-logic.js`** (สอน `loadModuleContent` ให้รู้จัก `initializeExtDocScripts()`)
9.  **อัปเกรด `index.html`** (เพิ่ม `<script>` ใหม่ 3 ไฟล์)

---

## BETA 1.0 VERSION (Core Refactor)
(16-17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ปัญหาไฟล์ `app.js` (Alpha) ที่มีขนาดใหญ่เกินไป (Monolithic) โดยการ "หั่น" (Refactor) ไฟล์ออกเป็นไฟล์ย่อยๆ ตามหน้าที่

### แผนการอัพเดท (The 8-Step Refactor)
1.  **`app-data.js` (ใหม่):** เก็บข้อมูลดิบ (Data Arrays)
2.  **`app-helpers.js` (ใหม่):** เก็บฟังก์ชันช่วยเหลือ (เช่น `copyToClipboard`)
3.  **`app-drawing.js` (ใหม่):** เก็บ Logic ของ Fabric.js
4.  **`app-charts.js` (ใหม่):** เก็บ Logic ของ Chart.js
5.  **`app-logic.js` (ใหม่):** เก็บ Logic หลัก (เช่น `loadModuleContent`)
6.  **`app-init.js` (ใหม่):** เก็บโค้ด `DOMContentLoaded` ทั้งหมด
7.  **`app.js` (แก้ไข):** ลบโค้ดทั้งหมดออก ให้เหลือแค่ตัวเรียก `initializeApp()`
8.  **`index.html` (แก้ไข):** เปลี่ยนไปเรียก `<script>` ทั้ง 7 ไฟล์ตามลำดับ

---

## END ALPHA VERSION (Initial Analysis)
(16 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
วิเคราะห์โปรเจค EMR ที่ได้รับมา (ไฟล์ `index.html`, `app.js`, `kahis-theme.css`, และโมดูล HTML)

### สิ่งที่อัพเดท (Analysis Summary)
* **สถาปัตยกรรม:** เป็น SPA (Single Page Application) แบบ "Shell"
* **Logic:** `app.js` ทำหน้าที่เป็น Monolithic Controller โดยใช้ `fetch()` และ `innerHTML` เพื่อสลับโมดูล (`assessment_content.html`, ฯลฯ)
* **เทคโนโลยี:** Tailwind CSS, Alpine.js, Chart.js, Fabric.js, Lucide Icons
* **ฟีเจอร์:** Dark Mode, Modals (Vital Signs, Eye Exam), Dynamic History Tables (Sortable), Client-Side Data (Hardcoded Arrays)

### บทวิเคราะห์โปรเจค (Project Analysis)
นี่คือโปรเจค Front-End สำหรับ **ระบบเวชระเบียนอิเล็กทรอนิกส์ (EMR)** ซึ่งดูเหมือนจะเป็นหน้าจอสำหรับสัตวแพทย์ (DVM) เพื่อบันทึกข้อมูลการตรวจรักษา โดยมีชื่อระบบคือ **KAHIS** โปรเจคนี้เป็นเว็บแอปพลิเคชันแบบหน้าเดียว (Single Page Application - SPA) ที่ใช้การโหลดเนื้อหาแบบไดนามิก

### 1. สถาปัตยกรรมและโครงสร้าง (Architecture)
* **`index.html` (ไฟล์หลัก):** ทำหน้าที่เป็น "Shell" หรือ "เปลือก" ของแอปพลิเคชัน มีโครงสร้างถาวร เช่น Header (เมนู), Pet Info Bar (ข้อมูลสัตว์เลี้ยง), และ Footer (ปุ่ม Vital Signs, Dark Mode)
* **`app.js` (ไฟล์ควบคุม):** นี่คือหัวใจของโปรเจค
* **ไฟล์ `.html` อื่นๆ (Module Content):** ไฟล์เช่น `assessment_content.html`, `subj_content.html`, `plan_content.html` ฯลฯ ไม่ใช่หน้าเว็บที่สมบูรณ์ แต่เป็น "ชิ้นส่วน" ของ HTML ที่จะถูกดึง (fetch) โดย `app.js` และนำมาแสดงในช่องว่าง `#emr-content-placeholder` ใน `index.html`

### 2. เทคโนโลยีหลักที่ใช้ (Technology Stack)
1.  **Tailwind CSS:** ใช้สำหรับจัดสไตล์และ Layout ทั้งหมด
2.  **Alpine.js:** ใช้จัดการ UI เล็กๆ น้อยๆ ที่มีการโต้ตอบ (Interactivity) เช่น การเปิด-ปิด Dropdown Menu ใน Header
3.  **Chart.js:** ใช้สำหรับสร้างกราฟที่แสดงใน Pop-up (เช่น กราฟ BP Chart และ Vital Signs Chart)
4.  **Fabric.js:** ใช้สำหรับทำ "Drawing Tool" (เครื่องมือวาดภาพ/เขียนข้อความ) บน `eyeexam.png`
5.  **Lucide Icons:** ใช้สำหรับไอคอนทั้งหมดในหน้าเว็บ

### 3. ฟีเจอร์หลัก (Key Features)
* **Dark Mode / Theme:** มีระบบสลับ Theme (Light/Dark) ซึ่งถูกกำหนดค่าสีไว้ใน `kahis-theme.css` (โดย Dark Mode เป็นธีมสีเบจ/น้ำตาล)
* **Modals (Pop-ups) ที่ซับซ้อน:** (Vital Signs, Eye Exam, Problem List) ที่มี Logic การทำงานภายในตัวเอง
* **Dynamic History Tables:** ตารางประวัติ (ใน Assessment, Vital Signs, Eye Exam) ถูกสร้างขึ้นด้วย JavaScript และมีระบบ Sort ข้อมูล
* **Client-Side Data:** ข้อมูลประวัติทั้งหมด (`vsHistoryData`, `eyeExamHistoryData`, `categoryData`) ถูกเก็บไว้ในตัวแปร JavaScript (Hardcoded)