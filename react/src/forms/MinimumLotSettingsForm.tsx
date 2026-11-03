import React, { useState } from 'react'
import {
  MinimumLotRow,
  MinimumLotSettings,
  componentTypeLabel,
  getPackageName,
  isValidMinimum,
  matchingMinimumLotIndexes
} from '../ts/minimumLots'

interface Props {
  rows: MinimumLotRow[]
  statuses: string[]
  canUpdateSource: boolean
  onApply: (settings: MinimumLotSettings, updateSource: boolean) => void
}

export default function MinimumLotSettingsForm({
  rows,
  statuses,
  canUpdateSource,
  onApply
}: Props) {
  const [componentType, setComponentType] = useState('')
  const [packageName, setPackageName] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<
    ('green' | 'gray')[]
  >(['green', 'gray'])
  const [minimum, setMinimum] = useState('10')
  const [updateSource, setUpdateSource] = useState(false)
  const [message, setMessage] = useState('')
  const types = Array.from(
    new Set(rows.map(row => componentTypeLabel(row.Type)))
  ).sort()
  const packages = Array.from(
    new Set(
      rows
        .filter(
          row =>
            !componentType || componentTypeLabel(row.Type) === componentType
        )
        .map(getPackageName)
        .filter(Boolean)
    )
  ).sort()
  const settings: MinimumLotSettings = {
    componentType,
    packageName,
    statuses: selectedStatuses,
    minimum: Number(minimum)
  }
  const valid = isValidMinimum(settings.minimum)
  const matching = matchingMinimumLotIndexes(rows, statuses, settings)
  const changedCount = matching.filter(
    index => rows[index].Quantity < settings.minimum
  ).length

  return (
    <div onChange={() => setMessage('')}>
      <p className="small text-body-secondary">
        Количество ниже минимума будет увеличено. Можно выбрать тип, корпус или
        оба условия. Коррекция итогового списка действует до повторной
        обработки.
      </p>
      <label className="form-label" htmlFor="minimum-lot-type">
        Тип компонента
      </label>
      <select
        id="minimum-lot-type"
        className="form-select form-select-sm mb-2"
        value={componentType}
        onChange={event => {
          setComponentType(event.target.value)
          setPackageName('')
        }}
      >
        <option value="">Все типы</option>
        {types.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <label className="form-label" htmlFor="minimum-lot-package">
        Корпус
      </label>
      <select
        id="minimum-lot-package"
        className="form-select form-select-sm mb-2"
        value={packageName}
        onChange={event => setPackageName(event.target.value)}
      >
        <option value="">Все корпуса</option>
        {packages.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <label className="form-label" htmlFor="minimum-lot-quantity">
        Минимальное количество, шт.
      </label>
      <input
        id="minimum-lot-quantity"
        className={`form-control form-control-sm mb-2${valid ? '' : ' is-invalid'}`}
        type="number"
        min="1"
        max={Number.MAX_SAFE_INTEGER}
        step="1"
        value={minimum}
        aria-invalid={!valid}
        aria-describedby={!valid ? 'minimum-lot-error' : undefined}
        onChange={event => setMinimum(event.target.value)}
      />
      {!valid && (
        <p id="minimum-lot-error" className="text-danger small">
          Введите целое положительное количество.
        </p>
      )}
      <fieldset>
        <legend className="fs-6 mb-1">Какие строки скорректировать?</legend>
        {(['green', 'gray'] as const).map(status => (
          <div className="form-check" key={status}>
            <input
              id={`minimum-lot-${status}`}
              className="form-check-input"
              type="checkbox"
              checked={selectedStatuses.includes(status)}
              onChange={event =>
                setSelectedStatuses(
                  event.target.checked
                    ? [...selectedStatuses, status]
                    : selectedStatuses.filter(value => value !== status)
                )
              }
            />
            <label
              className="form-check-label"
              htmlFor={`minimum-lot-${status}`}
            >
              {status === 'green' ? 'С зелёной отметкой' : 'С серой отметкой'}
            </label>
          </div>
        ))}
      </fieldset>
      <p className="small text-body-secondary mt-1">
        Строки с жёлтой отметкой не изменяются.
      </p>
      <div className="form-check mt-2">
        <input
          id="minimum-lot-source"
          className="form-check-input"
          type="checkbox"
          checked={updateSource && canUpdateSource}
          disabled={!canUpdateSource}
          onChange={event => setUpdateSource(event.target.checked)}
        />
        <label className="form-check-label" htmlFor="minimum-lot-source">
          Применить минимум также к исходному списку
        </label>
      </div>
      <p className="small text-body-secondary mt-1">
        {canUpdateSource
          ? 'В исходном списке минимум применяется к количеству на одно устройство. При повторной обработке учитываются масштабирование и запас.'
          : 'Исходный список отличается от обработанного. Для его изменения сначала нажмите «Обработать».'}
      </p>
      <p className="small mb-2">
        Подходит строк: {matching.length}. Увеличится в итоговом списке:{' '}
        {changedCount}.
      </p>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={
          !valid ||
          matching.length === 0 ||
          (changedCount === 0 && !(updateSource && canUpdateSource))
        }
        onClick={() => {
          onApply(settings, updateSource && canUpdateSource)
          setMessage(
            `Готово. Увеличено строк в итоговом списке: ${changedCount}.${updateSource && canUpdateSource ? ' Минимум применён и к исходному списку.' : ''}`
          )
        }}
      >
        Скорректировать
      </button>
      {message && (
        <p className="small text-success mt-2 mb-0" role="status">
          {message}
        </p>
      )}
    </div>
  )
}
