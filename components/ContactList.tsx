import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Mail, Phone, User, Building } from 'lucide-react'
import { 
  api, DataTable, LoadingSpinner, StatusBadge, 
  ActionButtons, EmptyState 
} from '@erp-modules/shared'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  customer_id: string
  customer_name: string
  first_name: string
  last_name: string
  title: string
  email: string
  phone: string
  mobile: string
  department: string
  is_primary: boolean
  status: 'active' | 'inactive'
  created_at: string
}

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['customer-contacts', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      const response = await api.get<{ data: Contact[] }>(
        `/api/v1/customer/contacts?${params.toString()}`
      )
      return response.data.data
    },
  })

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/customer/contacts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-contacts'] })
      toast.success('Contact deleted successfully')
    },
  })

  const columns = [
    {
      accessorKey: 'first_name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-blue-600 mr-2" />
          <div>
            <div className="font-medium text-gray-900">
              {row.getValue('first_name')} {row.original.last_name}
            </div>
            <div className="text-sm text-gray-500">{row.original.title}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Building className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{row.getValue('customer_name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{row.getValue('email')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{row.getValue('phone')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">{row.getValue('department')}</span>
      ),
    },
    {
      accessorKey: 'is_primary',
      header: 'Primary',
      cell: ({ row }: any) => (
        row.getValue('is_primary') ? (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Primary</span>
        ) : null
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <ActionButtons
          onView={() => console.log('View', row.original)}
          onEdit={() => console.log('Edit', row.original)}
          onDelete={() => deleteContact.mutate(row.original.id)}
        />
      ),
    },
  ]

  if (isLoading) {
    return <LoadingSpinner text="Loading contacts..." />
  }

  return (
    <div className="space-y-6">
      {contacts && contacts.length > 0 ? (
        <DataTable
          data={contacts}
          columns={columns}
          enablePagination={true}
          enableSorting={true}
        />
      ) : (
        <EmptyState
          icon={User}
          title="No contacts found"
          description="Add contacts to manage customer relationships"
        />
      )}
    </div>
  )
}

