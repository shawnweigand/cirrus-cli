resource "azurerm_key_vault" "akv" {
    name                  = var.akv_name
    location              = var.akv_location
    resource_group_name   = var.akv_rg
    sku_name              = var.akv_sku
    tenant_id             = var.akv_tenant_id
}