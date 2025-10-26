package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
	sdk "github.com/linearbits/erp-backend/pkg/module-sdk"
	"go.uber.org/zap"
)

// CustomerPlugin implements the ModulePlugin interface
type CustomerPlugin struct {
	db      *sqlx.DB
	logger  *zap.Logger
	handler *CustomerHandler
}

// NewCustomerPlugin creates a new plugin instance
func NewCustomerPlugin() sdk.ModulePlugin {
	return &CustomerPlugin{}
}

// Initialize initializes the plugin
func (p *CustomerPlugin) Initialize(db *sqlx.DB, logger *zap.Logger) error {
	p.db = db
	p.logger = logger
	p.handler = NewCustomerHandler(db, logger)
	p.logger.Info("Customer module initialized")
	return nil
}

// GetModuleCode returns the module code
func (p *CustomerPlugin) GetModuleCode() string {
	return "customer"
}

// GetModuleVersion returns the module version
func (p *CustomerPlugin) GetModuleVersion() string {
	return "1.0.0"
}

// Cleanup performs cleanup
func (p *CustomerPlugin) Cleanup() error {
	p.logger.Info("Cleaning up customer module")
	return nil
}

// GetHandler returns a handler function for a given route and method
func (p *CustomerPlugin) GetHandler(route string, method string) (http.HandlerFunc, error) {
	route = strings.TrimPrefix(route, "/")
	method = strings.ToUpper(method)

	handlers := map[string]http.HandlerFunc{
		"GET /customers":         p.handler.GetCustomers,
		"POST /customers":        p.handler.CreateCustomer,
		"GET /customers/{id}":    p.handler.GetCustomer,
		"PUT /customers/{id}":    p.handler.UpdateCustomer,
		"DELETE /customers/{id}": p.handler.DeleteCustomer,
		"GET /support-tickets":   p.handler.GetSupportTickets,
		"POST /support-tickets":  p.handler.CreateSupportTicket,
	}

	key := method + " " + route
	if handler, ok := handlers[key]; ok {
		return handler, nil
	}

	// Try pattern matching
	for pattern, handler := range handlers {
		if matchRoute(pattern, key) {
			return handler, nil
		}
	}

	return nil, fmt.Errorf("handler not found for route: %s %s", method, route)
}

func matchRoute(pattern, actual string) bool {
	patternParts := strings.Split(pattern, " ")
	actualParts := strings.Split(actual, " ")

	if len(patternParts) != 2 || len(actualParts) != 2 {
		return false
	}

	if patternParts[0] != actualParts[0] {
		return false
	}

	patternPath := strings.Split(patternParts[1], "/")
	actualPath := strings.Split(actualParts[1], "/")

	if len(patternPath) != len(actualPath) {
		return false
	}

	for i := range patternPath {
		if patternPath[i] != actualPath[i] {
			if !strings.HasPrefix(patternPath[i], "{") || !strings.HasSuffix(patternPath[i], "}") {
				return false
			}
		}
	}

	return true
}

// Handler is the exported symbol
var Handler = NewCustomerPlugin
