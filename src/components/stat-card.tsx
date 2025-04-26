import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: React.ReactNode;
  totalCount?: number;
  uniqueCount?: number;
  totalLabel: string;
  uniqueLabel: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  totalCount,
  uniqueCount,
  totalLabel,
  uniqueLabel,
}) => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-md text-muted-foreground">{totalLabel}</p>
        <div className="text-xl font-bold">{totalCount ?? 0}</div>
      </CardContent>
      <CardContent>
        <p className="text-md text-muted-foreground">{uniqueLabel}</p>
        <div className="text-xl font-bold">{uniqueCount ?? 0}</div>
      </CardContent>
    </Card>
  );
};
