import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersRound, FileText, Inbox, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SystemStat } from "@/types/supabase";

interface Stat {
  title: string;
  value: number;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Total Users",
      value: 0,
      change: "0%",
      icon: UsersRound,
      description: "from last month"
    },
    {
      title: "Documents Created",
      value: 0,
      change: "0%",
      icon: FileText,
      description: "from last month"
    },
    {
      title: "Pending Submissions",
      value: 0,
      change: "0%",
      icon: Inbox,
      description: "from last month"
    },
    {
      title: "Issues Reported",
      value: 0,
      change: "0%",
      icon: AlertTriangle,
      description: "from last month"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching dashboard statistics...");
        const { data, error } = await supabase
          .from('system_stats')
          .select<'*', SystemStat>('*');
        
        if (error) {
          console.error("Database error:", error);
          throw error;
        }

        console.log("Stats data received:", data);

        if (data && data.length > 0) {
          // Create a copy of current stats to update
          const updatedStats = [...stats];
          
          // Update stats with values from database by matching stat_name
          data.forEach(stat => {
            const statIndex = updatedStats.findIndex(s => s.title === stat.stat_name);
            if (statIndex !== -1) {
              updatedStats[statIndex] = {
                ...updatedStats[statIndex],
                value: stat.stat_value,
                change: `${stat.change_percentage >= 0 ? '+' : ''}${stat.change_percentage}%`
              };
            }
          });
          
          setStats(updatedStats);
          console.log("Stats updated:", updatedStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-rocket-gray-800 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <stat.icon className="h-5 w-5 text-blue-400 mr-2" />
              {isLoading ? (
                <div className="h-7 w-16 bg-rocket-gray-700 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold">{stat.value.toLocaleString()}</span>
              )}
            </div>
            {isLoading ? (
              <div className="h-4 w-20 bg-rocket-gray-700 animate-pulse rounded mt-2" />
            ) : (
              <p className={`text-xs ${
                stat.change.startsWith('+') 
                ? 'text-green-400' 
                : stat.change.startsWith('-') 
                  ? 'text-red-400' 
                  : 'text-gray-400'
              } mt-2`}>
                {stat.change} {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
