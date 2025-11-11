import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  ShoppingCart,
  LayoutGrid,
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useLoaderData } from 'react-router-dom';
import type { DashboardData } from '@/constants/interfaces';
import { getColorByIndex } from '@/utils/colorHelper';

export default function AdminDashboard() {
  const dashboardData = useLoaderData() as DashboardData;
  if (!dashboardData) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  const { statsData, monthlyData, categoryData, recentOrdersData } =
    dashboardData;

  const StatCardPrimary = ({ title, value, icon: Icon, className }: any) => (
    <Card
      className={`text-primary-foreground border-none shadow-md ${className}`}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  const StatCardSecondary = ({
    title,
    value,
    icon: Icon,
    iconColor,
    valueColor,
    suffix = '',
  }: any) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2" style={{ color: valueColor }}>
            {value}
            {suffix}
          </h3>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 bg-muted/40 min-h-screen">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardPrimary
          title="Tổng người dùng"
          value={statsData.totalUsers}
          icon={Users}
          className="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCardPrimary
          title="Tổng sách"
          value={statsData.totalProducts}
          icon={BookOpen}
          className="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCardPrimary
          title="Tổng đơn hàng"
          value={statsData.totalOrders}
          icon={ShoppingCart}
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <StatCardPrimary
          title="Tổng doanh thu"
          value={`${Number(statsData.totalRevenue).toLocaleString('vi-VN')} ₫`}
          icon={DollarSign}
          className="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSecondary
          title="Tăng trưởng tháng này"
          value={statsData.monthlyGrowth.toFixed(1)}
          suffix="%"
          icon={TrendingUp}
          iconColor="text-green-500"
          valueColor="#10b981"
        />
        <StatCardSecondary
          title="Đơn hàng hôm nay"
          value={statsData.todayOrders}
          icon={ShoppingBag}
          iconColor="text-blue-500"
          valueColor="#3b82f6"
        />
        <StatCardSecondary
          title="Danh mục sách"
          value={categoryData.length}
          icon={LayoutGrid}
          iconColor="text-purple-500"
          valueColor="#8b5cf6"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Người dùng"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Đơn hàng"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố danh mục sách (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorByIndex(index)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {categoryData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColorByIndex(index) }}
                  />
                  <span className="text-muted-foreground">
                    {entry.name} -{' '}
                    {(
                      (entry.value /
                        categoryData.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        )) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng (VNĐ)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis
                  className="text-sm"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('vi-VN', {
                      notation: 'compact',
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString('vi-VN')} ₫`,
                    'Doanh thu',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng 7 ngày gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentOrdersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar
                  dataKey="orders"
                  fill="#f59e0b"
                  name="Số đơn hàng"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
