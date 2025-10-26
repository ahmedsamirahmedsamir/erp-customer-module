import React from 'react'
import { Users, TrendingUp } from 'lucide-react'

interface OverviewTabProps {
  analytics?: {
    total_customers: number
    new_customers_this_month: number
    active_customers: number
    average_lifetime_value: number
  }
}

export function OverviewTab({ analytics }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Customer Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Customers</div>
            <div className="text-2xl font-bold text-blue-600">{analytics?.total_customers || 0}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Active Customers</div>
            <div className="text-2xl font-bold text-green-600">{analytics?.active_customers || 0}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Growth Metrics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">New This Month</span>
            <span className="text-lg font-semibold">{analytics?.new_customers_this_month || 0}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Avg Lifetime Value</span>
            <span className="text-lg font-semibold">${analytics?.average_lifetime_value?.toFixed(2) || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

