const defaultConfig = {
  dashboard_title: "Sports Analytics Dashboard",
  institution_name: "Professional Sports Management System",
  primary_color: "#667eea",
  secondary_color: "#48bb78",
  background_color: "#764ba2",
  text_color: "#2d3748",
  card_color: "#ffffff"
};

let allData = [];
let currentRecordCount = 0;
let analysisData = []; // Mock array to hold analysis results for demonstration
let currentVideoFile = null;

// --- Mock SDK/Data Handlers for Local Use (Replace with actual backend if needed) ---

// Start with empty data - matches and players will be added by users
allData = [];
currentRecordCount = 0;

// This mock function replaces the platform-specific data change listener
function mockDataChange() {
    renderMatches();
    renderPlayers();
    renderDisplay();
    // Note: Analysis results are displayed via showAnalysisResults() when video analysis completes
}

// Initial call to render the mock data on load
document.addEventListener('DOMContentLoaded', function() {
  mockDataChange();
  initializeVideoUpload();
  initializeJerseyColorSync();
  initializeLogoUploads();
  setDefaultDateTime();
  
  // Show home screen by default
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    homeScreen.classList.add('active');
  }
  
  // Hide all tab content initially
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('dropdown-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (dropdown && menuToggle && !dropdown.contains(e.target) && !menuToggle.contains(e.target)) {
      dropdown.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
});

// --- Jersey Color Synchronization Functions ---

function initializeJerseyColorSync() {
  // Color name to hex mapping
  const colorMap = {
    'red': '#ff0000', 'blue': '#0066cc', 'green': '#00cc00', 'yellow': '#ffcc00',
    'orange': '#ff6600', 'purple': '#9900cc', 'pink': '#ff00cc', 'black': '#000000',
    'white': '#ffffff', 'gray': '#808080', 'grey': '#808080', 'brown': '#996633',
    'navy': '#000080', 'maroon': '#800000', 'teal': '#008080', 'cyan': '#00ffff',
    'lime': '#00ff00', 'magenta': '#ff00ff', 'silver': '#c0c0c0', 'gold': '#ffd700',
    'indigo': '#4b0082', 'violet': '#8a2be2', 'crimson': '#dc143c', 'coral': '#ff7f50',
    'turquoise': '#40e0d0', 'olive': '#808000', 'khaki': '#f0e68c', 'salmon': '#fa8072'
  };

  // Function to convert color name to hex
  function colorNameToHex(colorName) {
    if (!colorName) return null;
    const normalized = colorName.toLowerCase().trim();
    return colorMap[normalized] || null;
  }

  // Sync Team A color picker with text input
  const jerseyColorAText = document.getElementById('jersey-color-a-text');
  const jerseyColorAPicker = document.getElementById('jersey-color-a');
  
  if (jerseyColorAText && jerseyColorAPicker) {
    jerseyColorAText.addEventListener('input', function() {
      const colorHex = colorNameToHex(this.value);
      if (colorHex) {
        jerseyColorAPicker.value = colorHex;
        updateTeamAButtonColor(colorHex);
      }
    });

    jerseyColorAPicker.addEventListener('input', function() {
      updateTeamAButtonColor(this.value);
    });
  }

  // Sync Team B color picker with text input
  const jerseyColorBText = document.getElementById('jersey-color-b-text');
  const jerseyColorBPicker = document.getElementById('jersey-color-b');
  
  if (jerseyColorBText && jerseyColorBPicker) {
    jerseyColorBText.addEventListener('input', function() {
      const colorHex = colorNameToHex(this.value);
      if (colorHex) {
        jerseyColorBPicker.value = colorHex;
        updateTeamBButtonColor(colorHex);
      }
    });

    jerseyColorBPicker.addEventListener('input', function() {
      updateTeamBButtonColor(this.value);
    });
  }

  // Initialize button colors on load
  if (jerseyColorAPicker) {
    updateTeamAButtonColor(jerseyColorAPicker.value);
  }
  if (jerseyColorBPicker) {
    updateTeamBButtonColor(jerseyColorBPicker.value);
  }
}

function updateTeamAButtonColor(color) {
  const teamABadge = document.getElementById('team-a-color-badge');
  const teamAButton = document.getElementById('team-a-preview-btn');
  
  if (teamABadge) {
    teamABadge.style.backgroundColor = color;
    const dot = teamABadge.querySelector('.preview-color-dot');
    if (dot) dot.style.backgroundColor = color;
  }
  
  if (teamAButton) {
    teamAButton.style.backgroundColor = color;
    teamAButton.style.borderColor = color;
    const dot = teamAButton.querySelector('.preview-btn-dot');
    if (dot) dot.style.backgroundColor = color;
  }
}

function updateTeamBButtonColor(color) {
    const teamBBadge = document.getElementById('team-b-color-badge');
    const teamBButton = document.getElementById('team-b-preview-btn');
    
    if (teamBBadge) {
        teamBBadge.style.backgroundColor = color;
        const dot = teamBBadge.querySelector('.preview-color-dot');
        if (dot) dot.style.backgroundColor = color;
    }
    
    if (teamBButton) {
        teamBButton.style.backgroundColor = color;
        teamBButton.style.borderColor = color;
        const dot = teamBButton.querySelector('.preview-btn-dot');
        if (dot) dot.style.backgroundColor = color;
    }
}

function initializeLogoUploads() {
    const logoA = document.getElementById('team-a-logo');
    const logoB = document.getElementById('team-b-logo');
    const previewA = document.getElementById('team-a-logo-preview');
    const previewB = document.getElementById('team-b-logo-preview');

    if (logoA && previewA) {
        logoA.addEventListener('change', function(e) {
            handleLogoUpload(e.target.files[0], previewA);
        });
    }

    if (logoB && previewB) {
        logoB.addEventListener('change', function(e) {
            handleLogoUpload(e.target.files[0], previewB);
        });
    }
}

