import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Download, RotateCcw, Trash2 } from 'lucide-react';

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [avoidFoods, setAvoidFoods] = useState(() => {
    const saved = localStorage.getItem('avoidFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [monitorFoods, setMonitorFoods] = useState(() => {
    const saved = localStorage.getItem('monitorFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('habitLogs');
    return saved ? JSON.parse(saved) : {};
  });

  const [finances, setFinances] = useState(() => {
    const saved = localStorage.getItem('finances');
    return saved ? JSON.parse(saved) : {
      income: [],
      expenses: [],
      incoming: []
    };
  });

  const [newHabit, setNewHabit] = useState('');
  const [newAvoidFood, setNewAvoidFood] = useState('');
  const [newMonitorFood, setNewMonitorFood] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('today');

  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [incomingAmount, setIncomingAmount] = useState('');
  const [incomingPerson, setIncomingPerson] = useState('');

  useEffect(() => {
    localStorage.setItem('habitLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('avoidFoods', JSON.stringify(avoidFoods));
  }, [avoidFoods]);

  useEffect(() => {
    localStorage.setItem('monitorFoods', JSON.stringify(monitorFoods));
  }, [monitorFoods]);

  const dateKey = (date) => date.toISOString().split('T')[0];
  const todayKey = dateKey(currentDate);

  const toggleHabit = (habit) => {
    const key = todayKey;
    if (!logs[key]) logs[key] = {};
    
    setLogs({
      ...logs,
      [key]: {
        ...logs[key],
        [habit]: !logs[key][habit]
      }
    });
  };

  const addHabit = () => {
    if (newHabit.trim() && !habits.includes(newHabit)) {
      setHabits([...habits, newHabit]);
      setNewHabit('');
    }
  };

  const removeHabit = (habit) => {
    setHabits(habits.filter(h => h !== habit));
  };

  const addAvoidFood = () => {
    if (newAvoidFood.trim() && !avoidFoods.includes(newAvoidFood)) {
      setAvoidFoods([...avoidFoods, newAvoidFood]);
      setNewAvoidFood('');
    }
  };

  const removeAvoidFood = (food) => {
    setAvoidFoods(avoidFoods.filter(f => f !== food));
  };

  const addMonitorFood = () => {
    if (newMonitorFood.trim() && !monitorFoods.includes(newMonitorFood)) {
      setMonitorFoods([...monitorFoods, newMonitorFood]);
      setNewMonitorFood('');
    }
  };

  const removeMonitorFood = (food) => {
    setMonitorFoods(monitorFoods.filter(f => f !== food));
  };

  const incrementMonitorFood = (food) => {
    const key = todayKey;
    if (!logs[key]) logs[key] = {};
    const current = logs[key][`monitor_${food}`] || 0;
    
    setLogs({
      ...logs,
      [key]: {
        ...logs[key],
        [`monitor_${food}`]: current + 1
      }
    });
  };

  const getMonitorCount = (food) => {
    return logs[todayKey]?.[`monitor_${food}`] || 0;
  };

  const addIncome = () => {
    if (incomeAmount && incomeSource) {
      const today = new Date().toISOString().split('T')[0];
      setFinances({
        ...finances,
        income: [...finances.income, {
          id: Date.now(),
          date: today,
          amount: parseFloat(incomeAmount),
          source: incomeSource
        }]
      });
      setIncomeAmount('');
      setIncomeSource('');
    }
  };

  const addExpense = () => {
    if (expenseAmount && expenseCategory) {
      const today = new Date().toISOString().split('T')[0];
      setFinances({
        ...finances,
        expenses: [...finances.expenses, {
          id: Date.now(),
          date: today,
          amount: parseFloat(expenseAmount),
          category: expenseCategory
        }]
      });
      setExpenseAmount('');
      setExpenseCategory('');
    }
  };

  const addIncoming = () => {
    if (incomingAmount && incomingPerson) {
      const today = new Date().toISOString().split('T')[0];
      setFinances({
        ...finances,
        incoming: [...finances.incoming, {
          id: Date.now(),
          date: today,
          amount: parseFloat(incomingAmount),
          from: incomingPerson,
          status: 'pending'
        }]
      });
      setIncomingAmount('');
      setIncomingPerson('');
    }
  };

  const approveIncoming = (id) => {
    setFinances({
      ...finances,
      incoming: finances.incoming.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    });
  };

  const deleteIncome = (id) => {
    setFinances({
      ...finances,
      income: finances.income.filter(item => item.id !== id)
    });
  };

  const deleteExpense = (id) => {
    setFinances({
      ...finances,
      expenses: finances.expenses.filter(item => item.id !== id)
    });
  };

  const deleteIncoming = (id) => {
    setFinances({
      ...finances,
      incoming: finances.incoming.filter(item => item.id !== id)
    });
  };

  const getTodayFinances = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayIncome = finances.income.filter(i => i.date === today);
    const todayExpenses = finances.expenses.filter(i => i.date === today);
    const todayIncoming = finances.incoming.filter(i => i.date === today);

    return {
      income: todayIncome.reduce((sum, i) => sum + i.amount, 0),
      expenses: todayExpenses.reduce((sum, i) => sum + i.amount, 0),
      incoming: todayIncoming.reduce((sum, i) => sum + i.amount, 0),
      list: { todayIncome, todayExpenses, todayIncoming }
    };
  };

  const getMonthFinances = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const monthIncome = finances.income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const monthExpenses = finances.expenses.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const monthIncoming = finances.incoming.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    return {
      totalIncome: monthIncome.reduce((sum, i) => sum + i.amount, 0),
      totalExpenses: monthExpenses.reduce((sum, i) => sum + i.amount, 0),
      totalIncoming: monthIncoming.reduce((sum, i) => sum + i.amount, 0),
      approvedIncoming: monthIncoming.filter(i => i.status === 'approved').reduce((sum, i) => sum + i.amount, 0),
      list: { monthIncome, monthExpenses, monthIncoming }
    };
  };

  const getMonthData = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = dateKey(date);
      const dayLogs = logs[key] || {};
      
      const habitsCompleted = habits.filter(h => dayLogs[h]).length;
      const habitScore = habits.length > 0 ? Math.round((habitsCompleted / habits.length) * 100) : 0;
      
      const foodsAvoided = avoidFoods.filter(f => dayLogs[f]).length;
      const foodScore = avoidFoods.length > 0 ? Math.round((foodsAvoided / avoidFoods.length) * 100) : 0;
      
      const totalScore = Math.round((habitScore + foodScore) / 2);
      
      data.push({
        date: day,
        habits: habitScore,
        food: foodScore,
        overall: totalScore
      });
    }
    return data;
  };

  const getHabitStats = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const habitStats = habits.map(habit => {
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const key = dateKey(date);
        if (logs[key] && logs[key][habit]) count++;
      }
      return {
        type: 'habit',
        name: habit,
        completed: count,
        total: daysInMonth,
        percentage: Math.round((count / daysInMonth) * 100)
      };
    });

    const foodStats = avoidFoods.map(food => {
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const key = dateKey(date);
        if (logs[key] && logs[key][food]) count++;
      }
      return {
        type: 'food',
        name: food,
        avoided: count,
        total: daysInMonth,
        percentage: Math.round((count / daysInMonth) * 100)
      };
    });

    return { habitStats, foodStats };
  };

  const getStreak = (item, type = 'habit') => {
    let streak = 0;
    let date = new Date();
    
    while (true) {
      const key = dateKey(date);
      if (logs[key] && logs[key][item]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const monthData = getMonthData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">Tracker</h1>
          <p className="text-slate-400 text-sm">Track habits, food, and finances</p>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-2 rounded font-medium transition ${
              view === 'today' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded font-medium transition ${
              view === 'month' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setView('finance')}
            className={`px-4 py-2 rounded font-medium transition ${
              view === 'finance' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Finance
          </button>
        </div>

        {view === 'today' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}
                className="p-2 hover:bg-slate-700 rounded transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="text-lg font-semibold">
                  {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}
                className="p-2 hover:bg-slate-700 rounded transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {habits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-amber-400">Habits</h3>
                <div className="grid gap-3">
                  {habits.map(habit => (
                    <div
                      key={habit}
                      onClick={() => toggleHabit(habit)}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        logs[todayKey] && logs[todayKey][habit]
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{habit}</p>
                        <div className="text-sm">{logs[todayKey] && logs[todayKey][habit] ? '✓' : '○'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {avoidFoods.length > 0 && (
              <div className="space-y-3 border-t border-slate-700 pt-6">
                <h3 className="text-sm font-semibold text-green-400">Foods to Avoid</h3>
                <div className="grid gap-3">
                  {avoidFoods.map(food => (
                    <div
                      key={food}
                      onClick={() => toggleHabit(food)}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        logs[todayKey] && logs[todayKey][food]
                          ? 'bg-green-600 text-slate-50'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{food}</p>
                        <div className="text-sm">{logs[todayKey] && logs[todayKey][food] ? '✓ Avoided' : 'Ate'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {monitorFoods.length > 0 && (
              <div className="space-y-3 border-t border-slate-700 pt-6">
                <h3 className="text-sm font-semibold text-blue-400">Foods to Monitor</h3>
                <div className="grid gap-3">
                  {monitorFoods.map(food => (
                    <div
                      key={food}
                      onClick={() => incrementMonitorFood(food)}
                      className="p-4 rounded-lg cursor-pointer transition bg-slate-800 hover:bg-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{food}</p>
                        <div className="text-2xl font-bold text-blue-400">{getMonitorCount(food)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Add Habit</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                  className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={addHabit}
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded font-medium hover:bg-amber-600 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Add Food to Avoid</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAvoidFood}
                  onChange={(e) => setNewAvoidFood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAvoidFood()}
                  className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={addAvoidFood}
                  className="px-4 py-2 bg-green-600 text-slate-50 rounded font-medium hover:bg-green-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Add Food to Monitor</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMonitorFood}
                  onChange={(e) => setNewMonitorFood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMonitorFood()}
                  className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addMonitorFood}
                  className="px-4 py-2 bg-blue-600 text-slate-50 rounded font-medium hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'month' && (
          <div className="space-y-8">
            
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Daily Score</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={2} name="Overall %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {getHabitStats().habitStats.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <p className="text-sm text-amber-400 font-semibold mb-4">Habits</p>
                <div className="grid gap-3">
                  {getHabitStats().habitStats.map(stat => (
                    <div key={stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">{stat.name}</p>
                        <p className="text-amber-400 font-semibold">{stat.percentage}%</p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getHabitStats().foodStats.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <p className="text-sm text-green-400 font-semibold mb-4">Foods Avoided</p>
                <div className="grid gap-3">
                  {getHabitStats().foodStats.map(stat => (
                    <div key={stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">{stat.name}</p>
                        <p className="text-green-400 font-semibold">{stat.percentage}%</p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'finance' && (
          <div className="space-y-6">
            
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Today</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-sm text-slate-400">Income</p>
                  <p className="text-2xl font-bold text-green-400">₦{getTodayFinances().income.toLocaleString()}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-sm text-slate-400">Expenses</p>
                  <p className="text-2xl font-bold text-red-400">₦{getTodayFinances().expenses.toLocaleString()}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-blue-400">₦{getTodayFinances().incoming.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-green-400 font-semibold mb-3">Add Income</p>
              <div className="flex gap-2">
                <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <input type="text" value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} placeholder="From" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <button onClick={addIncome} className="px-4 py-2 bg-green-600 text-slate-50 rounded font-medium hover:bg-green-700">Add</button>
              </div>
              {getTodayFinances().list.todayIncome.map(income => (
                <div key={income.id} className="mt-2 bg-slate-700 p-2 rounded flex justify-between items-center text-sm">
                  <div><p className="text-slate-50">{income.source}</p><p className="text-slate-400 text-xs">₦{income.amount.toLocaleString()}</p></div>
                  <button onClick={() => deleteIncome(income.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-red-400 font-semibold mb-3">Add Expense</p>
              <div className="flex gap-2">
                <input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <input type="text" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} placeholder="Category" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <button onClick={addExpense} className="px-4 py-2 bg-red-600 text-slate-50 rounded font-medium hover:bg-red-700">Add</button>
              </div>
              {getTodayFinances().list.todayExpenses.map(expense => (
                <div key={expense.id} className="mt-2 bg-slate-700 p-2 rounded flex justify-between items-center text-sm">
                  <div><p className="text-slate-50">{expense.category}</p><p className="text-slate-400 text-xs">₦{expense.amount.toLocaleString()}</p></div>
                  <button onClick={() => deleteExpense(expense.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-blue-400 font-semibold mb-3">Add Incoming Money</p>
              <div className="flex gap-2">
                <input type="number" value={incomingAmount} onChange={(e) => setIncomingAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <input type="text" value={incomingPerson} onChange={(e) => setIncomingPerson(e.target.value)} placeholder="Person" className="flex-1 bg-slate-700 text-slate-50 px-3 py-2 rounded border border-slate-600" />
                <button onClick={addIncoming} className="px-4 py-2 bg-blue-600 text-slate-50 rounded font-medium hover:bg-blue-700">Add</button>
              </div>
              {getTodayFinances().list.todayIncoming.map(incoming => (
                <div key={incoming.id} className="mt-2 bg-slate-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="text-slate-50 font-medium">{incoming.from}</p><p className="text-slate-400 text-xs">₦{incoming.amount.toLocaleString()}</p></div>
                    <span className={`text-xs px-2 py-1 rounded ${incoming.status === 'approved' ? 'bg-green-600' : 'bg-yellow-600'}`}>{incoming.status === 'approved' ? '✓ Approved' : 'Pending'}</span>
                  </div>
                  <div className="flex gap-2">
                    {incoming.status === 'pending' && <button onClick={() => approveIncoming(incoming.id)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">Approve</button>}
                    <button onClick={() => deleteIncoming(incoming.id)} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">This Month</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded"><p className="text-sm text-slate-400">Total Income</p><p className="text-xl font-bold text-green-400">₦{getMonthFinances().totalIncome.toLocaleString()}</p></div>
                <div className="bg-slate-700 p-4 rounded"><p className="text-sm text-slate-400">Total Expenses</p><p className="text-xl font-bold text-red-400">₦{getMonthFinances().totalExpenses.toLocaleString()}</p></div>
                <div className="bg-slate-700 p-4 rounded"><p className="text-sm text-slate-400">Pending</p><p className="text-xl font-bold text-blue-400">₦{getMonthFinances().totalIncoming.toLocaleString()}</p></div>
                <div className="bg-slate-700 p-4 rounded"><p className="text-sm text-slate-400">Net</p><p className={`text-xl font-bold ${getMonthFinances().totalIncome - getMonthFinances().totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>₦{(getMonthFinances().totalIncome - getMonthFinances().totalExpenses).toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
