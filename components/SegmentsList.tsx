import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Users, Target, TrendingUp } from 'lucide-react'
import { 
  api, DataTable, LoadingSpinner, StatusBadge, 
  ActionButtons, EmptyState 
} from '@erp-modules/shared'
import toast from 'react-hot-toast'

interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: string
  customer_count: number
  total_revenue: number
  avg_order_value: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export function SegmentsList() {
  const queryClient = useQueryClient()

  const { data: segments, isLoading } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const response = await api.get<{ data: CustomerSegment[] }>('/api/v1/customer/segments')
      return response.data.data
    },
  })

  const deleteSegment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/customer/segments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] })
      toast.success('Segment deleted successfully')
    },
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Segment Name',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Target className="h-4 w-4 text-purple-600 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{row.getValue('name')}</div>
            <div className="text-sm text-gray-500">{row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'customer_count',
      header: 'Customers',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium">{row.getValue('customer_count')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'total_revenue',
      header: 'Total Revenue',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-green-600">
          ${row.getValue('total_revenue').toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'avg_order_value',
      header: 'Avg Order Value',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          ${row.getValue('avg_order_value').toLocaleString()}
        </span>
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
          onDelete={() => deleteSegment.mutate(row.original.id)}
        />
      ),
    },
  ]

  if (isLoading) {
    return <LoadingSpinner text="Loading segments..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Segments</h2>
          <p className="text-gray-600 mt-1">Organize customers by behavior and attributes</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Segment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Segments</p>
              <p className="text-2xl font-semibold text-gray-900">{segments?.length || 0}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-blue-600">
                {segments?.reduce((sum, s) => sum + s.customer_count, 0) || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-green-600">
                ${segments?.reduce((sum, s) => sum + s.total_revenue, 0).toLocaleString() || 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {segments && segments.length > 0 ? (
        <DataTable
          data={segments}
          columns={columns}
          enablePagination={true}
          enableSorting={true}
        />
      ) : (
        <EmptyState
          icon={Target}
          title="No segments found"
          description="Create customer segments to organize and target specific groups"
          action={{
            label: 'Create Segment',
            onClick: () => console.log('Create segment'),
          }}
        />
      )}
    </div>
  )
}

