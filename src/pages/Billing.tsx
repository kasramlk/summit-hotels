import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BillingCard } from '@/components/BillingCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Download, 
  Receipt, 
  Calendar, 
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface BillingInfo {
  id: string;
  card_holder_name: string;
  card_last_four: string;
  card_expiry: string;
  card_brand: string;
  billing_address: string;
  billing_city: string;
  billing_country: string;
  billing_postal_code: string;
  is_default: boolean;
  created_at: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  invoice_date: string;
  due_date: string;
  description: string;
}

const Billing = () => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingData();
  }, [user]);

  const fetchBillingData = async () => {
    if (!user) return;
    
    try {
      // Fetch billing information
      const { data: billing, error: billingError } = await supabase
        .from('billing_info')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (billingError) throw billingError;
      setBillingInfo(billing || []);

      // Generate sample invoice data (in a real app, this would come from your billing system)
      const sampleInvoices: Invoice[] = [
        {
          id: '1',
          amount: 299.00,
          status: 'paid',
          invoice_date: '2024-01-15',
          due_date: '2024-02-15',
          description: 'Hotel Management Pro - Monthly Subscription'
        },
        {
          id: '2',
          amount: 299.00,
          status: 'paid',
          invoice_date: '2023-12-15',
          due_date: '2024-01-15',
          description: 'Hotel Management Pro - Monthly Subscription'
        },
        {
          id: '3',
          amount: 299.00,
          status: 'pending',
          invoice_date: '2024-02-15',
          due_date: '2024-03-15',
          description: 'Hotel Management Pro - Monthly Subscription'
        }
      ];
      setInvoices(sampleInvoices);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    // In a real application, this would generate and download a PDF invoice
    toast({
      title: "Download started",
      description: `Invoice ${invoiceId} is being downloaded.`,
    });
  };

  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mar 15</div>
            <p className="text-xs text-muted-foreground">
              $299.00 due
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Methods */}
        <BillingCard billingInfo={billingInfo} onUpdate={fetchBillingData} />

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Current Plan</span>
            </CardTitle>
            <CardDescription>
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Hotel Management Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Full access to all features and unlimited hotels
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Monthly Price:</span>
                <span className="font-medium">$299.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Billing Cycle:</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Renewal:</span>
                <span className="font-medium">March 15, 2024</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                Change Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Invoice History</span>
          </CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    <span className="capitalize">{invoice.status}</span>
                  </div>
                  <div>
                    <div className="font-medium">{invoice.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(invoice.invoice_date), 'MMM d, yyyy')} • Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">${invoice.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {invoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;