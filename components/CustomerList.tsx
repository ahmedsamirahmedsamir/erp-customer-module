import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Users, Edit, Trash2, Eye, Mail, Phone, Building } from 'lucide-react'
import { DataTable, api } from '@erp-modules/shared'

interface Customer {
  id: string
  customer_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  customer_type: string
  status: string
  credit_limit: number
  payment_terms: string
  tax_id: string
  notes: string
  created_at: string
  updated_at: string
}

interface CustomerListResponse {
  success: boolean
  data: {
    customers: Customer[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export function CustomerList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // Fetch customers
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', currentPage, searchQuery, selectedStatus, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })
      if (searchQuery) params.append('search', searchQuery)
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedType) params.append('customer_type', selectedType)
      
      const response = await api.get(`/customers?${params}`)
      return response.data as CustomerListResponse
    },
  })

  // Delete customer mutation
  const deleteCustomer = useMutation({
    mutationFn: async (customerId: string) => {
      await api.delete(`/customers/${customerId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer.mutate(customerId)
    }
  }

  const columns = [
    {
      accessorKey: 'customer_number',
      header: 'Customer',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-600 mr-2" />
          <div>
            <div className="font-medium text-gray-900">
              {row.getValue('first_name')} {row.getValue('last_name')}
            </div>
            <div className="text-sm text-gray-500">{row.getValue('customer_number')}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Building className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">
            {row.getValue('company') || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900">
            <Mail className="h-3 w-3 text-gray-400 mr-1" />
            {row.getValue('email') || 'N/A'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-3 w-3 text-gray-400 mr-1" />
            {row.getValue('phone') || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'customer_type',
      header: 'Type',
      cell: ({ row }: any) => {
        const type = row.getValue('customer_type')
        return (
          <span className={`px-2 py-1 text-xs rounded ${
            type === 'individual' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {type}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status')
        return (
          <span className={`px-2 py-1 text-xs rounded ${
            status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'credit_limit',
      header: 'Credit Limit',
      cell: ({ row }: any) => (
        <span className="font-medium text-gray-900">
          ${row.getValue('credit_limit').toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'payment_terms',
      header: 'Payment Terms',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-500">
          {row.getValue('payment_terms').replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-500">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {/* Navigate to customer detail */}}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* Navigate to edit customer */}}
            className="p-1 text-green-600 hover:text-green-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const customers = customersData?.data.customers || []
  const pagination = customersData?.data.pagination

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>
        <button
          onClick={() => {/* Navigate to new customer */}}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedStatus('')
              setSelectedType('')
            }}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={customers}
          columns={columns}
          isLoading={isLoading}
        />
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
