package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	sdk "github.com/linearbits/erp-backend/pkg/module-sdk"
	"go.uber.org/zap"
)

// CustomerHandler handles all customer-related HTTP requests
type CustomerHandler struct {
	db     *sqlx.DB
	logger *zap.Logger
}

// NewCustomerHandler creates a new customer handler
func NewCustomerHandler(db *sqlx.DB, logger *zap.Logger) *CustomerHandler {
	return &CustomerHandler{db: db, logger: logger}
}

// GetCustomers retrieves all customers
func (h *CustomerHandler) GetCustomers(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")
	limit := r.URL.Query().Get("limit")

	if limit == "" {
		limit = "50"
	}

	qb := sdk.NewQueryBuilder("SELECT * FROM customers WHERE 1=1")
	qb.AddOptionalCondition("status = $%d", status)
	if search != "" {
		qb.AddCondition("(first_name ILIKE $%d OR last_name ILIKE $%d OR company_name ILIKE $%d OR email ILIKE $%d)", "%"+search+"%")
	}

	query, args := qb.Build()
	query += " ORDER BY created_at DESC LIMIT " + limit

	var customers []Customer
	if err := h.db.Select(&customers, query, args...); err != nil {
		h.logger.Error("Failed to fetch customers", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to fetch customers")
		return
	}

	sdk.WriteSuccess(w, map[string]interface{}{
		"customers": customers,
		"count":     len(customers),
	})
}

// GetCustomer retrieves a single customer
func (h *CustomerHandler) GetCustomer(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		sdk.WriteBadRequest(w, "Invalid customer ID")
		return
	}

	var customer Customer
	err = h.db.Get(&customer, "SELECT * FROM customers WHERE id = $1", id)
	if err != nil {
		if sdk.IsNoRows(err) {
			sdk.WriteNotFound(w, "Customer not found")
			return
		}
		h.logger.Error("Failed to fetch customer", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to fetch customer")
		return
	}

	sdk.WriteSuccess(w, customer)
}

// CreateCustomer creates a new customer
func (h *CustomerHandler) CreateCustomer(w http.ResponseWriter, r *http.Request) {
	var req Customer
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sdk.WriteBadRequest(w, "Invalid request body")
		return
	}

	// Generate customer number
	customerNumber := fmt.Sprintf("CUST-%d", time.Now().Unix())

	query := `
		INSERT INTO customers (customer_number, company_name, first_name, last_name, email,
		                       phone, mobile, website, customer_type, credit_limit, payment_terms,
		                       tax_id, notes, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 1)
		RETURNING id, created_at, updated_at
	`

	var id int
	var createdAt, updatedAt time.Time

	err := h.db.QueryRow(query, customerNumber, req.CompanyName, req.FirstName, req.LastName,
		req.Email, req.Phone, req.Mobile, req.Website, req.CustomerType, req.CreditLimit,
		req.PaymentTerms, req.TaxID, req.Notes).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		h.logger.Error("Failed to create customer", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to create customer")
		return
	}

	sdk.WriteCreated(w, map[string]interface{}{
		"id":              id,
		"customer_number": customerNumber,
		"created_at":      createdAt,
		"updated_at":      updatedAt,
		"message":         "Customer created successfully",
	})
}

// UpdateCustomer updates an existing customer
func (h *CustomerHandler) UpdateCustomer(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		sdk.WriteBadRequest(w, "Invalid customer ID")
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sdk.WriteBadRequest(w, "Invalid request body")
		return
	}

	// Check if exists
	var exists bool
	h.db.Get(&exists, "SELECT EXISTS(SELECT 1 FROM customers WHERE id = $1)", id)
	if !exists {
		sdk.WriteNotFound(w, "Customer not found")
		return
	}

	// Build dynamic update
	updates := []string{}
	args := []interface{}{}
	argIdx := 1

	allowedFields := map[string]bool{
		"company_name": true, "first_name": true, "last_name": true,
		"email": true, "phone": true, "mobile": true,
		"status": true, "credit_limit": true, "notes": true,
	}

	for key, val := range req {
		if allowedFields[key] {
			updates = append(updates, fmt.Sprintf("%s = $%d", key, argIdx))
			args = append(args, val)
			argIdx++
		}
	}

	if len(updates) == 0 {
		sdk.WriteBadRequest(w, "No fields to update")
		return
	}

	query := "UPDATE customers SET " + updates[0]
	for i := 1; i < len(updates); i++ {
		query += ", " + updates[i]
	}
	query += fmt.Sprintf(" WHERE id = $%d", argIdx)
	args = append(args, id)

	_, err = h.db.Exec(query, args...)
	if err != nil {
		h.logger.Error("Failed to update customer", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to update customer")
		return
	}

	sdk.WriteSuccess(w, map[string]interface{}{"message": "Customer updated successfully"})
}

// DeleteCustomer soft deletes a customer
func (h *CustomerHandler) DeleteCustomer(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		sdk.WriteBadRequest(w, "Invalid customer ID")
		return
	}

	_, err = h.db.Exec("UPDATE customers SET status = 'inactive' WHERE id = $1", id)
	if err != nil {
		h.logger.Error("Failed to delete customer", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to delete customer")
		return
	}

	sdk.WriteSuccess(w, map[string]interface{}{"message": "Customer deleted successfully"})
}

// GetSupportTickets retrieves support tickets
func (h *CustomerHandler) GetSupportTickets(w http.ResponseWriter, r *http.Request) {
	customerID := r.URL.Query().Get("customer_id")
	status := r.URL.Query().Get("status")

	qb := sdk.NewQueryBuilder("SELECT * FROM support_tickets WHERE 1=1")
	qb.AddOptionalCondition("customer_id = $%d", customerID)
	qb.AddOptionalCondition("status = $%d", status)

	query, args := qb.Build()
	query += " ORDER BY created_at DESC LIMIT 50"

	var tickets []SupportTicket
	if err := h.db.Select(&tickets, query, args...); err != nil {
		h.logger.Error("Failed to fetch support tickets", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to fetch support tickets")
		return
	}

	sdk.WriteSuccess(w, map[string]interface{}{
		"tickets": tickets,
		"count":   len(tickets),
	})
}

// CreateSupportTicket creates a new support ticket
func (h *CustomerHandler) CreateSupportTicket(w http.ResponseWriter, r *http.Request) {
	var req SupportTicket
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sdk.WriteBadRequest(w, "Invalid request body")
		return
	}

	if err := sdk.ValidateRequired(map[string]interface{}{
		"subject":     req.Subject,
		"description": req.Description,
	}); err != nil {
		sdk.WriteBadRequest(w, err.Error())
		return
	}

	ticketNumber := fmt.Sprintf("TKT-%d", time.Now().Unix())

	query := `
		INSERT INTO support_tickets (ticket_number, customer_id, subject, description, priority, category, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, 1)
		RETURNING id, created_at
	`

	var id int
	var createdAt time.Time

	err := h.db.QueryRow(query, ticketNumber, req.CustomerID, req.Subject, req.Description,
		req.Priority, req.Category).Scan(&id, &createdAt)

	if err != nil {
		h.logger.Error("Failed to create support ticket", zap.Error(err))
		sdk.WriteInternalError(w, "Failed to create support ticket")
		return
	}

	sdk.WriteCreated(w, map[string]interface{}{
		"id":            id,
		"ticket_number": ticketNumber,
		"created_at":    createdAt,
		"message":       "Support ticket created successfully",
	})
}
