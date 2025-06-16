variable "akv_name" {
  description = "Name of the Azure Key Vault"
  type        = string
}
variable "akv_location" {
  description = "Location of the Azure Key Vault"
  type        = string
}
variable "akv_rg" {
  description = "Resource group name for the Azure Key Vault"
  type        = string
}
variable "akv_sku" {
  description = "SKU for the Azure Key Vault"
  type        = string
  default     = "standard"
}
variable "akv_tenant_id" {
  description = "Tenant ID for the Azure Key Vault"
  type        = string
}