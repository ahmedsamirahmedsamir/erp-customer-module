import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, Search, Filter, Users, Edit, Trash2, Eye, BarChart3, 
  TrendingUp, TrendingDown, Calendar, AlertTriangle, CheckCircle, 
  Clock, Download, Upload, Settings, Zap, Bell, Globe, 
  FileText, PieChart, LineChart, Activity, Target, 
  RefreshCw, Play, Pause, MoreHorizontal, Star, DollarSign, X,
  Phone, Mail, MapPin, CreditCard, Receipt, User, UserCheck, UserX,
  UserPlus, UserMinus, Award, Gift, Package, Truck, Plane, Ship,
  Building, Home, Briefcase, Handshake, Clipboard, CheckSquare, Square,
  FileSpreadsheet, FileImage, FileVideo, FileAudio, Smartphone, Monitor,
  Tablet, Laptop, Headphones, Camera, Mic, Speaker, Printer, Scanner,
  Fax, Wifi, WifiOff, Signal, Battery, Thermometer, Droplets, Sun,
  Moon, Wind, Snowflake, ArrowUpRight, ArrowDownRight, ArrowRight,
  ArrowLeft, Calculator, Percent, Hash, Tag, Barcode, ScanLine,
  Database, Cloud, MessageSquare, Send, Calendar as CalendarIcon,
  Clock as ClockIcon, CheckCircle as CheckCircleIcon, AlertCircle,
  Layers, RotateCcw, Archive, CheckSquare as CheckSquareIcon2,
  ArrowUpDown, ArrowDownRight as ArrowDownRightIcon, ArrowRightLeft,
  ArrowLeftRight, FileSpreadsheet as FileSpreadsheetIcon, FileImage as FileImageIcon,
  FileVideo as FileVideoIcon, FileAudio as FileAudioIcon, Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon, Tablet as TabletIcon, Laptop as LaptopIcon,
  Headphones as HeadphonesIcon, Camera as CameraIcon, Mic as MicIcon,
  Speaker as SpeakerIcon, Printer as PrinterIcon, Scanner as ScannerIcon,
  Fax as FaxIcon, Wifi as WifiIcon, WifiOff as WifiOffIcon, Signal as SignalIcon,
  Battery as BatteryIcon, Thermometer as ThermometerIcon, Droplets as DropletsIcon,
  Sun as SunIcon, Moon as MoonIcon, Wind as WindIcon, Snowflake as SnowflakeIcon
} from 'lucide-react'
import { DataTable } from '../../components/table/DataTable'
import { api } from '../../lib/api'

interface Customer {
  id: string
  customer_number: string
  name: string
  email: string
  phone: string
  company: string
  job_title: string
  customer_type: 'individual' | 'business' | 'reseller' | 'distributor'
  status: 'active' | 'inactive' | 'prospect' | 'suspended'
  priority: 'low' | 'medium' | 'high' | 'vip'
  source: 'website' | 'referral' | 'cold_call' | 'trade_show' | 'social_media' | 'advertising'
  industry: string
  annual_revenue: number
  employee_count: number
  website: string
  social_media: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  addresses: CustomerAddress[]
  contacts: CustomerContact[]
  orders: CustomerOrder[]
  loyalty: CustomerLoyalty
  communications: CustomerCommunication[]
  notes: CustomerNote[]
  tags: string[]
  segments: string[]
  created_at: string
  updated_at: string
}

interface CustomerAddress {
  id: string
  type: 'billing' | 'shipping' | 'office' | 'warehouse'
  street: string
  city: string
  state: string
  zip: string
  country: string
  is_primary: boolean
  is_active: boolean
}

interface CustomerContact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  mobile: string
  department: string
  is_primary: boolean
  is_active: boolean
}

interface CustomerOrder {
  id: string
  order_number: string
  order_date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  items_count: number
}

interface CustomerLoyalty {
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  tier_points: number
  next_tier_points: number
  total_spent: number
  orders_count: number
  last_order_date: string
  join_date: string
}

interface CustomerCommunication {
  id: string
  type: 'email' | 'phone' | 'sms' | 'meeting' | 'note'
  direction: 'inbound' | 'outbound'
  subject: string
  content: string
  user_id: string
  user_name: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  attachments: string[]
}

interface CustomerNote {
  id: string
  title: string
  content: string
  type: 'general' | 'sales' | 'support' | 'technical'
  priority: 'low' | 'medium' | 'high'
  user_id: string
  user_name: string
  created_at: string
  updated_at: string
}

