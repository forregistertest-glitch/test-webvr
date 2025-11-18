// This is app-helpers.js (BETA 3.2 - Updated)

// --- Copy to Clipboard Function (คงเดิม) ---
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; 
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        return true;
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}


// --- (ใหม่) Show "Copied!" Sparkle Effect Function ---
// (ฟังก์ชันนี้จะแทนที่ showCopyMessage เดิม)
function showSparkleCopyEffect(buttonElement) {
    if (!buttonElement) return;

    // 1. สร้าง element "Copied!"
    const toast = document.createElement('span');
    toast.textContent = 'Copied!';
    
    // (ใช้ Class ที่เราเพิ่งเพิ่มใน kahis-theme.css)
    toast.className = 'copied-sparkle-toast'; 
    
    // 2. เพิ่มเข้าในหน้าเว็บ
    document.body.appendChild(toast);

    // 3. คำนวณตำแหน่ง (ให้อยู่เหนือปุ่ม)
    try {
        const rect = buttonElement.getBoundingClientRect();
        
        // (ตำแหน่ง X: กึ่งกลางปุ่ม)
        const left = rect.left + (rect.width / 2);
        // (ตำแหน่ง Y: เหนือปุ่ม 10px)
        const top = rect.top - 10; 

        toast.style.left = left + 'px';
        toast.style.top = top + 'px';
        
        // (เนื่องจากเราตั้ง left เป็นกึ่งกลาง, เราต้องใช้ transform เพื่อย้ายกลับมา 50%)
        toast.style.transform = 'translateX(-50%)';

    } catch (e) {
        console.error("Error positioning sparkle toast:", e);
        // (ถ้ามีปัญหา ให้แสดงผลตรงกลางหน้าจอแทน)
        toast.style.left = '50%';
        toast.style.top = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
    }

    // 4. ลบ Element ทิ้งเมื่อ Animation จบ
    // (Animation ใน CSS ของเราตั้งไว้ที่ 1s หรือ 1000ms)
    setTimeout(() => {
        toast.remove();
    }, 1000);
}