function handleLogoUpload(file, previewContainer) {
    if (!file || !previewContainer) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file.', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        previewContainer.innerHTML = `
            <img src="${e.target.result}" alt="Team Logo" style="max-width: 100px; max-height: 100px; border-radius: 8px; margin-top: 8px; border: 2px solid #e2e8f0;">
            <button type="button" onclick="this.parentElement.innerHTML=''; this.parentElement.previousElementSibling.value='';" style="margin-left: 8px; padding: 4px 8px; background: #f56565; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
        `;
    };
    reader.readAsDataURL(file);
}

function setDefaultDateTime() {
    const dateInput = document.getElementById('match-date');
    if (dateInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

// --- Core Rendering Functions ---

function renderMatches() {
  const container = document.getElementById('matches-container');
  const matches = allData.filter(item => item.type === 'match');

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3>No matches yet</h3>
        <p>Add your first match to get started</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map(match => {
    const jerseyColorA = match.jersey_color_a || '#0066cc';
    const jerseyColorB = match.jersey_color_b || '#cc0000';
    const jerseyColorAText = match.jersey_color_a_text || 'Blue';
    const jerseyColorBText = match.jersey_color_b_text || 'Red';
    
    // Format date if available
    let formattedDate = '';
    if (match.match_date) {
      try {
        const date = new Date(match.match_date);
        formattedDate = date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        formattedDate = match.match_date;
      }
    }
    
    // Build match details HTML
    const matchDetails = [];
    if (match.match_type) matchDetails.push(`<span class="match-detail-item">📋 ${match.match_type}</span>`);
    if (formattedDate) matchDetails.push(`<span class="match-detail-item">📅 ${formattedDate}</span>`);
    if (match.venue) matchDetails.push(`<span class="match-detail-item">🏟️ ${match.venue}</span>`);
    if (match.referee) matchDetails.push(`<span class="match-detail-item">👨‍⚖️ ${match.referee}</span>`);
    if (match.tournament) matchDetails.push(`<span class="match-detail-item">🏆 ${match.tournament}</span>`);
    if (match.weather) matchDetails.push(`<span class="match-detail-item">${match.weather}</span>`);
    if (match.attendance) matchDetails.push(`<span class="match-detail-item">👥 ${match.attendance.toLocaleString()} attendees</span>`);
    if (match.match_duration) matchDetails.push(`<span class="match-detail-item">⏱️ ${match.match_duration} min</span>`);
    
    // Team logos
    const logoA = match.team_a_logo ? `<img src="${match.team_a_logo}" alt="${match.team_a}" class="team-logo">` : '';
    const logoB = match.team_b_logo ? `<img src="${match.team_b_logo}" alt="${match.team_b}" class="team-logo">` : '';
    
    // Captains
    const captainA = match.team_a_captain ? `<div class="captain-info">👤 Captain: ${match.team_a_captain}</div>` : '';
    const captainB = match.team_b_captain ? `<div class="captain-info">👤 Captain: ${match.team_b_captain}</div>` : '';
    
    // Player counts
    const playersA = match.team_a_players && Array.isArray(match.team_a_players) ? match.team_a_players.length : 0;
    const playersB = match.team_b_players && Array.isArray(match.team_b_players) ? match.team_b_players.length : 0;
    
    // Get scores for comparison
    const scoreA = match.score_a || 0;
    const scoreB = match.score_b || 0;
    
    // Determine leading team - only show animation for Live matches
    const showAnimation = match.status === 'Live';
    const isTeamALeading = scoreA > scoreB;
    const isTeamBLeading = scoreB > scoreA;
    
    // Leading team animation - Team A leading: arrows on LEFT of Team A logo
    const leadingAnimationA = (showAnimation && isTeamALeading) ? `
      <div class="leading-indicator leading-left">
        <div class="arrow-up">↑</div>
        <div class="arrow-up" style="animation-delay: 0.2s;">↑</div>
        <div class="arrow-up" style="animation-delay: 0.4s;">↑</div>
      </div>
    ` : '';
    
    // Leading team animation - Team B leading: arrows on RIGHT of Team B logo
    const leadingAnimationB = (showAnimation && isTeamBLeading) ? `
      <div class="leading-indicator leading-right">
        <div class="arrow-up">↑</div>
        <div class="arrow-up" style="animation-delay: 0.2s;">↑</div>
        <div class="arrow-up" style="animation-delay: 0.4s;">↑</div>
      </div>
    ` : '';
    
    return `
    <div class="match-card">
      <div class="match-header">
        <div class="match-title-row">
          <span>${match.match_name}</span>
          ${match.match_visibility === 'private' ? '<span class="visibility-badge">🔒 Private</span>' : ''}
        </div>
        ${matchDetails.length > 0 ? `<div class="match-details">${matchDetails.join('')}</div>` : ''}
      </div>
      <div class="match-teams">
        <div class="team team-left">
          <div class="team-info">
            <div class="logo-arrow-container" style="display: flex; align-items: center; gap: 12px; position: relative;">
              ${leadingAnimationA}
              ${logoA}
            </div>
            <div class="team-name">
              <div class="jersey-badge" style="background-color: ${jerseyColorA};">
                <span class="jersey-color-dot" style="background-color: ${jerseyColorA};"></span>
                <span class="jersey-label">Team A</span>
              </div>
              <div class="team-name-text">${match.team_a}</div>
              <div class="jersey-color-text">(${jerseyColorAText})</div>
            </div>
            ${captainA}
            ${playersA > 0 ? `<div class="player-count">👥 ${playersA} players</div>` : ''}
            <div class="team-score">${match.score_a}</div>
          </div>
        </div>
        <div class="vs-divider">VS</div>
        <div class="team team-right">
          <div class="team-info">
            <div class="logo-arrow-container" style="display: flex; align-items: center; gap: 12px; position: relative;">
              ${logoB}
              ${leadingAnimationB}
            </div>
            <div class="team-name">
              <div class="jersey-badge" style="background-color: ${jerseyColorB};">
                <span class="jersey-color-dot" style="background-color: ${jerseyColorB};"></span>
                <span class="jersey-label">Team B</span>
              </div>
              <div class="team-name-text">${match.team_b}</div>
              <div class="jersey-color-text">(${jerseyColorBText})</div>
            </div>
            ${captainB}
            ${playersB > 0 ? `<div class="player-count">👥 ${playersB} players</div>` : ''}
            <div class="team-score">${match.score_b}</div>
          </div>
        </div>
      </div>
      <span class="match-status">${match.status}</span>
      ${match.ai_analysis_enabled ? '<span class="ai-badge">🤖 AI Analysis Enabled</span>' : ''}
      <div class="match-actions">
        <button class="btn btn-secondary team-btn" style="background-color: ${jerseyColorA}; border-color: ${jerseyColorA};" onclick="updateScore('${match.id}', 'a')">
          <span class="btn-jersey-indicator" style="background-color: ${jerseyColorA};"></span>
          +1 ${match.team_a}
        </button>
        <button class="btn btn-secondary team-btn" style="background-color: ${jerseyColorB}; border-color: ${jerseyColorB};" onclick="updateScore('${match.id}', 'b')">
          <span class="btn-jersey-indicator" style="background-color: ${jerseyColorB};"></span>
          +1 ${match.team_b}
        </button>
        <button class="btn btn-danger" onclick="deleteMatch('${match.id}')">Delete</button>
      </div>
    </div>
    `;
  }).join('');
}

function renderPlayers() {
  const container = document.getElementById('players-container');
  const players = allData.filter(item => item.type === 'player');

  if (players.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <h3>No player stats yet</h3>
        <p>Add player analytics to track performance</p>
      </div>
    `;
    return;
  }

  container.innerHTML = players.map(player => `
    <div class="player-card">
      <div class="player-header">
        <div class="player-info">
          <h3>${player.player_name}</h3>
          <div class="player-team">${player.team}</div>
        </div>
        <button class="delete-btn" onclick="deletePlayer('${player.id}')" title="Delete player">×</button>
      </div>
      <div class="stat-row">
        <span class="stat-label">⚡ Average Speed</span>
        <span class="stat-value">${player.speed} km/h</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🏃 Distance Covered</span>
        <span class="stat-value">${player.distance} km</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🎯 Pass Accuracy</span>
        <span class="stat-value">${player.pass_accuracy}%</span>
      </div>
      ${player.notes ? `<div class="notes"><strong>Notes:</strong> ${player.notes}</div>` : ''}
    </div>
  `).join('');
}

