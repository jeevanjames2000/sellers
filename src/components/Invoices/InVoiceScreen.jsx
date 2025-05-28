'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, Eye, FileText, Calendar, CreditCard } from 'lucide-react';

const InvoiceScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invoicesData = [
    {
      id: 0,
      invoiceNo: 'INV-00003',
      package: 'Prime',
      amount: '₹22999.00',
      paymentStatus: 'success',
      subscriptionStatus: 'active',
      createdAt: '5/20/2025'
    },
    {
      id: 1,
      invoiceNo: 'INV-00002',
      package: 'Basic',
      amount: '₹9999.00',
      paymentStatus: 'pending',
      subscriptionStatus: 'inactive',
      createdAt: '5/15/2025'
    },
    {
      id: 2,
      invoiceNo: 'INV-00001',
      package: 'Premium',
      amount: '₹39999.00',
      paymentStatus: 'failed',
      subscriptionStatus: 'expired',
      createdAt: '5/10/2025'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { className: 'bg-green-100 text-green-800 border-green-200', label: 'Success' },
      pending: { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      failed: { className: 'bg-red-100 text-red-800 border-red-200', label: 'Failed' },
      active: { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Active' },
      inactive: { className: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Inactive' },
      expired: { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Expired' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-[#1D3A76] bg-clip-text text-transparent">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-2">Track and manage your subscription invoices</p>
            </div>
           
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Paid</p>
                    <p className="text-2xl font-bold text-green-900">₹22,999</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Invoices</p>
                    <p className="text-2xl font-bold text-blue-900">3</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">₹9,999</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Active Plans</p>
                    <p className="text-2xl font-bold text-purple-900">1</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
      

        {/* Invoice Table */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-[#1D3A76]  text-white p-6">
            <CardTitle className="text-xl font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900 p-4">ID</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Invoice No</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Package</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Payment Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Subscription Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4">Created At</TableHead>
                    <TableHead className="font-semibold text-gray-900 p-4 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="p-4 font-medium text-gray-900">{invoice.id}</TableCell>
                      <TableCell className="p-4">
                        <span className="font-mono text-[#1D3A76] font-medium">{invoice.invoiceNo}</span>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {invoice.package}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-900">{invoice.amount}</TableCell>
                      <TableCell className="p-4">
                        {getStatusBadge(invoice.paymentStatus)}
                      </TableCell>
                      <TableCell className="p-4">
                        {getStatusBadge(invoice.subscriptionStatus)}
                      </TableCell>
                      <TableCell className="p-4 text-gray-600">{invoice.createdAt}</TableCell>
                      <TableCell className="p-4 text-center">
                        <Button 
                          size="sm" 
                          className="bg-[#1D3A76] hover:to-blue-800 text-white shadow-sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
      
      </div>
    </div>
  );
};

export default InvoiceScreen;