const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const ts = require('typescript')
const path = require('node:path')

const moduleUnderTest = { exports: {} }
const source = fs.readFileSync(
  path.join(__dirname, '../src/ts/minimumLots.ts'),
  'utf8'
)
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
})
new Function('exports', compiled.outputText)(moduleUnderTest.exports)
const {
  matchingMinimumLotIndexes,
  raiseSourceMinimum,
  getPackageName,
  isValidMinimum
} = moduleUnderTest.exports

const rows = [
  { Type: 'Резистор', Parameters: ['Корпус: 0603'], Quantity: 2 },
  { Type: 'Резистор', Parameters: ['Корпус: 0805'], Quantity: 20 },
  { Type: 'Конденсатор', Parameters: ['Корпус: 0603'], Quantity: 3 },
  { Type: 'Индуктивность', Parameters: ['Корпус: 0603'], Quantity: 1 },
  { Type: 'Катушка индуктивности', Parameters: ['Корпус: 0805'], Quantity: 1 }
]
const statuses = ['gray', 'green', 'yellow', 'gray', 'green']
const settings = {
  componentType: '',
  packageName: '',
  statuses: ['green', 'gray'],
  minimum: 10
}

test('type and package filters work independently and intersect; yellow stays excluded', () => {
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, settings),
    [0, 1, 3, 4]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      componentType: 'Резистор'
    }),
    [0, 1]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      packageName: '0603'
    }),
    [0, 3]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      componentType: 'Резистор',
      packageName: '0603'
    }),
    [0]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      componentType: 'Катушка индуктивности'
    }),
    [3, 4]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      statuses: ['green']
    }),
    [1, 4]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, {
      ...settings,
      statuses: ['gray']
    }),
    [0, 3]
  )
  assert.deepEqual(
    matchingMinimumLotIndexes(rows, statuses, { ...settings, statuses: [] }),
    []
  )
})

test('missing packages and invalid minima cannot cause accidental changes', () => {
  for (const value of [
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1
  ]) {
    assert.equal(isValidMinimum(value), false)
    assert.deepEqual(
      matchingMinimumLotIndexes(rows, statuses, {
        ...settings,
        minimum: value
      }),
      []
    )
  }
  for (const Parameters of [[], ['Корпус: -'], ['Корпус: —'], ['Корпус: ']]) {
    assert.equal(getPackageName({ Parameters }), '')
  }
})

test('source edits preserve duplicate rows, designators, separators, whitespace and blank lines', () => {
  const source =
    'R1;10k 0603; 2 \r\n\r\nКонденсатор\t0.1uF 0603\t3\r\nR1;10k 0603; 2 \r\nL1;10uH;20\r\n'
  const expected =
    'R1;10k 0603; 10 \r\n\r\nКонденсатор\t0.1uF 0603\t10\r\nR1;10k 0603; 2 \r\nL1;10uH;20\r\n'
  const selected = new Set([1, 3, 5])
  assert.equal(raiseSourceMinimum(source, selected, 10), expected)
  assert.equal(raiseSourceMinimum(expected, selected, 10), expected)
  assert.equal(raiseSourceMinimum(source, selected, 0), source)
})

test('source line mapping remains usable after a row is removed', () => {
  const sourceAfterDelete = '\nR2;22k 0603;2\nC1;0.1uF 0603;30'
  assert.equal(
    raiseSourceMinimum(sourceAfterDelete, new Set([2, 3]), 10),
    '\nR2;22k 0603;10\nC1;0.1uF 0603;30'
  )
})
