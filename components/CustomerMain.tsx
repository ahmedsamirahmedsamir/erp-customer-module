import React from 'react'
import { BarChart3, Users, Contact, Target, TrendingUp } from 'lucide-react'
import { TabContainer } from '@erp-modules/shared'
import { CustomerDashboard } from './CustomerDashboard'
import { CustomerList } from './CustomerList'
import { ContactList } from './ContactList'
import { SegmentsList } from './SegmentsList'
import { CustomerAnalytics } from './CustomerAnalytics'

export function CustomerMain() {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      content: <CustomerDashboard />,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      content: <CustomerList />,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Contact,
      content: <ContactList />,
    },
    {
      id: 'segments',
      label: 'Segments',
      icon: Target,
      content: <SegmentsList />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      content: <CustomerAnalytics />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TabContainer tabs={tabs} defaultTab="dashboard" urlParam="tab" />
      </div>
    </div>
  )
}

export default CustomerMain

