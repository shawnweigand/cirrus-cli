resource "azurerm_storage_account" "sa" {
    name                     = var.sa_name
    resource_group_name      = var.sa_rg
    location                 = var.sa_location
    account_tier             = var.sa_tier
    account_replication_type = var.sa_replication_type
}