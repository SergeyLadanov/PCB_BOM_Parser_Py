export class StorageValue<T> {
  private Key: string = ''
  private Value: T

  constructor(key: string, init_value: T) {
    this.Key = key
    this.Value = init_value
  }

  get Val() {
    const Temp = localStorage.getItem(this.Key)

    if (Temp) {
      if (typeof this.Value == 'number') {
        const parsed = Number(Temp)
        return isNaN(parsed) ? this.Value : (parsed as T)
      }

      if (typeof this.Value == 'string') {
        return Temp as T
      }

      if (typeof this.Value == 'boolean') {
        return (Temp === 'true') as T
      }
    }

    return this.Value
  }

  set Val(new_val: T) {
    localStorage.setItem(this.Key, String(new_val))
  }

  Clear() {
    localStorage.removeItem(this.Key)
  }
}
