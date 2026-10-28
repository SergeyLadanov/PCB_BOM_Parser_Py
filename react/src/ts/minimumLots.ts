export interface MinimumLotRow {
  Type: string
  Parameters: string[]
  Quantity: number
}

export interface MinimumLotSettings {
  componentType: string
  packageName: string
  statuses: ('green' | 'gray')[]
  minimum: number
}

export const componentTypeLabel = (value: string): string =>
  value === 'Индуктивность' ? 'Катушка индуктивности' : value

export const getPackageName = (row: MinimumLotRow): string => {
  const value = row.Parameters.find(parameter =>
    parameter.startsWith('Корпус:')
  )
    ?.slice('Корпус:'.length)
    .trim()
  return !value || value === '-' || value === '—' ? '' : value
}

export const isValidMinimum = (value: number): boolean =>
  Number.isSafeInteger(value) && value > 0

export const matchingMinimumLotIndexes = (
  rows: MinimumLotRow[],
  statuses: string[],
  settings: MinimumLotSettings
): number[] => {
  if (!isValidMinimum(settings.minimum)) return []
  return rows.flatMap((row, index) =>
    settings.statuses.some(status => status === statuses[index]) &&
    (!settings.componentType ||
      componentTypeLabel(row.Type) === settings.componentType) &&
    (!settings.packageName || getPackageName(row) === settings.packageName)
      ? [index]
      : []
  )
}

// Source quantities are per device. Preserve delimiters, blank lines and designators.
export const raiseSourceMinimum = (
  bom: string,
  sourceLines: Set<number>,
  minimum: number
): string => {
  if (!isValidMinimum(minimum)) return bom
  return bom
    .split('\n')
    .map((line, index) => {
      if (!sourceLines.has(index + 1)) return line
      const separator = line.includes('\t') ? '\t' : ';'
      const position = line.lastIndexOf(separator)
      if (position < 0) return line
      const quantityText = line.slice(position + 1)
      const quantity = Number(quantityText.trim() || '1')
      if (!Number.isSafeInteger(quantity) || quantity >= minimum) return line
      return (
        line.slice(0, position + 1) +
        quantityText.replace(
          /^(\s*)\d*(\s*)$/,
          (_, before: string, after: string) => `${before}${minimum}${after}`
        )
      )
    })
    .join('\n')
}