function renderDisplay() {
  const container = document.getElementById('display-container');
  const matches = allData.filter(item => item.type === 'match');

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3 style="color: white;">No live matches</h3>
        <p style="color: rgba(255,255,255,0.7);">Matches will appear here when added</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map(match => {
    const jerseyColorA = match.jersey_color_a || '#0066cc';
    const jerseyColorB = match.jersey_color_b || '#cc0000';
    const jerseyColorAText = match.jersey_color_a_text || 'Blue';
    const jerseyColorBText = match.jersey_color_b_text || 'Red';
    
    // Get scores for comparison
    const scoreA = match.score_a || 0;
    const scoreB = match.score_b || 0;
    
    // Determine leading team - only show animation for Live matches
    const showAnimation = match.status === 'Live';
    const isTeamALeading = scoreA > scoreB;
    const isTeamBLeading = scoreB > scoreA;
    
    // Leading team animation - Team A leading: arrows on LEFT of Team A logo
    const leadingAnimationA = (showAnimation && isTeamALeading) ? `
      <div class="leading-indicator leading-left">
        <div class="arrow-up">↑</div>
        <div class="arrow-up" style="animation-delay: 0.2s;">↑</div>
        <div class="arrow-up" style="animation-delay: 0.4s;">↑</div>
      </div>
    ` : '';
    
    // Leading team animation - Team B leading: arrows on RIGHT of Team B logo
    const leadingAnimationB = (showAnimation && isTeamBLeading) ? `
      <div class="leading-indicator leading-right">
        <div class="arrow-up">↑</div>
        <div class="arrow-up" style="animation-delay: 0.2s;">↑</div>
        <div class="arrow-up" style="animation-delay: 0.4s;">↑</div>
      </div>
    ` : '';
    
    // Team logos for display view
    const logoA = match.team_a_logo ? `<img src="${match.team_a_logo}" alt="${match.team_a}" class="team-logo">` : '';
    const logoB = match.team_b_logo ? `<img src="${match.team_b_logo}" alt="${match.team_b}" class="team-logo">` : '';
    
    // Captains for display view
    const captainA = match.team_a_captain ? `<div class="captain-info">👤 Captain: ${match.team_a_captain}</div>` : '';
    const captainB = match.team_b_captain ? `<div class="captain-info">👤 Captain: ${match.team_b_captain}</div>` : '';
    
    // Player counts for display view
    const playersA = match.team_a_players && Array.isArray(match.team_a_players) ? match.team_a_players.length : 0;
    const playersB = match.team_b_players && Array.isArray(match.team_b_players) ? match.team_b_players.length : 0;
    
    return `
    <div class="match-card">
      <div class="match-header">${match.match_name}</div>
      <div class="match-teams">
        <div class="team team-left">
          <div class="team-info">
            <div class="logo-arrow-container" style="display: flex; align-items: center; gap: 12px; position: relative;">
              ${leadingAnimationA}
              ${logoA}
            </div>
            <div class="team-name">
              <div class="jersey-badge" style="background-color: ${jerseyColorA};">
                <span class="jersey-color-dot" style="background-color: ${jerseyColorA};"></span>
                <span class="jersey-label">Team A</span>
              </div>
              <div class="team-name-text">${match.team_a}</div>
              <div class="jersey-color-text">(${jerseyColorAText})</div>
            </div>
            ${captainA}
            ${playersA > 0 ? `<div class="player-count">👥 ${playersA} players</div>` : ''}
            <div class="team-score">${match.score_a}</div>
          </div>
        </div>
        <div class="vs-divider">VS</div>
        <div class="team team-right">
          <div class="team-info">
            <div class="logo-arrow-container" style="display: flex; align-items: center; gap: 12px; position: relative;">
              ${logoB}
              ${leadingAnimationB}
            </div>
            <div class="team-name">
              <div class="jersey-badge" style="background-color: ${jerseyColorB};">
                <span class="jersey-color-dot" style="background-color: ${jerseyColorB};"></span>
                <span class="jersey-label">Team B</span>
              </div>
              <div class="team-name-text">${match.team_b}</div>
              <div class="jersey-color-text">(${jerseyColorBText})</div>
            </div>
            ${captainB}
            ${playersB > 0 ? `<div class="player-count">👥 ${playersB} players</div>` : ''}
            <div class="team-score">${match.score_b}</div>
          </div>
        </div>
      </div>
      <span class="match-status">${match.status}</span>
    </div>
    `;
  }).join('');
}

// --- Form Submission and Data Manipulation (Mocked for local use) ---

async function handleMatchSubmit(event) {
  event.preventDefault();
  
  try {
    const submitBtn = document.getElementById('match-submit-btn');
    if (!submitBtn) {
      showToast('Error: Submit button not found.', true);
      return;
    }

    // Get form values - Match Details
    const matchName = document.getElementById('match-name')?.value?.trim();
    const matchType = document.getElementById('match-type')?.value || '';
    const matchDate = document.getElementById('match-date')?.value || '';
    const venue = document.getElementById('venue')?.value?.trim() || '';
    const referee = document.getElementById('referee')?.value?.trim() || '';
    const tournament = document.getElementById('tournament')?.value?.trim() || '';

    // Team Configuration
    const teamA = document.getElementById('team-a')?.value?.trim();
    const teamB = document.getElementById('team-b')?.value?.trim();
    const teamACaptain = document.getElementById('team-a-captain')?.value?.trim() || '';
    const teamBCaptain = document.getElementById('team-b-captain')?.value?.trim() || '';
    const teamAPlayers = document.getElementById('team-a-players')?.value?.trim() || '';
    const teamBPlayers = document.getElementById('team-b-players')?.value?.trim() || '';
    
    // Logo handling
    const logoAFile = document.getElementById('team-a-logo')?.files[0];
    const logoBFile = document.getElementById('team-b-logo')?.files[0];
    let logoA = null;
    let logoB = null;
    
    if (logoAFile) {
        const reader = new FileReader();
        reader.readAsDataURL(logoAFile);
        logoA = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
        });
    }
    
    if (logoBFile) {
        const reader = new FileReader();
        reader.readAsDataURL(logoBFile);
        logoB = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
        });
    }

    // Jersey Colors
    const jerseyColorA = document.getElementById('jersey-color-a')?.value || '#0066cc';
    const jerseyColorB = document.getElementById('jersey-color-b')?.value || '#cc0000';
    const jerseyColorAText = document.getElementById('jersey-color-a-text')?.value?.trim() || 'Blue';
    const jerseyColorBText = document.getElementById('jersey-color-b-text')?.value?.trim() || 'Red';

    // Scores & Status
    const scoreA = parseInt(document.getElementById('score-a')?.value || 0);
    const scoreB = parseInt(document.getElementById('score-b')?.value || 0);
    const status = document.getElementById('match-status')?.value;
    const matchDuration = parseInt(document.getElementById('match-duration')?.value || 90);

    // Customization
    const fontStyle = document.getElementById('font-style')?.value || 'default';
    const themeColor = document.getElementById('theme-color')?.value || '#667eea';
    const buttonShape = document.getElementById('button-shape')?.value || 'rounded';

    // Analytics
    const weather = document.getElementById('weather')?.value || '';
    const attendance = parseInt(document.getElementById('attendance')?.value || 0);
    const aiAnalysisEnabled = document.getElementById('ai-analysis-toggle')?.checked || false;

    // Control & Management
    const autosaveInterval = parseInt(document.getElementById('autosave-interval')?.value || 5);
    const matchVisibility = document.getElementById('match-visibility')?.value || 'public';
    const notificationsEnabled = document.getElementById('notifications-toggle')?.checked || false;

    // Validate inputs
    if (!matchName || matchName.length < 2) {
      showToast('Please enter a valid match name (at least 2 characters).', true);
      return;
    }

    if (!teamA || teamA.length < 2) {
      showToast('Please enter a valid Team A name (at least 2 characters).', true);
      return;
    }

    if (!teamB || teamB.length < 2) {
      showToast('Please enter a valid Team B name (at least 2 characters).', true);
      return;
    }

    if (teamA.toLowerCase() === teamB.toLowerCase()) {
      showToast('Team A and Team B cannot have the same name.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div>';

    const matchData = {
      id: 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: 'match',
      match_name: matchName,
      match_type: matchType,
      match_date: matchDate,
      venue: venue,
      referee: referee,
      tournament: tournament,
      team_a: teamA,
      team_b: teamB,
      team_a_captain: teamACaptain,
      team_b_captain: teamBCaptain,
      team_a_players: teamAPlayers.split(',').map(p => p.trim()).filter(p => p),
      team_b_players: teamBPlayers.split(',').map(p => p.trim()).filter(p => p),
      team_a_logo: logoA,
      team_b_logo: logoB,
      score_a: scoreA,
      score_b: scoreB,
      status: status,
      match_duration: matchDuration,
      jersey_color_a: jerseyColorA,
      jersey_color_b: jerseyColorB,
      jersey_color_a_text: jerseyColorAText,
      jersey_color_b_text: jerseyColorBText,
      font_style: fontStyle,
      theme_color: themeColor,
      button_shape: buttonShape,
      weather: weather,
      attendance: attendance,
      ai_analysis_enabled: aiAnalysisEnabled,
      autosave_interval: autosaveInterval,
      match_visibility: matchVisibility,
      notifications_enabled: notificationsEnabled,
      timestamp: new Date().toISOString()
    };

    // Add match data
    allData.push(matchData);
    currentRecordCount = allData.length;
    mockDataChange();

    document.getElementById('match-form').reset();
    
    // Reset jersey colors to defaults
    const colorPickerA = document.getElementById('jersey-color-a');
    const colorPickerB = document.getElementById('jersey-color-b');
    if (colorPickerA) {
      colorPickerA.value = '#0066cc';
      updateTeamAButtonColor('#0066cc');
    }
    if (colorPickerB) {
      colorPickerB.value = '#cc0000';
      updateTeamBButtonColor('#cc0000');
    }
    
    // Clear text inputs
    const colorTextA = document.getElementById('jersey-color-a-text');
    const colorTextB = document.getElementById('jersey-color-b-text');
    if (colorTextA) colorTextA.value = '';
    if (colorTextB) colorTextB.value = '';
    
    // Clear logo previews
    const logoPreviewA = document.getElementById('team-a-logo-preview');
    const logoPreviewB = document.getElementById('team-b-logo-preview');
    if (logoPreviewA) logoPreviewA.innerHTML = '';
    if (logoPreviewB) logoPreviewB.innerHTML = '';
    
    // Reset datetime to current
    setDefaultDateTime();
    
    showToast('Match added successfully!');
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Match';
    
  } catch (error) {
    console.error('Error submitting match:', error);
    showToast('Error adding match. Please try again.', true);
    const submitBtn = document.getElementById('match-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Match';
    }
  }
}

