import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders?: number;
  deliveredOrders?: number;
  lowStockProducts?: number;
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkVendorAccess();
    fetchStats();
  }, []);

  const checkVendorAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await api.getCurrentUser();
      if (response.success) {
        if (response.data.role !== 'vendor') {
          toast({
            title: "Access Denied",
            description: "Only vendors can access this page.",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    } catch (error) {
      navigate('/auth');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getVendorDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your store.</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              {stats.lowStockProducts !== undefined && stats.lowStockProducts > 0 && (
                <p className="text-xs text-orange-500 mt-1">
                  {stats.lowStockProducts} low stock
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              {stats.deliveredOrders !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.deliveredOrders} delivered
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{Math.round(stats.totalRevenue).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              {stats.processingOrders !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.processingOrders} processing
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        {(stats.processingOrders !== undefined || stats.deliveredOrders !== undefined) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.processingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Delivered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.deliveredOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.lowStockProducts || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/vendor/products"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Manage Products</h3>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, or remove products from your store
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                to="/vendor/orders"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">View Orders</h3>
                    <p className="text-sm text-muted-foreground">
                      Process and manage customer orders
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                to="/profile"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Profile Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your vendor profile and contact information
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Fulfillment</span>
                  <span className="font-medium">
                    {stats.totalOrders > 0
                      ? `${Math.round(((stats.deliveredOrders || 0) / stats.totalOrders) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: stats.totalOrders > 0
                        ? `${((stats.deliveredOrders || 0) / stats.totalOrders) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Active Products</span>
                  <span className="text-xl font-bold">{stats.totalProducts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Revenue/Order</span>
                  <span className="text-xl font-bold">
                    ₦{stats.totalOrders > 0
                      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}