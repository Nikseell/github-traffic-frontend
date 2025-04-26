import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Repository } from "@/types/repository";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DashboardHeaderProps {
  selectedRepo: Repository | null;
  currentDateRange: DateRange | undefined;
  handleDatePresetClick: (daysAgo: number) => void;
  handleCustomDateSelect: (range: DateRange | undefined) => void;
}

export function DashboardHeader({
  selectedRepo,
  currentDateRange,
  handleDatePresetClick,
  handleCustomDateSelect,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4 w-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePresetClick(7)}
          disabled={!selectedRepo}
        >
          Last 7 days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePresetClick(14)}
          disabled={!selectedRepo}
        >
          Last 14 days
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedRepo}
              className="w-[240px] justify-start text-left font-normal"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              {currentDateRange?.from ? (
                currentDateRange.to ? (
                  <>
                    {format(currentDateRange.from, "LLL dd, y")} -{" "}
                    {format(currentDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(currentDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={currentDateRange}
              onSelect={handleCustomDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
