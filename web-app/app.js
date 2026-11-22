const STORAGE_KEY = 'awaaz-demo-incidents-v1';
const stationByArea = {
  'North Sector': 'North Response Unit',
  'Central Sector': 'Central Safety Desk',
  'South Sector': 'South Response Unit'
};
const hazardIcon = {
  'Flood': '≈', 'Wildfire': '♨', 'Building fire': '♨',
  'Earthquake': '⌁', 'Extreme rainfall': '☂'
};
let incidents = loadIncidents();
let toastTimer;

function loadIncidents() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents)); } catch { /* The demo still works if storage is disabled. */ }
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function render() {
  const body = document.getElementById('incident-rows');
  const empty = document.getElementById('empty-state');
  body.replaceChildren();
  empty.classList.toggle('hidden', incidents.length > 0);
  document.getElementById('active-count').textContent = incidents.length;
  document.getElementById('nav-count').textContent = incidents.length;
  const acknowledged = incidents.filter(item => item.acknowledged).length;
  document.getElementById('ack-count').innerHTML = `${acknowledged}<span class="metric-unit"> / ${incidents.length}</span>`;

  incidents.slice(0, 6).forEach(item => {
    const row = document.createElement('tr');
    const hazardClass = item.hazard.includes('fire') || item.hazard === 'Wildfire' ? 'hazard-fire'
      : item.hazard === 'Flood' || item.hazard === 'Extreme rainfall' ? 'hazard-flood' : 'hazard-earthquake';
    const severityClass = item.severity.toLowerCase();
    row.innerHTML = `
      <td><span class="hazard-cell"><span class="hazard-icon ${hazardClass}">${hazardIcon[item.hazard] || '!'}</span>${escapeText(item.hazard)}</span></td>
      <td>${escapeText(item.area)}</td>
      <td><span class="severity severity-${severityClass}">${escapeText(item.severity)}</span></td>
      <td><span class="source-sim">SIMULATED</span></td>
      <td>${escapeText(item.station)}</td>
      <td><button class="ack-button" data-ack="${escapeText(item.id)}" ${item.acknowledged ? 'disabled' : ''}>${item.acknowledged ? 'Acknowledged ✓' : 'Mark received'}</button></td>`;
    body.appendChild(row);
  });

  body.querySelectorAll('[data-ack]').forEach(button => button.addEventListener('click', () => acknowledge(button.dataset.ack)));
  updateMapAlert();
}

function updateMapAlert() {
  const active = incidents.find(item => !item.acknowledged);
  const badge = document.getElementById('map-alert');
  badge.classList.toggle('hidden', !active);
  if (active) {
    document.getElementById('map-alert-label').textContent = `${active.hazard.toUpperCase()} · ${active.area.toUpperCase()}`;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

function openModal() {
  document.getElementById('alert-modal').classList.remove('hidden');
  document.getElementById('hazard-type').focus();
}

function closeModal() {
  document.getElementById('alert-modal').classList.add('hidden');
  document.getElementById('new-alert').focus();
}

function createIncident() {
  const hazard = document.getElementById('hazard-type').value;
  const area = document.getElementById('hazard-area').value;
  const severity = document.getElementById('hazard-severity').value;
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    hazard, area, severity, station: stationByArea[area],
    createdAt: new Date().toISOString(), acknowledged: false
  };
  incidents.unshift(item);
  incidents = incidents.slice(0, 12);
  save();
  render();
  closeModal();
  showToast(`Simulated ${hazard.toLowerCase()} alert routed to ${item.station}.`);
  document.getElementById('incidents').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function acknowledge(id) {
  const item = incidents.find(event => event.id === id);
  if (!item) return;
  item.acknowledged = true;
  item.acknowledgedAt = new Date().toISOString();
  save();
  render();
  showToast(`${item.station} marked the simulated alert as received.`);
}

document.getElementById('new-alert').addEventListener('click', openModal);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('submit-alert').addEventListener('click', createIncident);
document.getElementById('alert-modal').addEventListener('click', event => {
  if (event.target.id === 'alert-modal') closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !document.getElementById('alert-modal').classList.contains('hidden')) closeModal();
});
document.getElementById('reset-demo').addEventListener('click', () => {
  incidents = [];
  save();
  render();
  showToast('Demo alerts cleared from this browser.');
});
document.getElementById('vision-info').addEventListener('click', () => {
  showToast('Next: label fire/smoke examples, train a model, and connect inference to this dashboard.');
});

document.getElementById('header-date').textContent = new Date().toLocaleDateString(undefined, {
  weekday: 'long', month: 'long', day: 'numeric'
}).toUpperCase();

render();
