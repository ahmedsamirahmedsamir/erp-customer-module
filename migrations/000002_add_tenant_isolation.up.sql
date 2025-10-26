-- Add tenant isolation to customer module tables
-- This migration adds tenant_id columns and updates constraints for multi-tenant support

-- Add tenant_id to all customer module tables
ALTER TABLE customer_contacts ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_communications ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_segments ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_tags ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE customer_notes ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- Update unique constraints to include tenant_id
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_ticket_number_key;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_tenant_ticket_unique UNIQUE(tenant_id, ticket_number);

-- Add indexes on tenant_id for all tables
CREATE INDEX IF NOT EXISTS idx_customer_contacts_tenant ON customer_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_tenant ON customer_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_tenant ON customer_loyalty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant ON support_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_tenant ON customer_communications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_tenant ON customer_segments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_tags_tenant ON customer_tags(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_tenant ON customer_notes(tenant_id);

-- Add foreign keys to tenants table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_contacts_tenant_fk') THEN
        ALTER TABLE customer_contacts ADD CONSTRAINT customer_contacts_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_orders_tenant_fk') THEN
        ALTER TABLE customer_orders ADD CONSTRAINT customer_orders_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_loyalty_tenant_fk') THEN
        ALTER TABLE customer_loyalty ADD CONSTRAINT customer_loyalty_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_tenant_fk') THEN
        ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_communications_tenant_fk') THEN
        ALTER TABLE customer_communications ADD CONSTRAINT customer_communications_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_segments_tenant_fk') THEN
        ALTER TABLE customer_segments ADD CONSTRAINT customer_segments_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_tags_tenant_fk') THEN
        ALTER TABLE customer_tags ADD CONSTRAINT customer_tags_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_notes_tenant_fk') THEN
        ALTER TABLE customer_notes ADD CONSTRAINT customer_notes_tenant_fk 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Make tenant_id NOT NULL after data migration (commented out - run manually after migrating data)
-- ALTER TABLE customer_contacts ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_orders ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_loyalty ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE support_tickets ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_communications ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_segments ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_tags ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE customer_notes ALTER COLUMN tenant_id SET NOT NULL;

