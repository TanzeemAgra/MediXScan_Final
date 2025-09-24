#!/usr/bin/env node
// Icon Detection Script - Automatically finds missing FA icons and reports them
// Run with: node detect-missing-icons.jsx

const fs = require('fs');
const path = require('path');

const __dirname = __dirname;

// Define search directories
const searchDirs = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'views')
];

const iconUtilsPath = path.join(__dirname, 'src', 'utils', 'icons.utils.jsx');

// Read the current icon exports
function getExportedIcons() {
  try {
    const content = fs.readFileSync(iconUtilsPath, 'utf8');
    const exportMatches = content.match(/export const (Fa[A-Za-z0-9_]+)/g) || [];
    return exportMatches.map(match => match.replace('export const ', ''));
  } catch (error) {
    console.error('Error reading icons utils:', error.message);
    return [];
  }
}

// Find all FA icon imports in files
function findIconUsages(dir) {
  const icons = new Set();
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find icon imports: import { FaIcon1, FaIcon2 } from ...
      const importMatches = content.match(/import\s+{[^}]*}/g) || [];
      importMatches.forEach(match => {
        const iconMatches = match.match(/Fa[A-Za-z0-9_]+/g) || [];
        iconMatches.forEach(icon => icons.add(icon));
      });
      
      // Find icon usage: <FaIcon />
      const usageMatches = content.match(/<Fa[A-Za-z0-9_]+/g) || [];
      usageMatches.forEach(match => {
        const icon = match.replace('<', '');
        icons.add(icon);
      });
      
      // Find icon references: FaIcon
      const refMatches = content.match(/\bFa[A-Za-z0-9_]+\b/g) || [];
      refMatches.forEach(icon => icons.add(icon));
      
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
    }
  }
  
  function scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
          scanFile(itemPath);
        }
      });
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }
  
  scanDirectory(dir);
  return Array.from(icons);
}

// Main execution
function main() {
  console.log('🔍 MediXScan Icon Detection System');
  console.log('=====================================');
  
  // Get currently exported icons
  const exportedIcons = getExportedIcons();
  console.log(`✅ Found ${exportedIcons.length} exported icons`);
  
  // Scan for used icons
  const allUsedIcons = new Set();
  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const icons = findIconUsages(dir);
      icons.forEach(icon => allUsedIcons.add(icon));
      console.log(`📂 Scanned ${dir}: found ${icons.length} icon references`);
    }
  });
  
  // Find missing icons
  const usedIconsArray = Array.from(allUsedIcons).sort();
  const missingIcons = usedIconsArray.filter(icon => !exportedIcons.includes(icon));
  
  console.log('\n📊 Analysis Results:');
  console.log(`   Total icons used: ${usedIconsArray.length}`);
  console.log(`   Icons exported: ${exportedIcons.length}`);
  console.log(`   Missing icons: ${missingIcons.length}`);
  
  if (missingIcons.length > 0) {
    console.log('\n❌ Missing Icons:');
    missingIcons.forEach(icon => console.log(`   - ${icon}`));
    
    console.log('\n📝 Suggested Icon Mappings (add to icons.utils.jsx):');
    console.log('// Add to iconMapping:');
    missingIcons.forEach(icon => {
      const remixIcon = suggestRemixIcon(icon);
      console.log(`    ${icon}: '${remixIcon}',`);
    });
    
    console.log('\n// Add to emojiFallbacks:');
    missingIcons.forEach(icon => {
      const emoji = suggestEmoji(icon);
      console.log(`    ${icon}: '${emoji}',`);
    });
    
    console.log('\n// Add to textFallbacks:');
    missingIcons.forEach(icon => {
      const text = suggestText(icon);
      console.log(`    ${icon}: '${text}',`);
    });
    
    console.log('\n// Add exports:');
    missingIcons.forEach(icon => {
      const description = getIconDescription(icon);
      console.log(`export const ${icon} = getIcon('${icon}', '${description}');`);
    });
  } else {
    console.log('\n✅ All icons are properly exported!');
  }
  
  console.log('\n🎯 Icon Usage Summary:');
  const iconGroups = groupIcons(usedIconsArray);
  Object.entries(iconGroups).forEach(([group, icons]) => {
    console.log(`   ${group}: ${icons.length} icons`);
  });
}

// Helper functions
function suggestRemixIcon(faIcon) {
  const iconMap = {
    FaTrendUp: 'RiTrendingUpFill',
    FaTrendDown: 'RiTrendingDownFill',
    FaChevronUp: 'RiArrowUpSFill',
    FaChevronDown: 'RiArrowDownSFill',
    FaChevronLeft: 'RiArrowLeftSFill',
    FaChevronRight: 'RiArrowRightSFill',
    FaSpinner: 'RiLoaderFill',
    FaShoppingCart: 'RiShoppingCartFill',
    FaHeart: 'RiHeartFill',
    FaStar: 'RiStarFill',
    FaThumbsUp: 'RiThumbUpFill',
    FaThumbsDown: 'RiThumbDownFill'
  };
  
  return iconMap[faIcon] || 'RiQuestionFill';
}

function suggestEmoji(faIcon) {
  const emojiMap = {
    FaTrendUp: '📈',
    FaTrendDown: '📉',
    FaChevronUp: '⬆️',
    FaChevronDown: '⬇️',
    FaChevronLeft: '⬅️',
    FaChevronRight: '➡️',
    FaSpinner: '🔄',
    FaShoppingCart: '🛒',
    FaHeart: '❤️',
    FaStar: '⭐',
    FaThumbsUp: '👍',
    FaThumbsDown: '👎'
  };
  
  return emojiMap[faIcon] || '❓';
}

function suggestText(faIcon) {
  return faIcon.replace('Fa', '').replace(/([A-Z])/g, ' $1').trim().toUpperCase().slice(0, 6);
}

function getIconDescription(faIcon) {
  return faIcon.replace('Fa', '').replace(/([A-Z])/g, ' $1').trim();
}

function groupIcons(icons) {
  const groups = {
    'Navigation': [],
    'Actions': [],
    'Charts': [],
    'Users': [],
    'Medical': [],
    'Communication': [],
    'Time': [],
    'Other': []
  };
  
  icons.forEach(icon => {
    const lower = icon.toLowerCase();
    if (lower.includes('chart') || lower.includes('analytics') || lower.includes('trend')) {
      groups.Charts.push(icon);
    } else if (lower.includes('user') || lower.includes('people') || lower.includes('person')) {
      groups.Users.push(icon);
    } else if (lower.includes('medical') || lower.includes('health') || lower.includes('heart') || lower.includes('brain')) {
      groups.Medical.push(icon);
    } else if (lower.includes('mail') || lower.includes('phone') || lower.includes('comment')) {
      groups.Communication.push(icon);
    } else if (lower.includes('clock') || lower.includes('calendar') || lower.includes('time')) {
      groups.Time.push(icon);
    } else if (lower.includes('home') || lower.includes('dashboard') || lower.includes('nav')) {
      groups.Navigation.push(icon);
    } else if (lower.includes('edit') || lower.includes('delete') || lower.includes('add') || lower.includes('save')) {
      groups.Actions.push(icon);
    } else {
      groups.Other.push(icon);
    }
  });
  
  return groups;
}

// Run the script
main();