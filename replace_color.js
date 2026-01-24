const fs = require('fs');
const path = require('path');

const oldColor = '#4A90E2';
const newColor = '#33AB98';

const files = [
  'public/manifest.json',
  'components/ui/Textarea.js',
  'components/ui/Switch.js',
  'components/NotificationButton.js',
  'components/dashboard/NextVaccineCard.js',
  'components/child/RecordVaccineModal.js',
  'components/child/TimelineItem.js',
  'components/cards/NextVaccineCard.js',
  'components/cards/ChildCard.js',
  'components/layout/BottomNav.js',
  'app/layout.js',
  'app/page.js',
  'app/dashboard/page.js',
  'app/profile/page.js',
  'app/information/page.js',
  'app/subscription/page.js',
  'app/schedule/page.js',
  'app/childs/page.js',
  'app/home/page.js',
  'app/childs/add/page.js',
  'app/auth/signin/page.js',
  'app/auth/signup/page.js',
  'app/vaccine/[id]/page.js',
  'app/timeline/page.js'
];

const rootDir = __dirname;

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Using a regex with global flag and case-insensitive to be sure
    const regex = new RegExp(oldColor, 'gi');
    if (regex.test(content)) {
      const newContent = content.replace(regex, newColor);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${file}`);
    } else {
      console.log(`No match found in: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
