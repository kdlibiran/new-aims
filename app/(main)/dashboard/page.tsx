'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Clock, Settings, Smartphone, PenToolIcon as Tool, Truck } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DeviceAssistantChat from '@/components/DeviceAssistantChat'

const getStatusColor = (status: string) => {
 switch (status) {
    case 'available':
      return '#22c55e';  // green
    case 'dispatched':
      return '#3b82f6';  // blue
    case 'repair':
      return '#ef4444';  // red
    case 'retired':
      return '#eab308';  // yellow
    default:
      return '#6b7280';  // gray
  }
}

export default function DashboardPage() {
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  const dashboardData = useQuery(api.devices.getDashboardStats)

  if (!dashboardData) {
    return <div className="flex-1 p-8">Loading...</div>
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Device Tracking Dashboard</h1>
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Devices</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.statuses.available}</div>
              <p className="text-xs text-muted-foreground">
                {((dashboardData.statuses.available / dashboardData.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devices in Repair</CardTitle>
              <Tool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.statuses.repair}</div>
              <p className="text-xs text-muted-foreground">
                {((dashboardData.statuses.repair / dashboardData.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispatched Devices</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.statuses.dispatched}</div>
              <p className="text-xs text-muted-foreground">
                {((dashboardData.statuses.dispatched / dashboardData.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Device Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(dashboardData.statuses).map(([key, value]) => ({ name: capitalize(key), value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                  >
                    {Object.entries(dashboardData.statuses).map(([key], index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getStatusColor(key)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Repaired Devices</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.mostRepaired}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Most Used Devices</CardTitle>
              <CardDescription>Based on total usage hours</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Usage Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody> 
                  {dashboardData.mostUsed.map((device) => (
                    <TableRow key={device.name}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.usageHours}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.device}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming device maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.maintenanceSchedule.map((maintenance) => (
                  <TableRow key={maintenance.device}>
                    <TableCell className="font-medium">{maintenance.device}</TableCell>
                    <TableCell>{formatDate(maintenance.lastMaintenance)}</TableCell>
                    <TableCell>{formatDate(maintenance.nextMaintenance)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(maintenance.status)}`}>
                        {maintenance.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="fixed bottom-8 right-8 w-[400px]">
          <DeviceAssistantChat />
        </div>
      </div>
    </div>
  )
}
