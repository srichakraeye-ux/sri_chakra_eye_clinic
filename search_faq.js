const fs = require('fs');
const content = fs.readFileSync('pages/services_overview.html', 'utf8');

// Find FAQ references
const matches = [...content.matchAll(/faq|FAQ|google.*sheet|gsheet|fetch|https:\/\//gi)];
console.log('Total matches:', matches.length);

// Find FAQ-related content
const faqIdx = content.indexOf('FAQ');
if (faqIdx >= 0) {
    console.log('Found FAQ at index:', faqIdx);
    console.log('Context:', content.substring(Math.max(0, faqIdx - 200), faqIdx + 500));
}

// Look for script that might load from Google Sheets
const scripts = content.match(/<script>.*?<\/script>/gi) || [];
console.log('\nNumber of scripts:', scripts.length);
scripts.forEach((script, i) => {
    if (script.includes('google') || script.includes('sheet') || script.includes('fetch') || script.includes('faq')) {
        console.log(`Script ${i}:`, script.substring(0, 500));
    }
});
