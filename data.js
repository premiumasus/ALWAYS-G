// ==========================================
// DATA STORE & REALTIME ENGINE (data.js)
// ==========================================

const STORAGE_KEY = 'wda_members_data';
const CHANNEL_NAME = 'wda_realtime_channel';

const DEFAULT_MEMBERS = [
  { id: '1', name: 'Sample Owner', role: 'owner', img: '', imgLink: '', discordId: '' }
];

function getMembers() {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (!localData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  }
  return JSON.parse(localData);
}

function saveMembers(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ type: 'SYNC_MEMBERS', data: data });
  channel.close();
}

function addMemberData(memberObj) {
  const members = getMembers();
  members.push({ id: Date.now().toString(), ...memberObj });
  saveMembers(members);
}

function updateMemberData(id, key, value) {
  const members = getMembers();
  const target = members.find(m => m.id === id);
  if (target) {
    target[key] = value.trim();
    saveMembers(members);
  }
}

function deleteMemberData(id) {
  let members = getMembers();
  members = members.filter(m => m.id !== id);
  saveMembers(members);
}

// ฟังสัญญาณ Realtime ข้ามหน้าจอ
const realtimeChannel = new BroadcastChannel(CHANNEL_NAME);
realtimeChannel.onmessage = (event) => {
  if (event.data && event.data.type === 'SYNC_MEMBERS') {
    if (typeof window.onRealtimeUpdate === 'function') {
      window.onRealtimeUpdate(event.data.data);
    }
  }
};