async function handlePlayerSubmit(event) {
  event.preventDefault();
  
  try {
    const submitBtn = document.getElementById('player-submit-btn');
    if (!submitBtn) {
      showToast('Error: Submit button not found.', true);
      return;
    }

    // Get form values with validation
    const playerName = document.getElementById('player-name')?.value?.trim();
    const playerTeam = document.getElementById('player-team')?.value?.trim();
    const playerSpeed = document.getElementById('player-speed')?.value;
    const playerDistance = document.getElementById('player-distance')?.value;
    const playerAccuracy = document.getElementById('player-accuracy')?.value;
    const playerNotes = document.getElementById('player-notes')?.value?.trim() || '';

    // Validate inputs
    if (!playerName || playerName.length < 2) {
      showToast('Please enter a valid player name (at least 2 characters).', true);
      return;
    }

    if (!playerTeam || playerTeam.length < 2) {
      showToast('Please enter a valid team name (at least 2 characters).', true);
      return;
    }

    const speed = parseFloat(playerSpeed);
    if (isNaN(speed) || speed < 0 || speed > 50) {
      showToast('Please enter a valid speed (0-50 km/h).', true);
      return;
    }

    const distance = parseFloat(playerDistance);
    if (isNaN(distance) || distance < 0 || distance > 20) {
      showToast('Please enter a valid distance (0-20 km).', true);
      return;
    }

    const accuracy = parseInt(playerAccuracy);
    if (isNaN(accuracy) || accuracy < 0 || accuracy > 100) {
      showToast('Please enter a valid pass accuracy (0-100%).', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div>';

    const playerData = {
      id: 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: 'player',
      player_name: playerName,
      team: playerTeam,
      speed: parseFloat(speed.toFixed(1)),
      distance: parseFloat(distance.toFixed(1)),
      pass_accuracy: accuracy,
      notes: playerNotes,
      timestamp: new Date().toISOString()
    };

    // Check for duplicate player names (optional - can be removed if duplicates are allowed)
    const duplicateCheck = allData.find(p => 
      p.type === 'player' && 
      p.player_name.toLowerCase() === playerData.player_name.toLowerCase() &&
      p.team.toLowerCase() === playerData.team.toLowerCase()
    );
    
    if (duplicateCheck) {
      showToast('A player with this name already exists for this team.', true);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Player Stats';
      return;
    }

    // Add player data
    allData.push(playerData);
    currentRecordCount = allData.length;
    mockDataChange();

    document.getElementById('player-form').reset();
    showToast('Player stats added successfully!');

    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Player Stats';
    
  } catch (error) {
    console.error('Error submitting player data:', error);
    showToast('Error adding player stats. Please try again.', true);
    const submitBtn = document.getElementById('player-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Player Stats';
    }
  }
}

async function updateScore(matchId, team) {
  const matchIndex = allData.findIndex(item => item.id === matchId);
  if (matchIndex === -1) return;

  const match = allData[matchIndex];
  
  if (team === 'a') {
    match.score_a = match.score_a + 1;
  } else {
    match.score_b = match.score_b + 1;
  }

  // MOCK: No need to call SDK update, just re-render
  mockDataChange();
  showToast('Score updated!');
}

async function deleteMatch(matchId) {
  const initialLength = allData.length;
  allData = allData.filter(item => item.id !== matchId);
  
  if (allData.length < initialLength) {
    currentRecordCount = allData.length;
    mockDataChange();
    showToast('Match deleted successfully!');
  } else {
    showToast('Failed to delete match.', true);
  }
}

async function deletePlayer(playerId) {
  const initialLength = allData.length;
  allData = allData.filter(item => item.id !== playerId);
  
  if (allData.length < initialLength) {
    currentRecordCount = allData.length;
    mockDataChange();
    showToast('Player stats deleted successfully!');
  } else {
    showToast('Failed to delete player stats.', true);
  }
}

// --- Tab Switching and UI Functions ---

function switchTab(tabName) {
  // Hide home screen
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    homeScreen.classList.remove('active');
  }
  
  // Update panel buttons
  document.querySelectorAll('.panel-btn').forEach(btn => btn.classList.remove('active'));
  const activePanelBtn = document.querySelector(`.panel-btn[onclick*="switchTab('${tabName}')"]`);
  if (activePanelBtn) {
    activePanelBtn.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

function showHome() {
  // Hide all tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Hide panel buttons active state
  document.querySelectorAll('.panel-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show home screen
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    homeScreen.classList.add('active');
  }
}

function showAbout() {
  const aboutModal = document.getElementById('about-modal');
  if (aboutModal) {
    aboutModal.classList.add('active');
  }
}

function closeAboutModal() {
  const aboutModal = document.getElementById('about-modal');
  if (aboutModal) {
    aboutModal.classList.remove('active');
  }
}

function toggleMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  if (menuToggle && dropdownMenu) {
    menuToggle.classList.toggle('active');
    dropdownMenu.classList.toggle('active');
  }
}

function showUserProfile() {
  showToast('User Profile feature coming soon!');
  toggleMenu();
}

function showMoreSettings() {
  showToast('Settings feature coming soon!');
  toggleMenu();
}

function toggleTheme() {
  // Toggle between dark and light theme
  const body = document.body;
  const isDark = body.classList.contains('dark-theme');
  
  if (isDark) {
    body.classList.remove('dark-theme');
    showToast('Switched to Light Theme');
  } else {
    body.classList.add('dark-theme');
    showToast('Switched to Dark Theme');
  }
  toggleMenu();
}

function showToast(message, isError = false) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- AI Video Analysis Functions (Enhanced with realistic analytics) ---

function initializeVideoUpload() {
    const uploadArea = document.getElementById('upload-area');
    const videoFileInput = document.getElementById('video-file');
    
    if (!uploadArea || !videoFileInput) {
        console.error('Video upload elements not found');
        return;
    }

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('video/')) {
                processVideoFile(file);
            } else {
                showToast('Please upload a valid video file (MP4, AVI, MOV).', true);
            }
        }
    });
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        showToast('No file selected.', true);
        return;
    }
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!file.type.startsWith('video/') && !validTypes.some(type => file.type.includes(type))) {
        showToast('Please upload a valid video file (MP4, AVI, MOV, WEBM).', true);
        return;
    }
    
    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
        showToast('File size exceeds 500MB limit. Please upload a smaller file.', true);
        return;
    }
    
    processVideoFile(file);
}

