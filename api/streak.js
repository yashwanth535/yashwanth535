import express from 'express';
import fetch from 'node-fetch';
import { generateStreakSVG } from '../utils/generateStreakSVG.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    return res.status(500).send('Missing GitHub credentials');
  }

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    const days = data.data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({
        date: day.date,
        count: day.contributionCount,
      }))
      .filter(day => day.count > 0) // Only consider days with contributions
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Calculate streak data
    const today = new Date().toISOString().slice(0, 10);
    let currentStreak = 0;
    let currentStreakStart = null;
    let longestStreak = 0;
    let longestStreakStart = null;
    let longestStreakEnd = null;
    let firstCommitDate = null;
    let lastCommitDate = null;

    if (days.length > 0) {
      firstCommitDate = days[0].date;
      lastCommitDate = days[days.length - 1].date;

      // Calculate current streak (from today backwards)
      let streakCount = 0;
      let currentDate = new Date(today);
      
      for (let i = days.length - 1; i >= 0; i--) {
        const day = days[i];
        const dayDate = new Date(day.date);
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
        
        if (day.date === currentDate.toISOString().slice(0, 10)) {
          streakCount++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (day.date === expectedDate.toISOString().slice(0, 10)) {
          streakCount++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      currentStreak = streakCount;
      
      // Find current streak start date
      if (currentStreak > 0) {
        const streakStartDate = new Date(today);
        streakStartDate.setDate(streakStartDate.getDate() - (currentStreak - 1));
        currentStreakStart = streakStartDate.toISOString().slice(0, 10);
      }

      // Calculate longest streak
      let maxStreak = 0;
      let maxStreakStart = null;
      let maxStreakEnd = null;
      
      for (let i = 0; i < days.length; i++) {
        let streak = 1;
        let streakStart = days[i].date;
        let streakEnd = days[i].date;
        
        for (let j = i + 1; j < days.length; j++) {
          const prevDate = new Date(days[j - 1].date);
          const currDate = new Date(days[j].date);
          const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            streak++;
            streakEnd = days[j].date;
          } else {
            break;
          }
        }
        
        if (streak > maxStreak) {
          maxStreak = streak;
          maxStreakStart = streakStart;
          maxStreakEnd = streakEnd;
        }
      }
      
      longestStreak = maxStreak;
      longestStreakStart = maxStreakStart;
      longestStreakEnd = maxStreakEnd;
    }

    // SVG output
    const svg = generateStreakSVG({
      totalContributions: data.data.user.contributionsCollection.contributionCalendar.totalContributions,
      currentStreak,
      longestStreak,
      firstCommitDate,
      lastCommitDate,
      currentStreakStart,
      longestStreakStart,
      longestStreakEnd,
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    console.error('Error fetching streak data:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
