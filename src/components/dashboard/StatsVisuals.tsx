
import { 
  LineChart, 
  BarChart, 
  PieChart 
} from "@/components/ui/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gauge } from "lucide-react";

const StatsVisuals = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_dashboard_data');
      return data;
    }
  });

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Document Submissions',
      data: [30, 45, 57, 52, 63, 70],
      borderColor: '#F97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
    }]
  };

  const documentTypes = {
    labels: ['Contracts', 'Agreements', 'Legal Forms', 'Wills', 'Other'],
    datasets: [{
      label: 'Document Types',
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#F97316',
        '#2563eb',
        '#10b981',
        '#8b5cf6',
        '#f59e0b'
      ],
    }]
  };

  const userActivity = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Active Users',
      data: [120, 150, 180, 220],
      backgroundColor: '#F97316',
    }]
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-bright-orange-500" />
              Monthly Document Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-bright-orange-500" />
              Document Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart data={documentTypes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-bright-orange-500" />
              Weekly User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart data={userActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsVisuals;
