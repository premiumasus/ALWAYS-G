// ==========================================
// DATA STORE & REALTIME SYNC ENGINE (data.js)
// ==========================================

const STORAGE_KEY = 'wda_members_data';
const CHANNEL_NAME = 'wda_realtime_channel';

// ข้อมูลเริ่มต้นกรณีเปิดเว็บครั้งแรก
const DEFAULT_MEMBERS = [
  { 
    id: '1', 
    name: 'Sample Owner', 
    role: 'owner', 
    img: '', 
    imgLink: '', 
    discordId: '123456789' 
  }
];

// 1. ดึงข้อมูลจาก LocalStorage
function getMembers() {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (!localData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  }
  return JSON.parse(localData);
}

// 2. บันทึกข้อมูล และกระจายสัญญาณ Realtime ไปยังทุกหน้าจอ
function saveMembers(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Broadcast ไปยังหน้าต่าง/แท็บอื่นทันที
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ type: 'SYNC_MEMBERS', data: data });
  channel.close();
}

// 3. ฟังก์ชัน เพิ่มสมาชิก
function addMemberData(memberObj) {
  const members = getMembers();
  members.push({
    id: Date.now().toString(),
    ...memberObj
  });
  saveMembers(members);
}

// 4. ฟังก์ชัน อัปเดตข้อมูลสมาชิก
function updateMemberData(id, key, value) {
  const members = getMembers();
  const target = members.find(m => m.id === id);
  if (target) {
    target[key] = value.trim();
    saveMembers(members);
  }
}

// 5. ฟังก์ชัน ลบสมาชิก
function deleteMemberData(id) {
  let members = getMembers();
  members = members.filter(m => m.id !== id);
  saveMembers(members);
}

// 6. ตัวรับสัญญาณ Realtime จากหน้าจออื่น
const realtimeChannel = new BroadcastChannel(CHANNEL_NAME);
realtimeChannel.onmessage = (event) => {
  if (event.data && event.data.type === 'SYNC_MEMBERS') {
    // เมื่อมีการเปลี่ยนแปลงจากหน้าอื่น ให้สั่ง Render ใหม่ทันที
    if (typeof window.onRealtimeUpdate === 'function') {
      window.onRealtimeUpdate(event.data.data);
    }
  }
};

