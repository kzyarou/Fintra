import React, { useMemo, useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Calendar,
  DollarSign,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BarChart2 } from
'lucide-react';
const COLORS = [
'#0D6B4B',
'#3B82F6',
'#8B5CF6',
'#F59E0B',
'#EF4444',
'#06B6D4',
'#EC4899',
'#10B981'];

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '📄',
  Health: '💊',
  Education: '📚',
  Travel: '✈️',
  General: '📦',
  Income: '💰'
};
export function AnalyticsPage() {
  const { transactions, currencySymbol, budgets, getCategorySpending } =
  useFinance();
  const [timeframe, setTimeframe] = useState<'month' | 'week'>('month');
  // Date calculations
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  const getTxDate = (dateStr: string) => {
    if (dateStr === 'Today') return new Date();
    if (dateStr === 'Yesterday') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };
  // Filter transactions
  const currentPeriodTxs = transactions.filter((t) => {
    const d = getTxDate(t.date);
    return timeframe === 'month' ? d >= startOfMonth : d >= startOfWeek;
  });
  const lastPeriodTxs = transactions.filter((t) => {
    const d = getTxDate(t.date);
    if (timeframe === 'month') {
      return d >= startOfLastMonth && d <= endOfLastMonth;
    } else {
      return d >= startOfLastWeek && d < startOfWeek;
    }
  });
  const currentExpenses = currentPeriodTxs.filter((t) => t.amount < 0);
  const currentIncome = currentPeriodTxs.filter((t) => t.amount > 0);
  const lastExpenses = lastPeriodTxs.filter((t) => t.amount < 0);
  const lastIncome = lastPeriodTxs.filter((t) => t.amount > 0);
  const totalExpenses = currentExpenses.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const totalIncome = currentIncome.reduce((sum, t) => sum + t.amount, 0);
  const lastTotalExpenses = lastExpenses.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const lastTotalIncome = lastIncome.reduce((sum, t) => sum + t.amount, 0);
  // A. Spending Breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    currentExpenses.forEach((t) => {
      breakdown[t.category] = (breakdown[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(breakdown).
    map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? value / totalExpenses * 100 : 0
    })).
    sort((a, b) => b.value - a.value);
  }, [currentExpenses, totalExpenses]);
  const biggestCategory = categoryBreakdown[0];
  const lastCategoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    lastExpenses.forEach((t) => {
      breakdown[t.category] = (breakdown[t.category] || 0) + Math.abs(t.amount);
    });
    return breakdown;
  }, [lastExpenses]);
  const categoryComparison =
  biggestCategory && lastCategoryBreakdown[biggestCategory.name] ?
  (biggestCategory.value - lastCategoryBreakdown[biggestCategory.name]) /
  lastCategoryBreakdown[biggestCategory.name] *
  100 :
  0;
  // B. Monthly Trends
  const expenseChange =
  lastTotalExpenses > 0 ?
  (totalExpenses - lastTotalExpenses) / lastTotalExpenses * 100 :
  0;
  const incomeChange =
  lastTotalIncome > 0 ?
  (totalIncome - lastTotalIncome) / lastTotalIncome * 100 :
  0;
  const trendData = [
  {
    name: timeframe === 'month' ? 'Last Month' : 'Last Week',
    Expenses: lastTotalExpenses,
    Income: lastTotalIncome
  },
  {
    name: timeframe === 'month' ? 'This Month' : 'This Week',
    Expenses: totalExpenses,
    Income: totalIncome
  }];

  // C. Savings Insights
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? savings / totalIncome * 100 : 0;
  const avgDailySavings = savings / (timeframe === 'month' ? now.getDate() : 7);
  const projectedSavings3Months = avgDailySavings * 90;
  // D. Recurring Expenses
  const recurringExpenses = currentExpenses.filter((t) => t.recurring);
  const totalRecurring = recurringExpenses.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  // E. Budget Alerts
  const budgetAlerts = categoryBreakdown.
  map((cat) => {
    const budget = budgets[cat.name] || 0;
    const spent = cat.value;
    const exceeded = budget > 0 && spent > budget;
    return {
      category: cat.name,
      budget,
      spent,
      exceeded,
      overage: exceeded ? spent - budget : 0
    };
  }).
  filter((alert) => alert.exceeded);
  // F. Cash Flow (simplified weekly view)
  const cashFlowData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const dayExpenses = currentExpenses.
      filter((t) => {
        const d = getTxDate(t.date);
        return d.getDay() === (i + 1) % 7;
      }).
      reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const dayIncome = currentIncome.
      filter((t) => {
        const d = getTxDate(t.date);
        return d.getDay() === (i + 1) % 7;
      }).
      reduce((sum, t) => sum + t.amount, 0);
      return {
        day,
        Expenses: dayExpenses,
        Income: dayIncome
      };
    });
  }, [currentExpenses, currentIncome]);
  // G. Personalized Recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (totalRecurring > totalExpenses * 0.3) {
      recs.push(
        `Your subscriptions cost ${currencySymbol}${totalRecurring.toFixed(0)}/month - consider reviewing them`
      );
    }
    if (budgetAlerts.length > 0) {
      recs.push(
        `You've exceeded ${budgetAlerts.length} budget${budgetAlerts.length > 1 ? 's' : ''} this ${timeframe}`
      );
    }
    if (biggestCategory && biggestCategory.percentage > 40) {
      recs.push(
        `${biggestCategory.name} is ${biggestCategory.percentage.toFixed(0)}% of your spending - try to reduce it`
      );
    }
    if (savingsRate < 20 && totalIncome > 0) {
      recs.push(
        `Your savings rate is ${savingsRate.toFixed(0)}% - aim for at least 20%`
      );
    }
    if (recs.length === 0) {
      recs.push('Great job! Your spending is well-balanced.');
    }
    return recs.slice(0, 4);
  }, [
  totalRecurring,
  totalExpenses,
  budgetAlerts,
  biggestCategory,
  savingsRate,
  totalIncome,
  currencySymbol,
  timeframe]
  );
  // H. Where Your Money Went (Top 3 categories)
  const topCategories = categoryBreakdown.slice(0, 3);
  // I. Anomaly Detection
  const anomalies = useMemo(() => {
    const avgByCategory: Record<string, number> = {};
    const countByCategory: Record<string, number> = {};
    // Calculate historical average
    transactions.
    filter((t) => t.amount < 0).
    forEach((t) => {
      avgByCategory[t.category] =
      (avgByCategory[t.category] || 0) + Math.abs(t.amount);
      countByCategory[t.category] = (countByCategory[t.category] || 0) + 1;
    });
    Object.keys(avgByCategory).forEach((cat) => {
      avgByCategory[cat] = avgByCategory[cat] / countByCategory[cat];
    });
    return categoryBreakdown.
    map((cat) => {
      const avg = avgByCategory[cat.name] || 0;
      const multiplier = avg > 0 ? cat.value / avg : 0;
      return {
        category: cat.name,
        current: cat.value,
        average: avg,
        multiplier,
        isAnomaly: multiplier >= 2
      };
    }).
    filter((a) => a.isAnomaly);
  }, [categoryBreakdown, transactions]);
  // J. Spending Forecast
  const avgDailyExpense =
  totalExpenses / (timeframe === 'month' ? now.getDate() : 7);
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const daysRemaining = daysInMonth - now.getDate();
  const projectedMonthlyExpense =
  totalExpenses + avgDailyExpense * daysRemaining;
  const projectedBalance = totalIncome - projectedMonthlyExpense;
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.2
      }
    }
  };
  const SectionCard = ({
    id,
    title,
    icon: Icon,
    children,
    defaultExpanded = false






  }: {id: string;title: string;icon: React.ElementType;children: React.ReactNode;defaultExpanded?: boolean;}) => {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-50 dark:border-[#3A3A3C] overflow-hidden">
        
        <div className="flex items-center gap-3 p-6 pb-0">
          <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
            <Icon size={20} className="text-emerald" />
          </div>
          <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
            {title}
          </h3>
        </div>
        <div className="px-6 pb-6 pt-4">{children}</div>
      </motion.div>);

  };
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream dark:bg-[#1C1C1E]">
        <h1 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7] mb-4">
          Financial Insights
        </h1>
        <div className="flex bg-gray-100 dark:bg-[#2C2C2E] p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('month')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${timeframe === 'month' ? 'bg-white dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${timeframe === 'week' ? 'bg-white dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            
            Weekly
          </button>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] p-5 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
            
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-500" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Expenses
              </p>
            </div>
            <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
              {currencySymbol}
              {totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            {expenseChange !== 0 &&
            <p
              className={`text-xs font-bold mt-1 ${expenseChange > 0 ? 'text-red-500' : 'text-emerald'}`}>
              
                {expenseChange > 0 ? '+' : ''}
                {expenseChange.toFixed(1)}% vs last {timeframe}
              </p>
            }
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] p-5 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
            
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Income
              </p>
            </div>
            <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
              {currencySymbol}
              {totalIncome.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            {incomeChange !== 0 &&
            <p
              className={`text-xs font-bold mt-1 ${incomeChange > 0 ? 'text-emerald' : 'text-red-500'}`}>
              
                {incomeChange > 0 ? '+' : ''}
                {incomeChange.toFixed(1)}% vs last {timeframe}
              </p>
            }
          </motion.div>
        </div>

        {/* A. Spending Breakdown */}
        <SectionCard
          id="breakdown"
          title="Spending Breakdown"
          icon={TrendingDown}
          defaultExpanded>
          
          {categoryBreakdown.length > 0 ?
          <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value">
                  
                    {categoryBreakdown.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} />

                  )}
                  </Pie>
                  <Tooltip
                  formatter={(value: number) =>
                  `${currencySymbol}${value.toFixed(2)}`
                  } />
                
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-4">
                {categoryBreakdown.map((cat, i) =>
              <div
                key={cat.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#3A3A3C] rounded-xl">
                
                    <div className="flex items-center gap-3">
                      <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[i % COLORS.length]
                    }} />
                  
                      <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                        {CATEGORY_EMOJIS[cat.name] || '📦'} {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                        {currencySymbol}
                        {cat.value.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cat.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
              )}
              </div>

              {biggestCategory && categoryComparison !== 0 &&
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    💡 You spent{' '}
                    {categoryComparison > 0 ?
                `${categoryComparison.toFixed(0)}% more` :
                `${Math.abs(categoryComparison).toFixed(0)}% less`}{' '}
                    on {biggestCategory.name} than last {timeframe}
                  </p>
                </div>
            }
            </> :

          <p className="text-sm text-gray-500 text-center py-8">
              No expenses this period
            </p>
          }
        </SectionCard>

        {/* B. Monthly Trends */}
        <SectionCard id="trends" title="Trends" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                formatter={(value: number) =>
                `${currencySymbol}${value.toFixed(2)}`
                } />
              
              <Bar dataKey="Expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Income" fill="#0D6B4B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {expenseChange !== 0 &&
          <div
            className={`mt-4 p-4 rounded-xl border ${expenseChange > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 'bg-emerald/5 dark:bg-emerald/10 border-emerald/10 dark:border-emerald/20'}`}>
            
              <p
              className={`text-sm font-bold ${expenseChange > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald'}`}>
              
                {expenseChange > 0 ? '⚠️' : '✅'} Your expenses{' '}
                {expenseChange > 0 ? 'increased' : 'decreased'} by{' '}
                {Math.abs(expenseChange).toFixed(1)}%
                {biggestCategory && expenseChange > 0 ?
              `, mainly due to ${biggestCategory.name}` :
              ''}
              </p>
            </div>
          }
        </SectionCard>

        {/* C. Savings Insights */}
        <SectionCard id="savings" title="Savings Insights" icon={Target}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Savings Rate
              </span>
              <span
                className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-emerald' : 'text-amber-500'}`}>
                
                {savingsRate.toFixed(1)}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 dark:bg-[#3A3A3C] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${savingsRate >= 20 ? 'bg-emerald' : 'bg-amber-500'}`}
                style={{
                  width: `${Math.min(savingsRate, 100)}%`
                }} />
              
            </div>

            <div className="p-4 bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-xl">
              <p className="text-sm font-bold text-emerald mb-1">
                💰 Current Savings
              </p>
              <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                {currencySymbol}
                {savings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            {projectedSavings3Months > 0 &&
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  📈 At this rate, you'll save {currencySymbol}
                  {projectedSavings3Months.toFixed(0)} in 3 months
                </p>
              </div>
            }
          </div>
        </SectionCard>

        {/* D. Recurring Expenses */}
        {recurringExpenses.length > 0 &&
        <SectionCard
          id="recurring"
          title="Recurring Expenses"
          icon={RefreshCw}>
          
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-xl mb-4">
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-1">
                💳 Total Subscriptions
              </p>
              <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                {currencySymbol}
                {totalRecurring.toFixed(0)}/month
              </p>
            </div>

            <div className="space-y-2">
              {recurringExpenses.map((tx) =>
            <div
              key={tx.id}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#3A3A3C] rounded-xl">
              
                  <div>
                    <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                      {tx.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {tx.recurringInterval}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                    {currencySymbol}
                    {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
            )}
            </div>
          </SectionCard>
        }

        {/* E. Budget Alerts */}
        {budgetAlerts.length > 0 &&
        <SectionCard id="alerts" title="Budget Alerts" icon={AlertTriangle}>
            <div className="space-y-3">
              {budgetAlerts.map((alert) =>
            <div
              key={alert.category}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl">
              
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">
                        ⚠️ {alert.category}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Exceeded by {currencySymbol}
                        {alert.overage.toFixed(0)}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {(alert.spent / alert.budget * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                    <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${Math.min(alert.spent / alert.budget * 100, 100)}%`
                  }} />
                
                  </div>
                </div>
            )}
            </div>
          </SectionCard>
        }

        {/* F. Cash Flow */}
        <SectionCard id="cashflow" title="Cash Flow" icon={DollarSign}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                formatter={(value: number) =>
                `${currencySymbol}${value.toFixed(2)}`
                } />
              
              <Area
                type="monotone"
                dataKey="Income"
                stackId="1"
                stroke="#0D6B4B"
                fill="#0D6B4B"
                fillOpacity={0.6} />
              
              <Area
                type="monotone"
                dataKey="Expenses"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6} />
              
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* G. Personalized Recommendations */}
        <SectionCard
          id="recommendations"
          title="Recommendations"
          icon={Lightbulb}>
          
          <div className="space-y-3">
            {recommendations.map((rec, i) =>
            <div
              key={i}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
              
                <Lightbulb
                size={20}
                className="text-amber-500 shrink-0 mt-0.5" />
              
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  {rec}
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* H. Where Your Money Went */}
        {topCategories.length > 0 &&
        <SectionCard id="timeline" title="Where Your Money Went" icon={Clock}>
            <div className="space-y-3">
              {topCategories.map((cat, i) =>
            <div
              key={cat.name}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#3A3A3C] rounded-xl">
              
                  <div className="text-3xl">
                    {CATEGORY_EMOJIS[cat.name] || '📦'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                      {cat.name}
                    </p>
                    <div className="w-full h-2 bg-gray-200 dark:bg-[#4A4A4C] rounded-full overflow-hidden mt-2">
                      <div
                    className="h-full bg-emerald rounded-full"
                    style={{
                      width: `${cat.percentage}%`
                    }} />
                  
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                      {currencySymbol}
                      {cat.value.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
            )}
            </div>
          </SectionCard>
        }

        {/* I. Anomaly Detection */}
        {anomalies.length > 0 &&
        <SectionCard id="anomalies" title="Unusual Spending" icon={Zap}>
            <div className="space-y-3">
              {anomalies.map((anomaly) =>
            <div
              key={anomaly.category}
              className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-xl">
              
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    ⚡ You spent {anomaly.multiplier.toFixed(1)}x more than
                    usual on {anomaly.category}
                  </p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Average: {currencySymbol}
                      {anomaly.average.toFixed(0)}
                    </span>
                    <span className="font-bold text-charcoal dark:text-[#F5F5F7]">
                      Current: {currencySymbol}
                      {anomaly.current.toFixed(0)}
                    </span>
                  </div>
                </div>
            )}
            </div>
          </SectionCard>
        }

        {/* J. Spending Forecast */}
        {timeframe === 'month' &&
        <SectionCard id="forecast" title="Spending Forecast" icon={Sparkles}>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                  📊 Projected End-of-Month
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Expenses
                    </p>
                    <p className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                      {currencySymbol}
                      {projectedMonthlyExpense.toFixed(0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Balance
                    </p>
                    <p
                    className={`text-lg font-bold ${projectedBalance >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                    
                      {currencySymbol}
                      {projectedBalance.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {projectedBalance < 0 &&
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    ⚠️ Warning: You may run out of budget in {daysRemaining}{' '}
                    days at this rate
                  </p>
                </div>
            }
            </div>
          </SectionCard>
        }

        {/* K. Weekly Financial Report */}
        <SectionCard id="report" title="Financial Summary" icon={Calendar}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald/5 dark:bg-emerald/10 rounded-xl">
                <p className="text-xs font-bold text-emerald mb-1">Income</p>
                <p className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
                  {currencySymbol}
                  {totalIncome.toFixed(0)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-xs font-bold text-red-500 mb-1">Expenses</p>
                <p className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
                  {currencySymbol}
                  {totalExpenses.toFixed(0)}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl ${savings >= 0 ? 'bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20' : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30'}`}>
              
              <p
                className={`text-sm font-bold mb-1 ${savings >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                
                Net {savings >= 0 ? 'Savings' : 'Deficit'}
              </p>
              <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                {currencySymbol}
                {Math.abs(savings).toFixed(2)}
              </p>
            </div>

            {biggestCategory &&
            <div className="p-4 bg-gray-50 dark:bg-[#3A3A3C] rounded-xl">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                  Top Category
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                    {CATEGORY_EMOJIS[biggestCategory.name] || '📦'}{' '}
                    {biggestCategory.name}
                  </span>
                  <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                    {currencySymbol}
                    {biggestCategory.value.toFixed(0)}
                  </span>
                </div>
              </div>
            }

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                💡 Advice
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-200 mt-1">
                {recommendations[0] || 'Keep up the good work!'}
              </p>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </div>);

}