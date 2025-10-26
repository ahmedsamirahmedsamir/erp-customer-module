import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, TrendingUp, DollarSign, ShoppingCart, 
  Calendar, Target, BarChart3, PieChart 
} from 'lucide-react'
import { api, LoadingSpinner } from '@erp-modules/shared'

interface CustomerAnalytics {
  total_customers: number
  active_customers: number
  new_customers_this_month: number
  total_revenue: number
  avg_customer_value: number
  avg_order_value: number
  total_orders: number
  retention_rate: number
  customer_growth: Array<{
    month: string
    new_customers: number
    total_customers: number
  }>
  top_customers: Array<{
    id: string
    name: string
    revenue: number
    order_count: number
  }>
  customer_by_type: Array<{
    type: string
    count: number
    percentage: number
  }>
}

export function CustomerAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['customer-analytics'],
    queryFn: async () => {
      const response = await api.get<{ data: CustomerAnalytics }>('/api/v1/customer/analytics')
      return response.data.data
    },
  })

  if (isLoading) {
    return <LoadingSpinner text="Loading analytics..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Analytics</h2>
        <p className="text-gray-600 mt-1">Insights and metrics about your customer base</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.total_customers?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold text-green-600">
                {analytics?.active_customers?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-purple-600">
                ${analytics?.total_revenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Retention Rate</p>
              <p className="text-2xl font-semibold text-orange-600">
                {analytics?.retention_rate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {analytics?.top_customers?.slice(0, 5).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-3">#{index + 1}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.order_count} orders</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  ${customer.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customers by Type</h3>
          <div className="space-y-3">
            {analytics?.customer_by_type?.map((type) => (
              <div key={type.type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{type.type}</span>
                  <span className="text-gray-600">{type.count} ({type.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {analytics?.customer_growth?.slice(-12).map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div 
                className="bg-blue-500 rounded-t w-full mb-2"
                style={{ 
                  height: `${(data.new_customers / Math.max(...(analytics.customer_growth?.map(d => d.new_customers) || [1]))) * 200}px` 
                }}
              />
              <div className="text-xs text-gray-500 text-center">
                {new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xs text-gray-400">+{data.new_customers}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

