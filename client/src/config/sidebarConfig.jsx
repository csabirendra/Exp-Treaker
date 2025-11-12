// src/config/sidebarConfig.js
import { Home, CreditCard, PieChart, TrendingUp, Settings } from "lucide-react";

export const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "budget", label: "Budget", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: Settings },
];
