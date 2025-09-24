// Icon Detection Script - Automatically finds missing FA icons and reports them
// Run with: node detect-missing-icons.jsx

const fs = require('fs');
const path = require('path');

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

// Helper functions for suggestions
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
    FaThumbsDown: 'RiThumbDownFill',
    FaPlus: 'RiAddFill',
    FaMinus: 'RiSubtractFill',
    FaTimes: 'RiCloseFill',
    FaCheck: 'RiCheckFill'
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
    FaThumbsDown: '👎',
    FaPlus: '➕',
    FaMinus: '➖',
    FaTimes: '❌',
    FaCheck: '✅'
  };
  
  return emojiMap[faIcon] || '❓';
}

function suggestText(faIcon) {
  return faIcon.replace('Fa', '').replace(/([A-Z])/g, ' $1').trim().toUpperCase().slice(0, 6);
}

function getIconDescription(faIcon) {
  return faIcon.replace('Fa', '').replace(/([A-Z])/g, ' $1').trim();
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
  
  console.log('\n🎯 All Used Icons:');
  usedIconsArray.forEach(icon => console.log(`   - ${icon}`));
}

// Run the script
main();