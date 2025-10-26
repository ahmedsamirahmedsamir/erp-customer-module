# ERP Customer Module

A comprehensive customer relationship management (CRM) module for the LinearBits ERP system.

## Features

- Customer database and profiles
- Order history and analytics
- Loyalty program management
- Support ticket system
- Customer communication
- Sales analytics and reporting

## Installation

This module can be installed through the LinearBits ERP Marketplace or directly from GitHub.

## Usage

Once installed, the Customer module will be available in your ERP navigation menu under "Customers".

## API Endpoints

- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `PUT /api/v1/customers/{id}` - Update customer
- `GET /api/v1/customers/{id}/orders` - Customer order history
- `GET /api/v1/customers/{id}/loyalty` - Loyalty program data
- `GET /api/v1/customers/{id}/tickets` - Support tickets
- `POST /api/v1/customers/{id}/tickets` - Create support ticket

## Permissions

- `customers.view` - View customers
- `customers.create` - Create customers
- `customers.edit` - Edit customers
- `customers.delete` - Delete customers
- `customers.orders.view` - View customer orders
- `customers.loyalty.view` - View loyalty data
- `customers.tickets.view` - View support tickets
- `customers.tickets.create` - Create support tickets

## Database Tables

This module uses the following database tables:
- `customers` - Customer profiles
- `customer_addresses` - Customer addresses
- `customer_contacts` - Customer contact information
- `customer_orders` - Customer order history
- `customer_loyalty` - Loyalty program data
- `support_tickets` - Support ticket system
- `customer_communications` - Communication history

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the LinearBits team.
