import { StorageValue } from './StorageValue'

export class StorageSettings {
  private _SaveBom: StorageValue<boolean>
  private _SaveFilter: StorageValue<boolean>

  private _Bom: StorageValue<string>

  private _SkipResTol: StorageValue<boolean>
  private _SkipResPwr: StorageValue<boolean>

  private _SkipCapTol: StorageValue<boolean>
  private _SkipCapVolt: StorageValue<boolean>
  private _SkipCapDiel: StorageValue<boolean>

  private _ManSmdResIndex: StorageValue<number>
  private _ManSmdCerCapIndex: StorageValue<number>
  private _ManSmdTantCapIndex: StorageValue<number>

  constructor() {
    const SAVE_BOM_STORAGE_KEY = 'save_bom'
    const SAVE_FILTERS_STORAGE_KEY = 'save_filter'
    const BOM_STORAGE_KEY = 'bom_content'

    const SKIP_RES_TOL_STORAGE_KEY = 'skip_res_tol'
    const SKIP_RES_PWR_STORAGE_KEY = 'skip_res_pwr'

    const SKIP_CAP_TOL_STORAGE_KEY = 'skip_cap_tol'
    const SKIP_CAP_VOLT_STORAGE_KEY = 'skip_cap_volt'
    const SKIP_CAP_DIEL_STORAGE_KEY = 'skip_cap_diel'

    const MAN_SMDRES_INDEX_STORAGE_KEY = 'man_smdres_ind'
    const MAN_SMDCERCAP_INDEX_STORAGE_KEY = 'man_cercap_ind'
    const MAN_SMDTANTCAP_INDEX_STORAGE_KEY = 'man_tantcap_ind'

    this._ManSmdResIndex = new StorageValue<number>(
      MAN_SMDRES_INDEX_STORAGE_KEY,
      0
    )
    this._ManSmdCerCapIndex = new StorageValue<number>(
      MAN_SMDCERCAP_INDEX_STORAGE_KEY,
      0
    )
    this._ManSmdTantCapIndex = new StorageValue<number>(
      MAN_SMDTANTCAP_INDEX_STORAGE_KEY,
      0
    )

    this._SaveBom = new StorageValue<boolean>(SAVE_BOM_STORAGE_KEY, false)
    this._SaveFilter = new StorageValue<boolean>(
      SAVE_FILTERS_STORAGE_KEY,
      false
    )
    this._Bom = new StorageValue<string>(BOM_STORAGE_KEY, '')

    this._SkipResTol = new StorageValue<boolean>(
      SKIP_RES_TOL_STORAGE_KEY,
      false
    )
    this._SkipResPwr = new StorageValue<boolean>(
      SKIP_RES_PWR_STORAGE_KEY,
      false
    )

    this._SkipCapTol = new StorageValue<boolean>(
      SKIP_CAP_TOL_STORAGE_KEY,
      false
    )
    this._SkipCapVolt = new StorageValue<boolean>(
      SKIP_CAP_VOLT_STORAGE_KEY,
      false
    )
    this._SkipCapDiel = new StorageValue<boolean>(
      SKIP_CAP_DIEL_STORAGE_KEY,
      false
    )
  }

  get ManSmdResIndex() {
    return this._ManSmdResIndex.Val
  }

  set ManSmdResIndex(val) {
    this._ManSmdResIndex.Val = val
  }

  get ManSmdCerCapIndex() {
    return this._ManSmdCerCapIndex.Val
  }

  set ManSmdCerCapIndex(val) {
    this._ManSmdCerCapIndex.Val = val
  }

  get ManSmdTantCapIndex() {
    return this._ManSmdTantCapIndex.Val
  }

  set ManSmdTantCapIndex(val) {
    this._ManSmdTantCapIndex.Val = val
  }

  get SaveBom() {
    return this._SaveBom.Val
  }

  set SaveBom(val) {
    this._SaveBom.Val = val
  }

  get SaveFilter() {
    return this._SaveFilter.Val
  }

  set SaveFilter(val) {
    this._SaveFilter.Val = val
  }

  get Bom() {
    return this._Bom.Val
  }

  set Bom(val) {
    if (this.SaveBom) {
      this._Bom.Val = val
    }
  }

  get SkipResTol() {
    return this._SkipResTol.Val
  }

  set SkipResTol(val) {
    if (this.SaveFilter) {
      this._SkipResTol.Val = val
    }
  }

  get SkipResPwr() {
    return this._SkipResPwr.Val
  }

  set SkipResPwr(val) {
    if (this.SaveFilter) {
      this._SkipResPwr.Val = val
    }
  }

  get SkipCapVolt() {
    return this._SkipCapVolt.Val
  }

  set SkipCapVolt(val) {
    if (this.SaveFilter) {
      this._SkipCapVolt.Val = val
    }
  }

  get SkipCapTol() {
    return this._SkipCapTol.Val
  }

  set SkipCapTol(val) {
    if (this.SaveFilter) {
      this._SkipCapTol.Val = val
    }
  }

  get SkipCapDiel() {
    return this._SkipCapDiel.Val
  }

  set SkipCapDiel(val) {
    if (this.SaveFilter) {
      this._SkipCapDiel.Val = val
    }
  }

  LoadConfig() {
    if (!this.SaveBom) {
      this._Bom.Clear()
    }

    if (!this.SaveFilter) {
      this._SkipCapDiel.Clear()
      this._SkipCapTol.Clear()
      this._SkipCapVolt.Clear()
      this._SkipResPwr.Clear()
      this._SkipResTol.Clear()
    }
  }
}
