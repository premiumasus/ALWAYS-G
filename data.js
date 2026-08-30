// ==========================================
// CENTRAL DATA STORE (Firebase Realtime Engine)
// ==========================================

// ใช้ฐานข้อมูลออนไลน์กลางฟรี (คนละเครื่องก็เห็นพร้อมกัน)
const DB_URL = "https://my-wda-project-default-rtdb.firebaseio.com/members";

// ดึงรายชื่อทั้งหมดจากระบบกลาง
async function fetchMembersData() {
  try {
    const res = await fetch(`${DB_URL}.json`);
    const data = await res.json();
    if (!data) return [];
    
    // แปลงข้อมูล Object เป็น Array รายชื่อ
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } catch (err) {
    console.error("Fetch Data Error:", err);
    return [];
  }
}

// เพิ่มรายชื่อใหม่เข้าระบบกลาง
async function addMemberData(memberObj) {
  try {
    await fetch(`${DB_URL}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberObj)
    });
    triggerUpdate();
  } catch (err) {
    console.error("Add Error:", err);
  }
}

// อัปเดตข้อมูลรายชื่อ
async function updateMemberData(id, key, value) {
  try {
    await fetch(`${DB_URL}/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value.trim() })
    });
    triggerUpdate();
  } catch (err) {
    console.error("Update Error:", err);
  }
}

// ลบรายชื่อออกจากระบบกลาง
async function deleteMemberData(id) {
  try {
    await fetch(`${DB_URL}/${id}.json`, { method: 'DELETE' });
    triggerUpdate();
  } catch (err) {
    console.error("Delete Error:", err);
  }
}

// ส่งสัญญาณให้หน้าเว็บวาดรายชื่อใหม่
function triggerUpdate() {
  if (typeof window.onRealtimeUpdate === 'function') {
    window.onRealtimeUpdate();
  }
}

// Polling เช็ครายชื่อใหม่ทุก 2 วินาที (เรียลไทม์ข้ามเครื่อง)
setInterval(() => {
  triggerUpdate();
}, 2000);
