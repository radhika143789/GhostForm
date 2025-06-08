const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const totalDetectionsEl = document.getElementById('totalDetections');
  const maskedItemsEl = document.getElementById('maskedItems');
  const viewDashboardBtn = document.getElementById('viewDashboard');
  const manageProfileBtn = document.getElementById('manageProfile');
  const recentActivityEl = document.getElementById('recentActivity');
  const openSettingsBtn = document.getElementById('openSettings');

  async function fetchStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/exposures/stats`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();

      totalDetectionsEl.textContent = data.totalDetections || '0';
      maskedItemsEl.textContent = data.maskedItems || '0';
      updateRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      totalDetectionsEl.textContent = '0';
      maskedItemsEl.textContent = '0';
      updateRecentActivity([]);
    }
  }

  function updateRecentActivity(activities) {
    recentActivityEl.innerHTML = '';
    if (activities.length === 0) {
      const p = document.createElement('p');
      p.className = 'empty-state';
      p.textContent = 'No recent activity';
      recentActivityEl.appendChild(p);
      return;
    }
    activities.forEach(activity => {
      const div = document.createElement('div');
      div.textContent = activity;
      recentActivityEl.appendChild(div);
    });
  }

  viewDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  });

  manageProfileBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/profile' });
  });

  openSettingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  fetchStats();
});
