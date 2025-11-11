import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Order } from '@/constants/interfaces';
import { useLoaderData } from 'react-router-dom';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#3b82f6'];

const OrderDashboard = () => {
  const orders = useLoaderData() as Order[];
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const deliveringOrders = orders.filter(
    (o) => o.status === OrderStatus.DELIVERED,
  ).length;

  const pieData = useMemo(() => {
    const statusCount: Record<string, number> = {};
    orders.forEach((o) => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });
    return Object.keys(statusCount).map((status) => ({
      name: OrderStatusLabel[
        status.toUpperCase() as keyof typeof OrderStatusLabel
      ],
      value: statusCount[status],
    }));
  }, [orders]);

  const StatCard = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-muted/40 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng số đơn" value={totalOrders} />
        <StatCard
          title="Tổng doanh thu"
          value={`${totalRevenue.toLocaleString('vi-VN')} ₫`}
        />
        <StatCard title="Đơn đang giao" value={deliveringOrders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ đơn hàng theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDashboard;
