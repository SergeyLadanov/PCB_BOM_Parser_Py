export enum ApiUrls {
  API_URL = './bom_data',
  DOWNLOAD_CSV_URL = './download_csv',
  DOWNLOAD_EXCEL_URL = './download_excel',
  MANUFACTURERS_LIST_URL = './get_manufacturers_info'
}

export interface ResFilter {
  skip_tol: boolean
  skip_power: boolean
}

export interface CapFilter {
  skip_tol: boolean
  skip_dielectric: boolean
  skip_voltage: boolean
}

export interface ManufacturersSettings {
  smd_res: string
  smd_cer_cap: string
  smd_tant_cap: string
}

export interface BomRequest {
  bom: string
  count: number
  tech_res: number
  res_filter: ResFilter
  cap_filter: CapFilter
  man_settings: ManufacturersSettings
}

export type ExcelColumnKey =
  | 'number'
  | 'designator'
  | 'source_name'
  | 'component_type'
  | 'parameters'
  | 'english_name'
  | 'russian_name'
  | 'manufacturer_part_name'
  | 'manufacturer'
  | 'quantity'
  | 'store_elitan'
  | 'store_chipdip'
  | 'store_platan'
  | 'store_promelec'
  | 'store_dko_electronshik'

export const EXCEL_COLUMN_KEYS: ExcelColumnKey[] = [
  'number',
  'designator',
  'source_name',
  'component_type',
  'parameters',
  'english_name',
  'russian_name',
  'manufacturer_part_name',
  'manufacturer',
  'quantity',
  'store_elitan',
  'store_chipdip',
  'store_platan',
  'store_promelec',
  'store_dko_electronshik'
]

export const REQUIRED_EXCEL_COLUMN_KEYS: ExcelColumnKey[] = [
  'number',
  'source_name',
  'quantity'
]

export const DEFAULT_EXCEL_COLUMN_KEYS: ExcelColumnKey[] = EXCEL_COLUMN_KEYS

export interface ResultLink {
  order_link: string
  order_name: string
  store_name: string
}

export interface ManufacturerInfo {
  manufacturer_name: string
  component_name: string
}

export interface ParseResult {
  designator: string
  type: string
  count: number
  en: string
  ru: string
  elitan: string
  params: string[]
  name: string
  ordering: ResultLink[]
  manufacturer_info: ManufacturerInfo
}

export interface ManufacturersList {
  res_smd: string[]
  cer_cap_smd: string[]
  tant_cap_smd: string[]
}
