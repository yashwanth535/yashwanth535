import express from 'express';
import { fetchGitHubStats, fetchPrivateRepos } from '../utils/fetchGitHub.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const username = 'yashwanth535';
  const data = await fetchGitHubStats(username);
  const privateData = await fetchPrivateRepos(username);

  // Extract data
  const user = data.data.user;
  const contributions = user.contributionsCollection;
  const totalContributions = contributions.contributionCalendar.totalContributions;
  const stars = user.starredRepositories.totalCount;
  const publicRepos = user.repositories.totalCount;
  const privateRepos = privateData.data.user.repositories.totalCount;
  const pullRequests = user.pullRequests.totalCount;
  


  const svg = `
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#161b22;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="publicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#79c0ff;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="privateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f85149;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="prGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#238636;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2ea043;stop-opacity:1" />
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
      .sub-stat { fill: #7c3aed; font: 14px 'Segoe UI', sans-serif; text-anchor: middle; }
    </style>
    
    <!-- Background -->
    <rect width="100%" height="100%" rx="15" fill="url(#bgGradient)" stroke="#30363d" stroke-width="2"/>
    
    <!-- Header -->
    <text x="400" y="50" class="header">📊 GitHub Stats Dashboard</text>
    
    <!-- Total Contributions -->
    <g transform="translate(133, 120)">
      <circle cx="0" cy="0" r="55" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${totalContributions}</text>
      <text x="0" y="90" class="stat-label">Total Contributions</text>
      <text x="0" y="115" class="sub-stat">All Time</text>
    </g>
    
    <!-- Stars -->
    <g transform="translate(267, 120)">
      <circle cx="0" cy="0" r="55" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${stars}</text>
      <text x="0" y="90" class="stat-label">Stars Received</text>
      <text x="0" y="115" class="sub-stat">⭐</text>
    </g>
    
    <!-- Public Repositories -->
    <g transform="translate(400, 120)">
      <circle cx="0" cy="0" r="55" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${publicRepos}</text>
      <text x="0" y="90" class="stat-label">Public Repos</text>
      <text x="0" y="115" class="sub-stat">🌐</text>
    </g>
    
    <!-- Private Repositories -->
    <g transform="translate(533, 120)">
      <circle cx="0" cy="0" r="55" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${privateRepos}</text>
      <text x="0" y="90" class="stat-label">Private Repos</text>
      <text x="0" y="115" class="sub-stat">🔒</text>
    </g>
    
    <!-- Pull Requests -->
    <g transform="translate(667, 120)">
      <circle cx="0" cy="0" r="55" fill="#1f2937" stroke="#374151" stroke-width="2"/>
      <text x="0" y="8" class="stat-value">${pullRequests}</text>
      <text x="0" y="90" class="stat-label">Pull Requests</text>
      <text x="0" y="115" class="sub-stat">🔀</text>
    </g>
    
         <!-- Contribution Breakdown -->
     <g transform="translate(100, 280)">
      <text x="300" y="0" class="stat-label" style="font-size: 20px;">Contribution Breakdown</text>
      
      <!-- Commits -->
      <g transform="translate(0, 25)">
        <rect x="0" y="0" width="120" height="10" rx="5" fill="#238636"/>
        <text x="130" y="8" class="sub-stat" style="text-anchor: start;">Commits: ${contributions.totalCommitContributions}</text>
      </g>
      
      <!-- Issues -->
      <g transform="translate(0, 50)">
        <rect x="0" y="0" width="120" height="10" rx="5" fill="#f85149"/>
        <text x="130" y="8" class="sub-stat" style="text-anchor: start;">Issues: ${contributions.totalIssueContributions}</text>
      </g>
      
      <!-- Pull Requests -->
      <g transform="translate(0, 75)">
        <rect x="0" y="0" width="120" height="10" rx="5" fill="#58a6ff"/>
        <text x="130" y="8" class="sub-stat" style="text-anchor: start;">PRs: ${contributions.totalPullRequestContributions}</text>
      </g>
      
      <!-- PR Reviews -->
      <g transform="translate(0, 100)">
        <rect x="0" y="0" width="120" height="10" rx="5" fill="#ffd700"/>
        <text x="130" y="8" class="sub-stat" style="text-anchor: start;">Reviews: ${contributions.totalPullRequestReviewContributions}</text>
      </g>
    </g>
    </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

export default router;
