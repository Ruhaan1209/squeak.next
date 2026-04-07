export function getCEFRColor(level: string): string {
  if (!level) return '#E0E0E0';
  const firstLetter = level.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'A': return 'bg-cefr-a-bg';
    case 'B': return 'bg-cefr-b-bg';
    case 'C': return 'bg-cefr-c-bg';
    default: return 'bg-gray-200';
  }
}

export function getCEFRTextColor(level: string): string {
  if (!level) return 'text-gray-700';
  const firstLetter = level.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'A': return 'text-cefr-a-text';
    case 'B': return 'text-cefr-b-text';
    case 'C': return 'text-cefr-c-text';
    default: return 'text-gray-700';
  }
}

export function getCEFRDifficulty(level: string): string {
  if (!level) return 'Unknown';
  const firstLetter = level.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'A': return 'Beginner';
    case 'B': return 'Intermediate';
    case 'C': return 'Advanced';
    default: return 'Unknown';
  }
}