function processVideoFile(file) {
    try {
        currentVideoFile = file;

        const videoPreview = document.getElementById('video-preview');
        const videoElement = document.getElementById('uploaded-video');
        const videoName = document.getElementById('video-name');
        const videoDetails = document.getElementById('video-details');
        const uploadArea = document.getElementById('upload-area');
        const resultsContainer = document.getElementById('analysis-results');

        if (!videoPreview || !videoElement || !videoName || !videoDetails || !uploadArea) {
            showToast('Error: Video upload elements not found.', true);
            console.error('Missing video elements:', { videoPreview, videoElement, videoName, videoDetails, uploadArea });
            return;
        }

        // Hide previous results if any
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }

        // Create object URL for video preview
        const videoURL = URL.createObjectURL(file);
        videoElement.src = videoURL;
        videoName.textContent = file.name;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        videoDetails.textContent = `Type: ${file.type || 'video/mp4'}, Size: ${fileSizeMB} MB`;

        uploadArea.style.display = 'none';
        videoPreview.style.display = 'block';

        // Wait for video metadata to load, then start analysis
        videoElement.addEventListener('loadedmetadata', function() {
            startMockAnalysis(file);
        }, { once: true });

        // Fallback if metadata doesn't load
        setTimeout(() => {
            if (!videoElement.videoWidth) {
                startMockAnalysis(file);
            }
        }, 1000);

    } catch (error) {
        console.error('Error processing video file:', error);
        showToast('Error processing video file. Please try again.', true);
    }
}

function startMockAnalysis(file) {
    const progressContainer = document.getElementById('analysis-progress');
    const resultsContainer = document.getElementById('analysis-results');
    const progressFill = document.getElementById('progress-fill');
    
    if (!progressContainer || !resultsContainer || !progressFill) {
        showToast('Error: Analysis UI elements not found.', true);
        return;
    }
    
    // Reset and display progress
    resultsContainer.style.display = 'none';
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    const step1 = document.getElementById('step-1');
    if (step1) step1.classList.add('active');
    
    // Calculate estimated duration based on file size (larger files = longer analysis)
    const fileSizeMB = file.size / (1024 * 1024);
    const baseDelay = 1200; // Base delay in ms
    const sizeMultiplier = Math.min(fileSizeMB / 100, 2); // Scale up to 2x for large files
    const stepDelay = Math.round(baseDelay * (1 + sizeMultiplier));
    
    // Store file info for analysis
    window.currentAnalysisFile = {
        size: fileSizeMB,
        name: file.name,
        type: file.type
    };
    
    // Mock steps with variable delays based on file size
    let step = 1;
    const interval = setInterval(() => {
        step++;
        const progressPercent = Math.min((step - 1) * 20, 100);
        progressFill.style.width = `${progressPercent}%`;
        
        const currentStepElement = document.getElementById(`step-${step}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        if (step > 5) {
            clearInterval(interval);
            progressFill.style.width = '100%';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                showAnalysisResults(file);
            }, 500);
        }
    }, stepDelay);
}

function showAnalysisResults(file) {
    try {
        // Generate realistic analysis data based on video properties
        const fileInfo = window.currentAnalysisFile || { size: 50, name: 'video.mp4', type: 'video/mp4' };
        
        // Estimate number of players detected (based on file size and realistic range)
        const estimatedPlayers = Math.max(4, Math.min(22, Math.floor(8 + (fileInfo.size / 10))));
        
        // Generate realistic player data with proper correlations
        analysisData = generateRealisticPlayerData(estimatedPlayers);
        
        const resultsContainer = document.getElementById('analysis-results');
        const playerSelect = document.getElementById('player-select');
        
        if (!resultsContainer || !playerSelect) {
            showToast('Error: Results container not found.', true);
            return;
        }
        
        // Populate player selector
        playerSelect.innerHTML = '<option value="">Choose a player...</option>';
        analysisData.forEach((player, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${player.name} - ${player.team}`;
            playerSelect.appendChild(option);
        });

        // Calculate accurate summary metrics
        const totalPlayers = analysisData.length;
        const totalAccuracy = analysisData.reduce((sum, p) => sum + p.passAccuracy, 0);
        const avgAccuracy = totalPlayers > 0 ? Math.round(totalAccuracy / totalPlayers) : 0;
        
        // Calculate average distance
        const totalDistance = analysisData.reduce((sum, p) => sum + p.totalDistance, 0);
        const avgDistance = totalPlayers > 0 ? (totalDistance / totalPlayers).toFixed(1) : 0;
        
        // Estimate analysis duration based on file size
        const estimatedDuration = Math.max(2.5, Math.min(8.0, (fileInfo.size / 15).toFixed(1)));

        // Update summary cards
        const playersDetectedEl = document.getElementById('players-detected');
        const analysisDurationEl = document.getElementById('analysis-duration');
        const accuracyAvgEl = document.getElementById('accuracy-avg');
        
        if (playersDetectedEl) playersDetectedEl.textContent = `${totalPlayers} Players Detected`;
        if (analysisDurationEl) analysisDurationEl.textContent = `${estimatedDuration} min`;
        if (accuracyAvgEl) accuracyAvgEl.textContent = `${avgAccuracy}%`;

        resultsContainer.style.display = 'block';
        
        // Show the first player's data by default
        if (analysisData.length > 0) {
            playerSelect.value = '0';
            showPlayerAnalysis();
        }
        
    } catch (error) {
        console.error('Error showing analysis results:', error);
        showToast('Error displaying analysis results. Please try again.', true);
    }
}

