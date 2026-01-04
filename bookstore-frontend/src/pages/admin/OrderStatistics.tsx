import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardStats } from '@/constants/interfaces';
import { OrderStatusLabel } from '@/constants/enums';
import { useOrder } from '@/hooks/useOrder';
import { Loader2, DollarSign, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';

// Màu sắc cho biểu đồ
const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#3b82f6', '#9c27b0'];

const OrderDashboard = () => {
  const { getDashboardStats } = useOrder();

  // State quản lý data thống kê
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data từ API Thống kê riêng
  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        if (mounted) {
          setStats(data);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [getDashboardStats]);

  // Transform data cho biểu đồ từ statusBreakdown
  const chartData =
    stats?.statusBreakdown.map((item) => ({
      name:
        OrderStatusLabel[item.status as keyof typeof OrderStatusLabel] ||
        item.status,
      value: item.count,
    })) || [];

  // Component con hiển thị Card (giữ nguyên style cũ)
  const StatCard = ({
    title,
    value,
    icon: Icon,
    isLoading,
  }: {
    title: string;
    value: string | number;
    icon: any;
    isLoading: boolean;
  }) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between space-y-0">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-2" />
          ) : (
            <h3 className="text-2xl font-bold">{value}</h3>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-muted/40 min-h-screen">
      <h2 className="text-3xl font-bold tracking-tight">Thống kê đơn hàng</h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số đơn hàng"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          isLoading={loading}
        />
        <StatCard
          title="Tổng doanh thu"
          value={
            loading
              ? '...'
              : `${stats?.totalRevenue.toLocaleString('vi-VN') ? stats?.totalRevenue.toLocaleString('vi-VN') : 0} ₫`
          }
          icon={DollarSign}
          isLoading={loading}
        />
        <StatCard
          title="Đơn đang giao"
          value={stats?.deliveringOrders || 0}
          icon={Truck}
          isLoading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tỷ lệ trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({
                        name,
                        percent,
                      }: {
                        name?: string;
                        percent?: number;
                      }) =>
                        `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value, 'Số lượng']}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                Chưa có dữ liệu đơn hàng
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDashboard;
