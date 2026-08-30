// ==========================================
// DATA STORE: เก็บรายชื่อทั้งหมดไว้ตรงนี้
// ==========================================

let membersData = [
  {
    id: '1',
    name: 'Sample Owner',
    role: 'owner',
    img: '',
    imgLink: '',
    discordId: ''
  }
];

// ดึงรายชื่อทั้งหมดออกไปแสดงผล
function getMembersData() {
  return membersData;
}

// เพิ่มรายชื่อใหม่
function addMemberData(newMember) {
  membersData.push({
    id: Date.now().toString(),
    ...newMember
  });
}

// อัปเดตรายชื่อ
function updateMemberData(id, key, value) {
  const target = membersData.find(m => m.id === id);
  if (target) {
    target[key] = value.trim();
  }
}

// ลบรายชื่อ
function deleteMemberData(id) {
  membersData = membersData.filter(m => m.id !== id);
}

