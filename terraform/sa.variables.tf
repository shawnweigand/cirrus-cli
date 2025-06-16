variable "sa_name" {
  description = "Name of the Azure Storage Account"
  type        = string
}
variable "sa_location" {
  description = "Location of the Azure Storage Account"
  type        = string
}
variable "sa_rg" {
  description = "Resource group name for the Azure Storage Account"
  type        = string
}
variable "sa_tier" {
  description = "Tier for the Azure Storage Account"
  type        = string
  default     = "Standard"
}
variable "sa_replication_type" {
  description = "Replication type for the Azure Storage Account"
  type        = string
  default     = "LRS"
}