import React from 'react'
import { Users, UserPlus, TrendingUp, Award, BarChart3, Users as UsersIcon } from 'lucide-react'
import { ModuleDashboard, useModuleQuery } from '@erp-modules/shared'
import { OverviewTab } from './tabs/OverviewTab'
import { CustomersListTab } from './tabs/CustomersListTab'
import { SegmentsTab } from './tabs/SegmentsTab'
import { ActivityTab } from './tabs/ActivityTab'
import { ReportsTab } from './tabs/ReportsTab'

interface CustomerAnalytics {
  total_customers: number
  new_customers_this_month: number
    active_customers: number
  average_lifetime_value: number
}

export default function CustomerDashboard() {
  const { data: analytics } = useModuleQuery<{ data: CustomerAnalytics }>(
    ['customer-analytics'],
    '/api/v1/customers/analytics'
  )

  const analyticsData = analytics?.data

  return (
    <ModuleDashboard
      title="Customer Management"
      icon={Users}
      description="Customer relationship management and analytics"
      kpis={[
        {
          id: 'total',
          label: 'Total Customers',
          value: analyticsData?.total_customers || 0,
          icon: Users,
          color: 'blue',
        },
        {
          id: 'new',
          label: 'New This Month',
          value: analyticsData?.new_customers_this_month || 0,
          icon: UserPlus,
          color: 'green',
        },
        {
          id: 'active',
          label: 'Active Customers',
          value: analyticsData?.active_customers || 0,
          icon: TrendingUp,
          color: 'purple',
        },
        {
          id: 'ltv',
          label: 'Avg Lifetime Value',
          value: `$${analyticsData?.average_lifetime_value?.toFixed(2) || 0}`,
          icon: Award,
          color: 'orange',
        },
      ]}
      actions={[
        {
          id: 'create-customer',
          label: 'Add Customer',
          icon: UserPlus,
          onClick: () => {},
          variant: 'primary',
        },
      ]}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: BarChart3,
          content: <OverviewTab analytics={analyticsData} />,
        },
        {
          id: 'customers',
          label: 'Customers',
          icon: UsersIcon,
          content: <CustomersListTab />,
        },
        {
          id: 'segments',
          label: 'Segments',
          icon: Award,
          content: <SegmentsTab />,
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: TrendingUp,
          content: <ActivityTab />,
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: BarChart3,
          content: <ReportsTab />,
        },
      ]}
      defaultTab="overview"
    />
  )
}
