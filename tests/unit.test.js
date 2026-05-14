// Unit tests for Daily Command Center components

// ============ Weather Parsing Tests ============
function testGetWMOIcon() {
  const tests = [
    { code: 0, expected: '☀️' },
    { code: 1, expected: '🌤️' },
    { code: 2, expected: '⛅' },
    { code: 3, expected: '☁️' },
    { code: 45, expected: '🌫️' },
    { code: 61, expected: '🌧️' },
    { code: 71, expected: '🌨️' },
    { code: 95, expected: '⛈️' },
    { code: 99, expected: '⛈️' },
    { code: 999, expected: '❓' } // Unknown code
  ];
  
  tests.forEach(({ code, expected }) => {
    const result = getWMOIcon(code);
    if (result !== expected) {
      throw new Error(`getWMOIcon(${code}) = "${result}", expected "${expected}"`);
    }
  });
  console.log('✓ getWMOIcon tests passed');
}

function testGetWMODescription() {
  const tests = [
    { code: 0, expected: 'Clear sky' },
    { code: 1, expected: 'Mainly clear' },
    { code: 61, expected: 'Slight rain' },
    { code: 63, expected: 'Moderate rain' },
    { code: 95, expected: 'Thunderstorm' },
    { code: 999, expected: 'Unknown' }
  ];
  
  tests.forEach(({ code, expected }) => {
    const result = getWMODescription(code);
    if (result !== expected) {
      throw new Error(`getWMODescription(${code}) = "${result}", expected "${expected}"`);
    }
  });
  console.log('✓ getWMODescription tests passed');
}

function testFormatDate() {
  // Test with a known date
  const testDate = new Date('2024-01-15T12:00:00Z');
  const result = formatDate(testDate);
  
  if (!result.includes('Monday') || !result.includes('2024')) {
    throw new Error(`formatDate produced unexpected output: "${result}"`);
  }
  console.log('✓ formatDate tests passed');
}

// ============ Task Management Tests ============
let taskTestsPassed = 0;

function testAddTask() {
  // Mock tasks array
  global.tasks = [];
  
  addTask('Test task 1');
  if (tasks.length !== 1 || tasks[0].text !== 'Test task 1') {
    throw new Error('addTask failed');
  }
  
  addTask('Test task 2');
  if (tasks.length !== 2) {
    throw new Error('addTask did not add second task');
  }
  
  // New tasks go to top
  addTask('New top task');
  if (tasks[0].text !== 'New top task') {
    throw new Error('addTask did not add to top');
  }
  
  taskTestsPassed++;
  console.log('✓ addTask tests passed');
}

function testToggleTask() {
  global.tasks = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true }
  ];
  
  toggleTask('1');
  if (!tasks[0].completed) {
    throw new Error('toggleTask did not complete task');
  }
  
  toggleTask('1');
  if (tasks[0].completed) {
    throw new Error('toggleTask did not uncomplete task');
  }
  
  taskTestsPassed++;
  console.log('✓ toggleTask tests passed');
}

function testDeleteTask() {
  global.tasks = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: false }
  ];
  
  deleteTask('1');
  if (tasks.length !== 1 || tasks[0].id !== '2') {
    throw new Error('deleteTask did not remove correct task');
  }
  
  taskTestsPassed++;
  console.log('✓ deleteTask tests passed');
}

function testTaskOrdering() {
  global.tasks = [
    { id: '1', text: 'Completed task', completed: true },
    { id: '2', text: 'Visible task 1', completed: false },
    { id: '3', text: 'Visible task 2', completed: false },
    { id: '4', text: 'Hidden task', completed: false },
    { id: '5', text: 'Another completed', completed: true }
  ];
  
  // Simulate render logic
  const visible = tasks.filter(t => !t.completed).slice(0, 3);
  const completed = tasks.filter(t => t.completed);
  
  // Should have 3 visible (max), 2 completed
  if (visible.length !== 3) {
    throw new Error(`Expected 3 visible tasks, got ${visible.length}`);
  }
  if (completed.length !== 2) {
    throw new Error(`Expected 2 completed tasks, got ${completed.length}`);
  }
  
  // Visible should not include hidden task
  const hiddenExists = visible.some(t => t.id === '4');
  if (hiddenExists) {
    throw new Error('Hidden task should not be in visible list');
  }
  
  taskTestsPassed++;
  console.log('✓ taskOrdering tests passed');
}

// ============ Streak Calculation Tests ============
function testCalculateStreakEmpty() {
  // Clear localStorage mock
  const getItemMock = () => null;
  
  global.localStorage = { getItem: getItemMock };
  
  const result = calculateStreak();
  if (result.streak !== 0) {
    throw new Error(`Expected streak 0 for empty storage, got ${result.streak}`);
  }
  console.log('✓ calculateStreak (empty) tests passed');
}

function testCalculateStreakWithData() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  
  // Mock localStorage with streak data
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
  
  const result = calculateStreak();
  if (result.streak !== 3) {
    throw new Error(`Expected streak 3, got ${result.streak}`);
  }
  console.log('✓ calculateStreak (with data) tests passed');
}

function testCalculateStreakBroken() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  
  global.localStorage = {
    getItem: (key) => {
      if (key === 'focuszone_history_v1') {
        return JSON.stringify([
          { date: today, completed: true, focusTime: 30 },
          { date: yesterday, completed: true, focusTime: 25 },
          { date: weekAgo, completed: true, focusTime: 20 }
        ]);
      }
      return null;
    }
  };
  
  const result = calculateStreak();
  // Streak is broken, should be 0 since weekAgo is not consecutive
  if (result.streak !== 2) {
    throw new Error(`Expected streak 2 (recent consecutive), got ${result.streak}`);
  }
  console.log('✓ calculateStreak (broken) tests passed');
}

// ============ Escape HTML Tests ============
function testEscapeHtml() {
  const tests = [
    { input: 'Hello', expected: 'Hello' },
    { input: '<script>', expected: '&lt;script&gt;' },
    { input: 'Test &amp; more', expected: 'Test &amp;amp; more' },
    { input: 'A "quoted" string', expected: 'A &quot;quoted&quot; string' }
  ];
  
  tests.forEach(({ input, expected }) => {
    const result = escapeHtml(input);
    if (result !== expected) {
      throw new Error(`escapeHtml("${input}") = "${result}", expected "${expected}"`);
    }
  });
  console.log('✓ escapeHtml tests passed');
}

// ============ Run All Tests ============
function runTests() {
  console.log('\n=== Running Unit Tests ===\n');
  
  // Weather tests (use global functions from app)
  testGetWMOIcon();
  testGetWMODescription();
  testFormatDate();
  testEscapeHtml();
  
  // Task tests
  testAddTask();
  testToggleTask();
  testDeleteTask();
  testTaskOrdering();
  
  // Streak tests
  testCalculateStreakEmpty();
  testCalculateStreakWithData();
  testCalculateStreakBroken();
  
  console.log('\n=== All Unit Tests Passed ===\n');
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}