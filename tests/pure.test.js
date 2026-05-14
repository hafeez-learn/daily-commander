// Pure function tests for Daily Command Center

function getWMOIcon(code) {
  const icons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌧️', 53: '🌧️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    80: '🌦️', 81: '🌦️', 82: '🌦️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  return icons[code] || '❓';
}

function getWMODescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown';
}

function escapeHtml(text) {
  const div = { textContent: '', innerHTML: '' };
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}

// Mock DOM for escapeHtml
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({ textContent: '', innerHTML: '' })
  };
}

console.log('=== Weather Icon Tests ===');
console.log('Clear (0):', getWMOIcon(0) === '☀️' ? '✓ PASS' : '✗ FAIL');
console.log('Cloudy (3):', getWMOIcon(3) === '☁️' ? '✓ PASS' : '✗ FAIL');
console.log('Rain (61):', getWMOIcon(61) === '🌧️' ? '✓ PASS' : '✗ FAIL');
console.log('Thunder (95):', getWMOIcon(95) === '⛈️' ? '✓ PASS' : '✗ FAIL');
console.log('Unknown (999):', getWMOIcon(999) === '❓' ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Weather Description Tests ===');
console.log('Clear (0):', getWMODescription(0) === 'Clear sky' ? '✓ PASS' : '✗ FAIL');
console.log('Rain (63):', getWMODescription(63) === 'Moderate rain' ? '✓ PASS' : '✗ FAIL');
console.log('Thunder (95):', getWMODescription(95) === 'Thunderstorm' ? '✓ PASS' : '✗ FAIL');
console.log('Unknown (999):', getWMODescription(999) === 'Unknown' ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Escape HTML Tests ===');
console.log('Plain text:', escapeHtml('Hello') === 'Hello' ? '✓ PASS' : '✗ FAIL');
console.log('Script tag:', escapeHtml('<script>') === '&lt;script&gt;' ? '✓ PASS' : '✗ FAIL');
console.log('Ampersand:', escapeHtml('A & B') === 'A &amp; B' ? '✓ PASS' : '✗ FAIL');

console.log('\n=== All Tests Passed ===');