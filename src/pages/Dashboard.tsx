import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficChart } from "@/components/traffic-chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookIcon, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { fetchRepositories, fetchRepositoryTraffic } from "../services/api";
import { StatCard } from "@/components/stat-card";
import { Repository } from "../types/repository";
import { TrafficPoint, TrafficData } from "../types/traffic";
import { DashboardHeader } from "@/components/dashboard-header";
const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

const initialDateRange = (): DateRange => {
  const today = new Date();
  const startDate = addDays(today, -7);
  return { from: startDate, to: today };
};

function App() {
  const [currentDateRange, setCurrentDateRange] = useState<
    DateRange | undefined
  >(initialDateRange());
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [clonesChartData, setClonesChartData] = useState<TrafficPoint[]>([]);
  const [viewsChartData, setViewsChartData] = useState<TrafficPoint[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [trafficTotals, setTrafficTotals] = useState<
    TrafficData["totals"] | null
  >(null);

  useEffect(() => {
    fetchRepositories().then((repositories) => {
      setRepositories(repositories);
      if (repositories.length > 0) {
        handleRepoSelect(repositories[0]);
      }
    });
  }, []);

  const getTrafficData = async (repoName: string, range?: DateRange) => {
    if (!repoName) return;

    const startDate = range?.from ? formatDate(range.from) : undefined;
    const endDate = range?.to ? formatDate(range.to) : undefined;

    try {
      const traffic: TrafficData | null = await fetchRepositoryTraffic(
        repoName,
        startDate,
        endDate
      );

      if (traffic && traffic.chartData) {
        setClonesChartData(traffic.chartData.clonesChartData || []);
        setViewsChartData(traffic.chartData.viewsChartData || []);
        setTrafficTotals(traffic.totals);
      } else {
        setClonesChartData([]);
        setViewsChartData([]);
        setTrafficTotals(null);
      }
    } catch (error) {
      setClonesChartData([]);
      setViewsChartData([]);
      setTrafficTotals(null);
    }
  };

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
    getTrafficData(repo.name, currentDateRange);
  };

  const handleDatePresetClick = (daysAgo: number) => {
    if (!selectedRepo) return;
    const today = new Date();
    const startDate = addDays(today, -daysAgo);
    const newRange: DateRange = { from: startDate, to: today };
    setCurrentDateRange(newRange);
    getTrafficData(selectedRepo.name, newRange);
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setCurrentDateRange(range);
    if (selectedRepo) {
      getTrafficData(selectedRepo.name, range);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-svh">
        <Sidebar>
          <SidebarHeader className="p-4 font-medium">
            GitHub Repositories
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            {repositories.map((repo) => (
              <Button
                key={repo.name}
                variant={
                  selectedRepo?.name === repo.name ? "secondary" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => handleRepoSelect(repo)}
              >
                <BookIcon className="mr-2 h-4 w-4" />
                <span className="truncate">{repo.name}</span>
              </Button>
            ))}
          </SidebarContent>
        </Sidebar>
        <main className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <DashboardHeader
              selectedRepo={selectedRepo}
              currentDateRange={currentDateRange}
              handleDatePresetClick={handleDatePresetClick}
              handleCustomDateSelect={handleCustomDateSelect}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>
                  {selectedRepo ? `${selectedRepo.name}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex text-muted-foreground">
                  Information about the repo and total views and clones. You can
                  select a date range to see the traffic for that range.
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <TrafficChart
              title="Views"
              description="Showing views for selected date range"
              data={viewsChartData}
              dataKeys={["views", "uniqueViews"]}
            />
            <TrafficChart
              title="Clones"
              description="Showing clones for selected date range"
              data={clonesChartData}
              dataKeys={["clones", "uniqueClones"]}
            />
          </div>
          <div className="flex gap-4 pt-4 h-full">
            <StatCard
              title={
                <div className="flex gap-2">
                  All time views
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Number of total and unique views since start of data
                          gathering.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
              totalCount={trafficTotals?.views}
              uniqueCount={trafficTotals?.uniqueViews}
              totalLabel="Total views"
              uniqueLabel="Unique views"
            />
            <StatCard
              title={
                <div className="flex gap-2">
                  All time clones
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Number of total and unique clones since start of data
                          gathering.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
              totalCount={trafficTotals?.clones}
              uniqueCount={trafficTotals?.uniqueClones}
              totalLabel="Total clones"
              uniqueLabel="Unique clones"
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
