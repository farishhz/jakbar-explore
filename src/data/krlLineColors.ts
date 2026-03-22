export const krlLineColors: Record<string, string> = {
  'Bogor Line': 'bg-green-600',
  'Cikarang Line': 'bg-blue-600',
  'Tangerang Line': 'bg-purple-600'
}

export const getKrlLineColor = (line: string) => krlLineColors[line] || 'bg-gray-600'
