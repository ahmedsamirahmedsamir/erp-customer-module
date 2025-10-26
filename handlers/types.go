package main

import "time"

// Customer represents a customer
type Customer struct {
	ID             int       `json:"id"`
	CustomerNumber string    `json:"customer_number"`
	CompanyName    *string   `json:"company_name"`
	FirstName      *string   `json:"first_name"`
	LastName       *string   `json:"last_name"`
	Email          *string   `json:"email"`
	Phone          *string   `json:"phone"`
	Mobile         *string   `json:"mobile"`
	Website        *string   `json:"website"`
	CustomerType   string    `json:"customer_type"`
	Status         string    `json:"status"`
	CreditLimit    *float64  `json:"credit_limit"`
	PaymentTerms   *string   `json:"payment_terms"`
	TaxID          *string   `json:"tax_id"`
	Notes          *string   `json:"notes"`
	CreatedBy      int       `json:"created_by"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// CustomerAddress represents a customer address
type CustomerAddress struct {
	ID           int       `json:"id"`
	CustomerID   int       `json:"customer_id"`
	AddressType  string    `json:"address_type"`
	AddressLine1 string    `json:"address_line1"`
	AddressLine2 *string   `json:"address_line2"`
	City         string    `json:"city"`
	State        string    `json:"state"`
	Country      string    `json:"country"`
	PostalCode   string    `json:"postal_code"`
	IsPrimary    bool      `json:"is_primary"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CustomerContact represents a customer contact
type CustomerContact struct {
	ID          int       `json:"id"`
	CustomerID  int       `json:"customer_id"`
	ContactType string    `json:"contact_type"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Title       *string   `json:"title"`
	Email       *string   `json:"email"`
	Phone       *string   `json:"phone"`
	Mobile      *string   `json:"mobile"`
	IsPrimary   bool      `json:"is_primary"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// SupportTicket represents a customer support ticket
type SupportTicket struct {
	ID           int        `json:"id"`
	TicketNumber string     `json:"ticket_number"`
	CustomerID   int        `json:"customer_id"`
	Subject      string     `json:"subject"`
	Description  string     `json:"description"`
	Priority     string     `json:"priority"`
	Status       string     `json:"status"`
	Category     *string    `json:"category"`
	AssignedTo   *int       `json:"assigned_to"`
	Resolution   *string    `json:"resolution"`
	ResolvedAt   *time.Time `json:"resolved_at"`
	CreatedBy    int        `json:"created_by"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// CustomerSegment represents a customer segment
type CustomerSegment struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	Criteria    *string   `json:"criteria"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CustomerTag represents a customer tag
type CustomerTag struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Color       *string   `json:"color"`
	Description *string   `json:"description"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
