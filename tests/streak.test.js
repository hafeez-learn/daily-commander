// Streak calculation unit tests

function testStreakEdgeCases() {
  console.log('Testing streak edge cases...');
  
  // Test: No data
  global.localStorage = { getItem: () => null };
  let result = calculateStreak();
  console.assert(result.streak === 0, 'Empty storage should give streak 0');
  
  // Test: Single day
  const today = new Date().toISOString().split('T')[0];
  global.localStorage = {
    getItem: (key) => {
      if (key === 'focuszone_history_v1') {
        return JSON.stringify([{ date: today, completed: true, focusTime: 30 }]);
      }
      return null;
    }
  };
  result = calculateStreak();
  console.assert(result.streak === 1, `Single day should give streak 1, got ${result.streak}`);
  
  console.log('✓ Edge case tests passed');
}

function testStreakLogic() {
  console.log('Testing streak logic...');
  
  // Two consecutive days
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  global.localStorage = {
    getItem: (key) => {
      if (key === 'focuszone_history_v1') {
        return JSON.stringify([
          { date: today, completed: true, focusTime: 30 },
          { date: yesterday, completed: true, focusTime: 25 }
        ]);
      }
      return null;
    }
  };
  
  let result = calculateStreak();
  console.assert(result.streak === 2, `Two consecutive days should give streak 2, got ${result.streak}`);
  
  // Three consecutive days
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  global.localStorage = {
    getItem: (key) => {
      if (key === 'focuszone_history_v1') {
        return JSON.stringify([
          { date: today, completed: true, focusTime: 30 },
          { date: yesterday, completed: true, focusTime: 25 },
          { date: twoDaysAgo, completed: true, focusTime: 20 }
        ]);
      }
      return null;
    }
  };
  
  result = calculateStreak();
  console.assert(result.streak === 3, `Three consecutive days should give streak 3, got ${result.streak}`);
  
  console.log('✓ Streak logic tests passed');
}

function testStreakNotStartedToday() {
  console.log('Testing streak when not started today...');
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  
  global.localStorage = {
    getItem: (key) => {
      if (key === 'focuszone_history_v1') {
        return JSON.stringify([
          { date: yesterday, completed: true, focusTime: 25 },
          { date: twoDaysAgo, completed: true, focusTime: 20 }
        ]);
      }
      return null;
    }
  };
  
  const result = calculateStreak();
  // Streak should count from yesterday (most recent entry)
  console.assert(result.streak === 2, `Should count from yesterday, got streak ${result.streak}`);
  
  console.log('✓ Not started today tests passed');
}

function runStreakTests() {
  console.log('\n=== Running Streak Tests ===\n');
  testStreakEdgeCases();
  testStreakLogic();
  testStreakNotStartedToday();
  console.log('\n=== All Streak Tests Passed ===\n');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runStreakTests };
}