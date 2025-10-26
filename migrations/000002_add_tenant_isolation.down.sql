-- Rollback tenant isolation from customer module tables

-- Remove foreign keys
ALTER TABLE customer_contacts DROP CONSTRAINT IF EXISTS customer_contacts_tenant_fk;
ALTER TABLE customer_orders DROP CONSTRAINT IF EXISTS customer_orders_tenant_fk;
ALTER TABLE customer_loyalty DROP CONSTRAINT IF EXISTS customer_loyalty_tenant_fk;
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_tenant_fk;
ALTER TABLE customer_communications DROP CONSTRAINT IF EXISTS customer_communications_tenant_fk;
ALTER TABLE customer_segments DROP CONSTRAINT IF EXISTS customer_segments_tenant_fk;
ALTER TABLE customer_tags DROP CONSTRAINT IF EXISTS customer_tags_tenant_fk;
ALTER TABLE customer_notes DROP CONSTRAINT IF EXISTS customer_notes_tenant_fk;

-- Remove indexes
DROP INDEX IF EXISTS idx_customer_contacts_tenant;
DROP INDEX IF EXISTS idx_customer_orders_tenant;
DROP INDEX IF EXISTS idx_customer_loyalty_tenant;
DROP INDEX IF EXISTS idx_support_tickets_tenant;
DROP INDEX IF EXISTS idx_customer_communications_tenant;
DROP INDEX IF EXISTS idx_customer_segments_tenant;
DROP INDEX IF EXISTS idx_customer_tags_tenant;
DROP INDEX IF EXISTS idx_customer_notes_tenant;

-- Restore original unique constraint
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_tenant_ticket_unique;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_ticket_number_key UNIQUE(ticket_number);

-- Remove tenant_id columns
ALTER TABLE customer_contacts DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_orders DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_loyalty DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE support_tickets DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_communications DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_segments DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_tags DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE customer_notes DROP COLUMN IF EXISTS tenant_id;