function generateRealisticPlayerData(playerCount) {
    const teams = ['Blue Team', 'Red Team', 'Green Team', 'Yellow Team'];
    const positions = ['GK', 'DF', 'MF', 'FW'];
    const playerData = [];
    
    // Distribute players across teams
    const playersPerTeam = Math.ceil(playerCount / teams.length);
    
    teams.forEach((team, teamIndex) => {
        const teamPlayerCount = Math.min(playersPerTeam, playerCount - (teamIndex * playersPerTeam));
        
        for (let i = 0; i < teamPlayerCount; i++) {
            const playerNumber = (teamIndex * playersPerTeam) + i + 1;
            const position = positions[Math.floor(Math.random() * positions.length)];
            
            // Generate realistic stats based on position
            const stats = generatePositionBasedStats(position);
            
            playerData.push({
                name: `Player ${String.fromCharCode(65 + teamIndex)} (${position}-${playerNumber})`,
                team: team,
                position: position,
                maxSpeed: stats.maxSpeed,
                totalDistance: stats.totalDistance,
                passAccuracy: stats.passAccuracy,
                avgSpeed: stats.avgSpeed,
                sprintCount: stats.sprintCount,
                touches: stats.touches,
                heatmap: generateRealisticHeatmapData(position),
                insights: generateRealisticInsights(stats, position)
            });
        }
    });
    
    return playerData;
}

function generatePositionBasedStats(position) {
    // Realistic stat ranges based on position
    const positionRanges = {
        'GK': {
            maxSpeed: [18, 25],
            avgSpeed: [8, 12],
            distance: [3, 5],
            passAccuracy: [65, 85],
            sprintCount: [5, 15],
            touches: [20, 40]
        },
        'DF': {
            maxSpeed: [25, 32],
            avgSpeed: [15, 20],
            distance: [8, 11],
            passAccuracy: [75, 90],
            sprintCount: [20, 35],
            touches: [40, 70]
        },
        'MF': {
            maxSpeed: [28, 35],
            avgSpeed: [18, 24],
            distance: [9, 12],
            passAccuracy: [80, 95],
            sprintCount: [25, 40],
            touches: [50, 90]
        },
        'FW': {
            maxSpeed: [30, 38],
            avgSpeed: [20, 26],
            distance: [7, 10],
            passAccuracy: [70, 88],
            sprintCount: [30, 50],
            touches: [30, 60]
        }
    };
    
    const ranges = positionRanges[position] || positionRanges['MF'];
    
    const maxSpeed = parseFloat((Math.random() * (ranges.maxSpeed[1] - ranges.maxSpeed[0]) + ranges.maxSpeed[0]).toFixed(1));
    const avgSpeed = parseFloat((Math.random() * (ranges.avgSpeed[1] - ranges.avgSpeed[0]) + ranges.avgSpeed[0]).toFixed(1));
    const totalDistance = parseFloat((Math.random() * (ranges.distance[1] - ranges.distance[0]) + ranges.distance[0]).toFixed(1));
    const passAccuracy = Math.round(Math.random() * (ranges.passAccuracy[1] - ranges.passAccuracy[0]) + ranges.passAccuracy[0]);
    const sprintCount = Math.round(Math.random() * (ranges.sprintCount[1] - ranges.sprintCount[0]) + ranges.sprintCount[0]);
    const touches = Math.round(Math.random() * (ranges.touches[1] - ranges.touches[0]) + ranges.touches[0]);
    
    return {
        maxSpeed,
        avgSpeed,
        totalDistance,
        passAccuracy,
        sprintCount,
        touches
    };
}

function generateRealisticInsights(stats, position) {
    const insights = [];
    
    // Speed insights
    if (stats.maxSpeed > 32) {
        insights.push('Exceptional top speed - one of the fastest players on the field.');
    } else if (stats.maxSpeed < 22) {
        insights.push('Consider speed training to improve acceleration and top speed.');
    }
    
    // Distance insights
    if (stats.totalDistance > 11) {
        insights.push('Outstanding work rate with excellent field coverage.');
    } else if (stats.totalDistance < 6 && position !== 'GK') {
        insights.push('Low distance covered - increase movement and positioning.');
    }
    
    // Pass accuracy insights
    if (stats.passAccuracy > 90) {
        insights.push('Excellent passing accuracy - key playmaker in the team.');
    } else if (stats.passAccuracy < 75) {
        insights.push('Pass accuracy needs improvement - focus on technique and decision-making.');
    }
    
    // Position-specific insights
    if (position === 'GK' && stats.touches < 25) {
        insights.push('Goalkeeper distribution could be more involved in build-up play.');
    }
    if (position === 'FW' && stats.sprintCount > 40) {
        insights.push('High sprint frequency - excellent attacking runs and pressing.');
    }
    if (position === 'MF' && stats.passAccuracy > 88) {
        insights.push('Strong midfield presence with accurate distribution.');
    }
    
    // Overall performance
    const performanceScore = (stats.passAccuracy * 0.4) + ((stats.maxSpeed / 35) * 30) + ((stats.totalDistance / 12) * 30);
    if (performanceScore > 80) {
        insights.push('Overall excellent performance - maintain consistency.');
    } else if (performanceScore < 60) {
        insights.push('Focus on improving overall fitness and technical skills.');
    }
    
    return insights.length > 0 ? insights : ['Solid performance with room for improvement in specific areas.'];
}

function showPlayerAnalysis() {
    try {
        const playerSelect = document.getElementById('player-select');
        const selectedAnalysisDiv = document.getElementById('selected-player-analysis');
        
        if (!playerSelect || !selectedAnalysisDiv) {
            console.error('Player analysis elements not found');
            return;
        }
        
        const selectedIndex = playerSelect.value;

        if (selectedIndex === "" || selectedIndex === null) {
            selectedAnalysisDiv.style.display = 'none';
            return;
        }

        const playerIndex = parseInt(selectedIndex);
        if (isNaN(playerIndex) || playerIndex < 0 || playerIndex >= analysisData.length) {
            showToast('Invalid player selection.', true);
            return;
        }

        const player = analysisData[playerIndex];
        if (!player) {
            showToast('Player data not found.', true);
            return;
        }

        // Update metrics with validation
        const nameEl = document.getElementById('selected-player-name');
        const maxSpeedEl = document.getElementById('player-max-speed');
        const totalDistanceEl = document.getElementById('player-total-distance');
        const passAccuracyEl = document.getElementById('player-pass-accuracy');
        const avgSpeedEl = document.getElementById('player-avg-speed');
        
        if (nameEl) nameEl.textContent = `${player.name} (${player.team})`;
        if (maxSpeedEl) maxSpeedEl.textContent = `${player.maxSpeed.toFixed(1)} km/h`;
        if (totalDistanceEl) totalDistanceEl.textContent = `${player.totalDistance.toFixed(1)} km`;
        if (passAccuracyEl) passAccuracyEl.textContent = `${player.passAccuracy}%`;
        if (avgSpeedEl) avgSpeedEl.textContent = `${player.avgSpeed.toFixed(1)} km/h`;

        // Update AI Insights
        const insightsContainer = document.getElementById('ai-recommendations');
        if (insightsContainer && player.insights && Array.isArray(player.insights)) {
            insightsContainer.innerHTML = player.insights.map(insight => `
                <div class="recommendation-item">
                    <div class="recommendation-icon">💡</div>
                    <div class="recommendation-text">
                        <h6>AI Insight</h6>
                        <p>${insight}</p>
                    </div>
                </div>
            `).join('');
        }

        // Draw Heatmap
        if (player.heatmap && Array.isArray(player.heatmap)) {
            drawHeatmap(player.heatmap);
        }

        selectedAnalysisDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error showing player analysis:', error);
        showToast('Error displaying player analysis. Please try again.', true);
    }
}

