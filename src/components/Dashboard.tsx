import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { EmployeeDashboard } from './dashboards/EmployeeDashboard';

export function Dashboard() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  } else if (profile?.role === 'manager') {
    return <ManagerDashboard />;
  } else if (profile?.role === 'employee') {
    return <EmployeeDashboard />;
  }

  return null;
}