export enum ApiUrls {
  API_URL = './bom_data',
  DOWNLOAD_CSV_URL = './download_csv'
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

export interface BomRequest {
  bom: string
  count: number
  tech_res: number
  res_filter: ResFilter
  cap_filter: CapFilter
}

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