interface SupportTicket {
  id: string
  ticket_number: string
  customer_id: string
  customer_name: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: 'technical' | 'billing' | 'general' | 'feature_request'
  assigned_to: string
  assigned_to_name: string
  created_at: string
  updated_at: string
  resolved_at?: string
  resolution?: string
}

interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: string
  customer_count: number
  total_value: number
  average_order_value: number
  created_at: string
  updated_at: string
}

interface CustomerTag {
  id: string
  name: string
  color: string
  description: string
  customer_count: number
  created_at: string
  updated_at: string
}

interface CustomerAnalytics {
  total_customers: number
  active_customers: number
  new_customers_this_month: number
  customer_retention_rate: number
  average_customer_value: number
  top_customers: Array<{
    customer_id: string
    customer_name: string
    total_spent: number
    orders_count: number
    last_order_date: string
  }>
  customer_segments: Array<{
    segment: string
    customer_count: number
    total_value: number
    average_value: number
  }>
  communication_stats: Array<{
    type: string
    count: number
    response_rate: number
  }>
  support_tickets: Array<{
    status: string
    count: number
    avg_resolution_time: number
  }>
  monthly_trends: Array<{
    month: string
    new_customers: number
    active_customers: number
    total_revenue: number
  }>
}

export function AdvancedCustomerManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('')
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showCommunicationForm, setShowCommunicationForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // Fetch customer analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['customer-analytics'],
    queryFn: async () => {
      const response = await api.get('/customers/analytics')
      return response.data.data as CustomerAnalytics
    },
  })

  // Fetch customers
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', currentPage, searchQuery, selectedStatus, selectedType, selectedSegment],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })
      if (searchQuery) params.append('search', searchQuery)
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedType) params.append('customer_type', selectedType)
      if (selectedSegment) params.append('segment', selectedSegment)
      
      const response = await api.get(`/customers?${params}`)
      return response.data
    },
  })

  // Fetch support tickets
  const { data: ticketsData } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const response = await api.get('/customers/support-tickets')
      return response.data.data as SupportTicket[]
    },
  })

  // Fetch customer segments
  const { data: segmentsData } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const response = await api.get('/customers/segments')
      return response.data.data as CustomerSegment[]
    },
  })

  // Fetch customer tags
  const { data: tagsData } = useQuery({
    queryKey: ['customer-tags'],
    queryFn: async () => {
      const response = await api.get('/customers/tags')
      return response.data.data as CustomerTag[]
    },
  })

  // Create customer mutation
  const createCustomer = useMutation({
    mutationFn: async (customerData: Partial<Customer>) => {
      const response = await api.post('/customers', customerData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setShowCustomerForm(false)
    },
  })

  // Update customer mutation
  const updateCustomer = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const response = await api.put(`/customers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
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

  // Create communication mutation
  const createCommunication = useMutation({
    mutationFn: async (communicationData: Partial<CustomerCommunication>) => {
      const response = await api.post('/customers/communications', communicationData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-communications'] })
      setShowCommunicationForm(false)
    },
  })

  // Create note mutation
  const createNote = useMutation({
    mutationFn: async (noteData: Partial<CustomerNote>) => {
      const response = await api.post('/customers/notes', noteData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes'] })
      setShowNoteForm(false)
    },
  })

  // Create support ticket mutation
  const createTicket = useMutation({
    mutationFn: async (ticketData: Partial<SupportTicket>) => {
      const response = await api.post('/customers/support-tickets', ticketData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      setShowTicketForm(false)
    },
  })

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer.mutate(customerId)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'prospect': 'bg-blue-100 text-blue-800',
      'suspended': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'vip': 'bg-purple-100 text-purple-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'individual': 'bg-blue-100 text-blue-800',
      'business': 'bg-green-100 text-green-800',
      'reseller': 'bg-purple-100 text-purple-800',
      'distributor': 'bg-orange-100 text-orange-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTicketStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'open': 'bg-red-100 text-red-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTicketPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const customers = customersData?.data?.customers || []
  const tickets = ticketsData || []
  const segments = segmentsData || []
  const tags = tagsData || []
  const analytics = analyticsData

  const customerColumns = [
    {
      accessorKey: 'customer_number',
      header: 'Customer #',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-600 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{row.getValue('customer_number')}</div>
            <div className="text-sm text-gray-500">{row.original.name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.getValue('company') || 'N/A'}</div>
          <div className="text-sm text-gray-500">{row.original.job_title || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }: any) => (
        <div>
          <div className="text-sm text-gray-900">{row.getValue('email')}</div>
          <div className="text-sm text-gray-500">{row.original.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: 'customer_type',
      header: 'Type',
      cell: ({ row }: any) => {
        const type = row.getValue('customer_type')
        return (
          <span className={`px-2 py-1 text-xs rounded ${getTypeColor(type)}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
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
          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }: any) => {
        const priority = row.getValue('priority')
        return (
          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(priority)}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )
      },
    },
    {
      accessorKey: 'loyalty',
      header: 'Loyalty',
      cell: ({ row }: any) => {
        const loyalty = row.original.loyalty
        return (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">{loyalty?.tier || 'N/A'}</div>
            <div className="text-xs text-gray-500">{loyalty?.points || 0} pts</div>
          </div>
        )
      },
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
            onClick={() => setSelectedCustomer(row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSelectedCustomer(row.original)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteCustomer(row.original.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Advanced Customer Management</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTicketForm(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Bell className="h-4 w-4 mr-2" />
            New Ticket
          </button>
          <button
            onClick={() => setShowCommunicationForm(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            New Communication
          </button>
          <button
            onClick={() => setShowCustomerForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics?.total_customers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics?.active_customers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Retention Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.customer_retention_rate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Customer Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${analytics?.average_customer_value?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics?.new_customers_this_month || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Open Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Communications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.communication_stats?.reduce((sum, stat) => sum + stat.count, 0) || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">VIP Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.priority === 'vip').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'tickets', label: 'Support Tickets', icon: Bell },
            { id: 'segments', label: 'Segments', icon: Target },
            { id: 'tags', label: 'Tags', icon: Tag },
            { id: 'communications', label: 'Communications', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Trends</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics?.monthly_trends?.slice(0, 12).map((trend, index) => (
                <div key={trend.month} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full mb-2"
                    style={{ height: `${(trend.new_customers / Math.max(...analytics.monthly_trends.map(t => t.new_customers))) * 200}px` }}
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {trend.new_customers} new
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {analytics?.top_customers?.slice(0, 5).map((customer, index) => (
                <div key={customer.customer_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{customer.customer_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${customer.total_spent.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.orders_count} orders • Last: {new Date(customer.last_order_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <div className="space-y-3">
              {analytics?.customer_segments?.map((segment, index) => (
                <div key={segment.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${segment.total_value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {segment.customer_count} customers • Avg: ${segment.average_value.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
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
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
                <option value="reseller">Reseller</option>
                <option value="distributor">Distributor</option>
              </select>

              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Segments</option>
                {segments.map(segment => (
                  <option key={segment.id} value={segment.id}>{segment.name}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedStatus('')
                  setSelectedType('')
                  setSelectedSegment('')
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
              columns={customerColumns}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {tickets.slice(0, 10).map((ticket) => (
                <div key={ticket.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{ticket.ticket_number} - {ticket.subject}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.customer_name} • {ticket.category}
                      </div>
                      <div className="text-xs text-gray-400">
                        Created: {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${getTicketStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${getTicketPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {segments.map((segment) => (
                <div key={segment.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {segment.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {segment.description}
                      </div>
                      <div className="text-xs text-gray-400">
                        Criteria: {segment.criteria}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {segment.customer_count} customers
                      </div>
                      <div className="text-xs text-gray-500">
                        ${segment.total_value.toLocaleString()} total value
                      </div>
                    </div>
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Tags</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center px-3 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    {tag.name}
                    <span className="ml-2 text-xs opacity-75">
                      ({tag.customer_count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Communications</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {analytics?.communication_stats?.map((stat, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.type.charAt(0).toUpperCase() + stat.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stat.count} communications
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {stat.response_rate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Response Rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Communication Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Statistics</h3>
              <div className="space-y-3">
                {analytics?.communication_stats?.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{stat.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${stat.response_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{stat.response_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Ticket Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Ticket Statistics</h3>
              <div className="space-y-3">
                {analytics?.support_tickets?.map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{ticket.status}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{ticket.count}</span>
                      <span className="text-xs text-gray-500">
                        ({ticket.avg_resolution_time}h avg)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Customer</h3>
              <button
                onClick={() => setShowCustomerForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="reseller">Reseller</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCustomerForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createCustomer.mutate({})}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communication Form Modal */}
      {showCommunicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Communication</h3>
              <button
                onClick={() => setShowCommunicationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCommunicationForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createCommunication.mutate({})}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Send Communication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Support Ticket</h3>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="general">General</option>
                    <option value="feature_request">Feature Request</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowTicketForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createTicket.mutate({})}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