function generateRealisticHeatmapData(position) {
    // Generate position-specific heatmap patterns
    const data = [];
    const canvasWidth = 400;
    const canvasHeight = 300;
    
    // Position-based activity zones
    const positionZones = {
        'GK': {
            zones: [{ x: [50, 150], y: [200, 280], intensity: [60, 90] }],
            pointCount: 30
        },
        'DF': {
            zones: [
                { x: [50, 200], y: [150, 250], intensity: [50, 85] },
                { x: [200, 350], y: [150, 250], intensity: [50, 85] }
            ],
            pointCount: 45
        },
        'MF': {
            zones: [
                { x: [100, 300], y: [100, 200], intensity: [70, 95] },
                { x: [50, 350], y: [50, 150], intensity: [40, 75] }
            ],
            pointCount: 60
        },
        'FW': {
            zones: [
                { x: [200, 350], y: [50, 150], intensity: [75, 100] },
                { x: [100, 300], y: [100, 200], intensity: [50, 80] }
            ],
            pointCount: 50
        }
    };
    
    const config = positionZones[position] || positionZones['MF'];
    
    // Generate points in each zone
    config.zones.forEach(zone => {
        const pointsInZone = Math.floor(config.pointCount / config.zones.length);
        for (let i = 0; i < pointsInZone; i++) {
            const x = Math.floor(Math.random() * (zone.x[1] - zone.x[0]) + zone.x[0]);
            const y = Math.floor(Math.random() * (zone.y[1] - zone.y[0]) + zone.y[0]);
            const value = Math.floor(Math.random() * (zone.intensity[1] - zone.intensity[0]) + zone.intensity[0]);
            
            data.push({ x, y, value });
        }
    });
    
    // Add some random scattered points for realism
    const scatterCount = Math.floor(config.pointCount * 0.3);
    for (let i = 0; i < scatterCount; i++) {
        data.push({
            x: Math.floor(Math.random() * canvasWidth),
            y: Math.floor(Math.random() * canvasHeight),
            value: Math.floor(Math.random() * 60) + 20
        });
    }
    
    return data;
}

