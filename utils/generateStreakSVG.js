export function generateStreakSVG({ 
  totalContributions, 
  currentStreak, 
  longestStreak,
  firstCommitDate,
  lastCommitDate,
  currentStreakStart,
  longestStreakStart,
  longestStreakEnd
}) {
  // Format dates for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalDateRange = firstCommitDate && lastCommitDate 
    ? `${formatDate(firstCommitDate)} - ${formatDate(lastCommitDate)}`
    : 'N/A';

  const currentStreakRange = currentStreakStart && currentStreak > 0
    ? `${formatDate(currentStreakStart)} - ${formatDate(lastCommitDate)}`
    : 'No active streak';

  const longestStreakRange = longestStreakStart && longestStreakEnd
    ? `${formatDate(longestStreakStart)} - ${formatDate(longestStreakEnd)}`
    : 'N/A';

  return `
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#161b22;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#f7931e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffd23f;stop-opacity:1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <style>
      .header { fill: #58a6ff; font: 700 32px 'Segoe UI', sans-serif; text-anchor: middle; }
      .stat-value { fill: #fdf6e3; font: bold 36px 'Segoe UI', sans-serif; text-anchor: middle; }
      .stat-label { fill: #9ca3af; font: 600 16px 'Segoe UI', sans-serif; text-anchor: middle; }
      .date-range { fill: #7c3aed; font: 14px 'Segoe UI', sans-serif; text-anchor: middle; }
      .streak-fire { fill: url(#fireGradient); filter: url(#glow); }
    </style>
    
    <!-- Background -->
    <rect width="100%" height="100%" rx="15" fill="url(#bgGradient)" stroke="#30363d" stroke-width="2"/>
    
    <!-- Header -->
    <text x="400" y="50" class="header">🔥 GitHub Streak Stats 🔥</text>
    
    <!-- Total Contributions -->
    <g transform="translate(200, 140)">
      <circle cx="0" cy="0" r="60" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${totalContributions}</text>
      <text x="0" y="95" class="stat-label">Total Contributions</text>
      <text x="0" y="120" class="date-range">${totalDateRange}</text>
    </g>
    
    <!-- Current Streak -->
    <g transform="translate(400, 140)">
      <circle cx="0" cy="0" r="60" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${currentStreak}</text>
      <text x="0" y="95" class="stat-label">Current Streak</text>
      <text x="0" y="120" class="date-range">${currentStreakRange}</text>
    </g>
    
    <!-- Longest Streak -->
    <g transform="translate(600, 140)">
      <circle cx="0" cy="0" r="60" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${longestStreak}</text>
      <text x="0" y="95" class="stat-label">Longest Streak</text>
      <text x="0" y="120" class="date-range">${longestStreakRange}</text>
      
      <!-- Crown icon for longest streak -->
      <g transform="translate(0, -35)">
        <path d="M-15,10 L-10,5 L-5,10 L0,5 L5,10 L10,5 L15,10 L12,15 L10,12 L7,15 L5,12 L2,15 L0,12 L-2,15 L-5,12 L-7,15 L-10,12 L-12,15 Z" fill="#ffd700" stroke="#daa520" stroke-width="1"/>
        <circle cx="-10" cy="8" r="1.5" fill="#ffffff"/>
        <circle cx="-5" cy="8" r="1.5" fill="#ffffff"/>
        <circle cx="0" cy="8" r="1.5" fill="#ffffff"/>
        <circle cx="5" cy="8" r="1.5" fill="#ffffff"/>
        <circle cx="10" cy="8" r="1.5" fill="#ffffff"/>
      </g>
    </g>
    
    <!-- Streak visualization -->
    <g transform="translate(100, 300)">
      <text x="300" y="0" class="stat-label" style="font-size: 20px;">Streak Timeline</text>
      
      <!-- Timeline bar -->
      <rect x="0" y="25" width="600" height="10" rx="5" fill="#374151"/>
      
      <!-- Current streak indicator -->
      ${currentStreak > 0 ? `
        <rect x="${600 - (currentStreak * 10)}" y="23" width="${currentStreak * 10}" height="14" rx="7" fill="url(#fireGradient)" stroke="#ffffff" stroke-width="1"/>
        <text x="${600 - (currentStreak * 5)}" y="55" class="date-range">Current: ${currentStreak} days</text>
      ` : ''}
      
      <!-- Longest streak indicator -->
      ${longestStreak > 0 ? `
        <rect x="50" y="23" width="${longestStreak * 10}" height="14" rx="7" fill="#ffd700" stroke="#daa520" stroke-width="1"/>
        <text x="${50 + (longestStreak * 5)}" y="55" class="date-range">Longest: ${longestStreak} days</text>
      ` : ''}
    </g>
    
    </svg>
  `;
}
