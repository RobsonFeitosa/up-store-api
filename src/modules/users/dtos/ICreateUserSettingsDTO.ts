export default interface ICreateUserSettingsDTO {
  level: 1 | 2
  cpf?: string
  phone_number?: string
  actived: boolean
}