function drawHeatmap(data) {
    try {
        const canvas = document.getElementById('heatmap-canvas');
        if (!canvas) {
            console.error('Heatmap canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }
        
        // Clear previous map
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            return;
        }

        // Draw background field (optional - light green)
        ctx.fillStyle = 'rgba(200, 255, 200, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sort by intensity for better rendering (higher intensity on top)
        const sortedData = [...data].sort((a, b) => a.value - b.value);

        // Draw heatmap points with gradient effect
        sortedData.forEach(point => {
            if (!point || typeof point.x !== 'number' || typeof point.y !== 'number' || typeof point.value !== 'number') {
                return; // Skip invalid points
            }
            
            // Clamp values to valid ranges
            const x = Math.max(0, Math.min(canvas.width, point.x));
            const y = Math.max(0, Math.min(canvas.height, point.y));
            const value = Math.max(0, Math.min(100, point.value));
            
            // Color gradient based on intensity
            let color;
            let alpha = 0.6;
            
            if (value > 80) {
                color = `rgba(255, 68, 68, ${alpha})`; // High Activity - Red
            } else if (value > 60) {
                color = `rgba(255, 140, 68, ${alpha})`; // Medium-High - Orange
            } else if (value > 40) {
                color = `rgba(255, 200, 68, ${alpha})`; // Medium - Yellow-Orange
            } else {
                color = `rgba(68, 255, 68, ${alpha})`; // Low Activity - Green
            }
            
            // Create gradient for smoother appearance
            const radius = Math.max(3, Math.min(15, 5 + (value / 15)));
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color.replace(alpha.toString(), '0'));
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
    } catch (error) {
        console.error('Error drawing heatmap:', error);
    }
}

function savePlayerData() {
    try {
        const playerSelect = document.getElementById('player-select');
        if (!playerSelect) {
            showToast('Error: Player selector not found.', true);
            return;
        }
        
        const selectedIndex = playerSelect.value;

        if (selectedIndex === "" || selectedIndex === null) {
            showToast('Please select a player first.', true);
            return;
        }

        const playerIndex = parseInt(selectedIndex);
        if (isNaN(playerIndex) || playerIndex < 0 || playerIndex >= analysisData.length) {
            showToast('Invalid player selection.', true);
            return;
        }

        const player = analysisData[playerIndex];
        if (!player) {
            showToast('Player data not found.', true);
            return;
        }

        // Validate player data before saving
        if (!player.name || !player.team) {
            showToast('Player data is incomplete. Cannot save.', true);
            return;
        }

        // Clean up team name (remove " Team" suffix if present)
        const cleanTeamName = player.team.replace(/\s*Team\s*$/i, '').trim() || player.team;

        // Construct the data object to be saved to the main analytics table
        const playerRecord = {
            id: 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: 'player',
            player_name: player.name,
            team: cleanTeamName,
            speed: parseFloat((player.avgSpeed || 0).toFixed(1)),
            distance: parseFloat((player.totalDistance || 0).toFixed(1)),
            pass_accuracy: Math.round(player.passAccuracy || 0),
            notes: Array.isArray(player.insights) ? player.insights.join(' | ') : '',
            timestamp: new Date().toISOString()
        };

        // Check for duplicates
        const duplicateCheck = allData.find(p => 
            p.type === 'player' && 
            p.player_name.toLowerCase() === playerRecord.player_name.toLowerCase() &&
            p.team.toLowerCase() === playerRecord.team.toLowerCase()
        );
        
        if (duplicateCheck) {
            showToast('This player already exists in Player Analytics.', true);
            return;
        }

        // Save player data
        allData.push(playerRecord);
        currentRecordCount = allData.length;
        mockDataChange();

        showToast(`Player ${player.name} stats saved successfully to Player Analytics!`);
        
    } catch (error) {
        console.error('Error saving player data:', error);
        showToast('Error saving player data. Please try again.', true);
    }
}

// --- Game Functionality ---

let gameState = {
    isRunning: false,
    score: 0,
    timeLeft: 60,
    playerX: 300,
    playerY: 300,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 0,
    ballSpeedY: 0,
    keys: {},
    gameInterval: null,
    timeInterval: null,
    currentGame: 'football'
};

function openGameSelection() {
    const modal = document.getElementById('game-selection-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeGameSelection() {
    const modal = document.getElementById('game-selection-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function selectGame(gameType) {
    gameState.currentGame = gameType;
    closeGameSelection();
    
    const gameModal = document.getElementById('game-modal');
    const gameTitle = document.getElementById('game-title');
    const gameRules = document.getElementById('game-rules-list');
    
    if (gameModal && gameTitle && gameRules) {
        // Update game title and rules based on selected game
        if (gameType === 'football') {
            gameTitle.textContent = '⚽ Football Goals';
            gameRules.innerHTML = `
                <li><strong>Space Bar:</strong> Kick the ball</li>
                <li><strong>Arrow Keys:</strong> Move player (↑ ↓ ← →)</li>
                <li><strong>Goal:</strong> Score by kicking the ball into the goal</li>
                <li><strong>Time:</strong> 60 seconds to score as many goals as possible!</li>
            `;
        } else if (gameType === 'tictactoe') {
            gameTitle.textContent = '⭕ Tic Tac Toe';
            gameRules.innerHTML = `
                <li><strong>Click:</strong> Place your mark (X or O)</li>
                <li><strong>Goal:</strong> Get three in a row to win!</li>
                <li><strong>Turn:</strong> Players alternate turns</li>
                <li><strong>Strategy:</strong> Block your opponent while building your line!</li>
            `;
        } else if (gameType === 'snakeladder') {
            gameTitle.textContent = '🐍 Snake & Ladder';
            gameRules.innerHTML = `
                <li><strong>Space Bar:</strong> Roll the dice</li>
                <li><strong>Goal:</strong> Reach square 100 first!</li>
                <li><strong>Ladders:</strong> Climb up when you land on them</li>
                <li><strong>Snakes:</strong> Slide down when you land on them</li>
            `;
        }
        
        gameModal.classList.add('active');
        resetGame();
    }
}

function openGameWindow() {
    const modal = document.getElementById('game-modal');
    if (modal) {
        modal.classList.add('active');
        resetGame();
    }
}

function closeGameWindow() {
    const modal = document.getElementById('game-modal');
    if (modal) {
        modal.classList.remove('active');
        stopGame();
    }
}

function resetGame() {
    gameState.isRunning = false;
    gameState.score = 0;
    gameState.timeLeft = 60;
    gameState.playerX = 300;
    gameState.playerY = 300;
    gameState.ballX = 300;
    gameState.ballY = 200;
    gameState.ballSpeedX = 0;
    gameState.ballSpeedY = 0;
    gameState.keys = {};
    
    updateGameDisplay();
    drawGame();
}

function startGame() {
    if (gameState.isRunning) return;
    
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.timeLeft = 60;
    gameState.playerX = 300;
    gameState.playerY = 300;
    gameState.ballX = 300;
    gameState.ballY = 200;
    gameState.ballSpeedX = 0;
    gameState.ballSpeedY = 0;
    
    const startBtn = document.querySelector('.game-start-btn');
    if (startBtn) startBtn.disabled = true;
    
    // Time countdown
    gameState.timeInterval = setInterval(() => {
        gameState.timeLeft--;
        updateGameDisplay();
        
        if (gameState.timeLeft <= 0) {
            stopGame();
            alert(`Game Over! Your score: ${gameState.score}`);
        }
    }, 1000);
    
    // Game loop
    gameState.gameInterval = setInterval(() => {
        updateGame();
        drawGame();
    }, 16); // ~60 FPS
}

function stopGame() {
    gameState.isRunning = false;
    
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = null;
    }
    
    if (gameState.timeInterval) {
        clearInterval(gameState.timeInterval);
        gameState.timeInterval = null;
    }
    
    const startBtn = document.querySelector('.game-start-btn');
    if (startBtn) startBtn.disabled = false;
}

function updateGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    if (gameState.currentGame === 'football') {
        updateFootballGame(canvas);
    } else if (gameState.currentGame === 'tictactoe') {
        // Tic-tac-toe is click-based, no continuous update needed
    } else if (gameState.currentGame === 'snakeladder') {
        // Snake & ladder is space-based, handled in keydown
    }
}

function updateFootballGame(canvas) {
    const speed = 5;
    const ballDecay = 0.95;
    
    // Move player
    if (gameState.keys['ArrowUp'] && gameState.playerY > 20) {
        gameState.playerY -= speed;
    }
    if (gameState.keys['ArrowDown'] && gameState.playerY < canvas.height - 20) {
        gameState.playerY += speed;
    }
    if (gameState.keys['ArrowLeft'] && gameState.playerX > 20) {
        gameState.playerX -= speed;
    }
    if (gameState.keys['ArrowRight'] && gameState.playerX < canvas.width - 20) {
        gameState.playerX += speed;
    }
    
    // Update ball position
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;
    
    // Ball friction
    gameState.ballSpeedX *= ballDecay;
    gameState.ballSpeedY *= ballDecay;
    
    // Ball boundaries
    if (gameState.ballX < 15 || gameState.ballX > canvas.width - 15) {
        gameState.ballSpeedX *= -0.8;
        gameState.ballX = Math.max(15, Math.min(canvas.width - 15, gameState.ballX));
    }
    if (gameState.ballY < 15 || gameState.ballY > canvas.height - 15) {
        gameState.ballSpeedY *= -0.8;
        gameState.ballY = Math.max(15, Math.min(canvas.height - 15, gameState.ballY));
    }
    
    // Check if ball is near player (kick)
    const distance = Math.sqrt(
        Math.pow(gameState.ballX - gameState.playerX, 2) + 
        Math.pow(gameState.ballY - gameState.playerY, 2)
    );
    
    if (distance < 30 && (gameState.keys[' '] || gameState.keys['Space'])) {
        const angle = Math.atan2(gameState.ballY - gameState.playerY, gameState.ballX - gameState.playerX);
        gameState.ballSpeedX = Math.cos(angle) * 8;
        gameState.ballSpeedY = Math.sin(angle) * 8;
    }
    
    // Check goal (right side)
    if (gameState.ballX > canvas.width - 30 && gameState.ballY > 150 && gameState.ballY < 250) {
        gameState.score++;
        gameState.ballX = 300;
        gameState.ballY = 200;
        gameState.ballSpeedX = 0;
        gameState.ballSpeedY = 0;
        updateGameDisplay();
    }
}

function drawGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (gameState.currentGame === 'football') {
        drawFootballGame(ctx, canvas);
    } else if (gameState.currentGame === 'tictactoe') {
        drawTicTacToe(ctx, canvas);
    } else if (gameState.currentGame === 'snakeladder') {
        drawSnakeLadder(ctx, canvas);
    }
}

function drawFootballGame(ctx, canvas) {
    // Clear canvas
    ctx.fillStyle = '#1a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw field lines
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw goal (right side)
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 30, 150);
    ctx.lineTo(canvas.width, 150);
    ctx.lineTo(canvas.width, 250);
    ctx.lineTo(canvas.width - 30, 250);
    ctx.stroke();
    
    // Draw player
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(gameState.playerX, gameState.playerY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw ball
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawTicTacToe(ctx, canvas) {
    // Clear canvas
    ctx.fillStyle = '#1a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 4;
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width * 2 / 3, 0);
    ctx.lineTo(canvas.width * 2 / 3, canvas.height);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 2 / 3);
    ctx.lineTo(canvas.width, canvas.height * 2 / 3);
    ctx.stroke();
    
    // Draw X and O (placeholder - will be implemented with click handlers)
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff6b35';
    ctx.fillText('Click to play!', canvas.width / 2, canvas.height / 2);
}

function drawSnakeLadder(ctx, canvas) {
    // Clear canvas
    ctx.fillStyle = '#1a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board background
    ctx.fillStyle = '#2a3a3a';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Draw placeholder text
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff6b35';
    ctx.fillText('Snake & Ladder', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#cbd5e0';
    ctx.fillText('Press Space to roll dice!', canvas.width / 2, canvas.height / 2 + 20);
}

function updateGameDisplay() {
    const scoreEl = document.getElementById('game-score');
    const timeEl = document.getElementById('game-time');
    
    if (scoreEl) scoreEl.textContent = gameState.score;
    if (timeEl) timeEl.textContent = gameState.timeLeft;
}

// Keyboard event handlers
document.addEventListener('keydown', (e) => {
    if (gameState.isRunning) {
        gameState.keys[e.key] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (gameState.isRunning) {
        gameState.keys[e.key] = false;
        e.preventDefault();
    }
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const gameModal = document.getElementById('game-modal');
    const gameSelectionModal = document.getElementById('game-selection-modal');
    const aboutModal = document.getElementById('about-modal');
    
    if (gameModal && e.target === gameModal) {
        closeGameWindow();
    }
    if (gameSelectionModal && e.target === gameSelectionModal) {
        closeGameSelection();
    }
    if (aboutModal && e.target === aboutModal) {
        closeAboutModal();
    }
});

// --- End of Script ---