"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react";
import { setInvoices, setLoading, setError } from "@/store/slices/invoiceSlice";
const InvoiceScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.invoices);
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    let userId;
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.user_id;
      } catch (error) {
        console.error("Error parsing userDetails from localStorage:", error);
        userId = null;
      }
    } else {
      userId = null;
    }
    const fetchInvoices = async () => {
      dispatch(setLoading());
      try {
        const response = await fetch(
          `https://api.meetowner.in/payments/getAllInvoicesByID?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        dispatch(setInvoices({ invoices: data.invoices || [] }));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchInvoices();
  }, [dispatch]);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };
  const formatCurrency = (amount) => {
    if (!amount || isNaN(Number(amount))) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoice_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      invoice.payment_status === statusFilter ||
      invoice.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Success",
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      },
      failed: {
        className: "bg-red-100 text-red-800 border-red-200",
        label: "Failed",
      },
      active: {
        className: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Active",
      },
      inactive: {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Inactive",
      },
      expired: {
        className: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Expired",
      },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };
  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <div className="min-h-screen bg-[#f4f4f4">
      <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        {}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-[#1D3A76] bg-clip-text text-transparent">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your subscription invoices
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white/80 backdrop-blur-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-auto bg-white/80 backdrop-blur-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Total Paid
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      ₹
                      {invoices
                        .reduce(
                          (sum, inv) =>
                            inv.payment_status === "success"
                              ? sum + parseFloat(inv.payment_amount || 0)
                              : sum,
                          0
                        )
                        .toLocaleString("en-IN")}
                    </p>
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
                    <p className="text-sm font-medium text-blue-600">
                      Total Invoices
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {invoices.length}
                    </p>
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
                    <p className="text-sm font-medium text-yellow-600">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      ₹
                      {invoices
                        .reduce(
                          (sum, inv) =>
                            inv.payment_status === "pending"
                              ? sum + parseFloat(inv.payment_amount || 0)
                              : sum,
                          0
                        )
                        .toLocaleString("en-IN")}
                    </p>
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
                    <p className="text-sm font-medium text-purple-600">
                      Active Plans
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {
                        invoices.filter(
                          (inv) => inv.subscription_status === "active"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-[#1D3A76] text-white p-6">
            <CardTitle className="text-xl font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading && (
              <p className="p-4 text-center text-gray-600">Loading...</p>
            )}
            {error && (
              <p className="p-4 text-center text-red-600">Error: {error}</p>
            )}
            {!loading && !error && filteredInvoices.length === 0 && (
              <p className="p-4 text-center text-gray-600">
                No invoices found.
              </p>
            )}
            {!loading && !error && filteredInvoices.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-900 p-4">
                        ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Invoice No
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Package
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Payment Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Subscription Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4">
                        Created At
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 p-4 text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <TableCell className="p-4 font-medium text-gray-900">
                          {invoice.id}
                        </TableCell>
                        <TableCell className="p-4">
                          <span className="font-mono text-[#1D3A76] font-medium">
                            {invoice.invoice_number}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {invoice.subscription_package}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4 font-semibold text-gray-900">
                          {formatCurrency(invoice.payment_amount)}
                        </TableCell>
                        <TableCell className="p-4">
                          {getStatusBadge(invoice.payment_status)}
                        </TableCell>
                        <TableCell className="p-4">
                          {getStatusBadge(invoice.subscription_status)}
                        </TableCell>
                        <TableCell className="p-4 text-gray-600">
                          {formatDate(invoice.created_at)}
                        </TableCell>
                        <TableCell className="p-4 text-center">
                          <Button
                            size="sm"
                            className="bg-[#1D3A76] hover:bg-blue-800 text-white shadow-sm"
                            onClick={() =>
                              handleViewInvoice(invoice.invoice_url)
                            }
                            disabled={!invoice.invoice_url}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default InvoiceScreen;
