-- Customer Module Database Schema
-- This migration creates module-specific tables for the customer management system
-- Note: customers and customer_addresses are in core (004_create_core_essential_tables.sql)

-- Customer Contacts
CREATE TABLE IF NOT EXISTS customer_contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    contact_type VARCHAR(50) DEFAULT 'primary', -- primary, billing, technical, etc.
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    title VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Orders (summary of orders for customer)
CREATE TABLE IF NOT EXISTS customer_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_id INTEGER NOT NULL, -- references sales_orders table
    order_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Loyalty Program
CREATE TABLE IF NOT EXISTS customer_loyalty (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    loyalty_tier VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum
    points_balance INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    last_activity_date DATE,
    membership_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
    category VARCHAR(50), -- technical, billing, general, etc.
    assigned_to INTEGER, -- references users table
    resolution TEXT,
    resolved_at TIMESTAMP,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Communications
CREATE TABLE IF NOT EXISTS customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    communication_type VARCHAR(50) NOT NULL, -- email, phone, sms, mail, in_person
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    subject VARCHAR(255),
    content TEXT,
    communication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER, -- who handled the communication
    ticket_id INTEGER REFERENCES support_tickets(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Segments
CREATE TABLE IF NOT EXISTS customer_segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria TEXT, -- JSON criteria for segment membership
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Tags
CREATE TABLE IF NOT EXISTS customer_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7), -- hex color code
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Notes
CREATE TABLE IF NOT EXISTS customer_notes (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    note_type VARCHAR(50) DEFAULT 'general', -- general, call, meeting, issue, etc.
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Segment Memberships (many-to-many)
CREATE TABLE IF NOT EXISTS customer_segment_memberships (
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    segment_id INTEGER NOT NULL REFERENCES customer_segments(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, segment_id)
);

-- Customer Tag Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS customer_tag_assignments (
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    tag_id INTEGER NOT NULL REFERENCES customer_tags(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_customer ON customer_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_date ON customer_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_customer ON customer_loyalty(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer ON customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_date ON customer_communications(communication_date);
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON customer_notes(customer_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_customer_contacts_updated_at BEFORE UPDATE ON customer_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_loyalty_updated_at BEFORE UPDATE ON customer_loyalty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_segments_updated_at BEFORE UPDATE ON customer_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_tags_updated_at BEFORE UPDATE ON customer_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_notes_updated_at BEFORE UPDATE ON customer_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
