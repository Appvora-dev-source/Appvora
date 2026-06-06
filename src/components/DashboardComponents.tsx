import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/Utilities";
export { EmptyState, LoadingState, ErrorState };

// StatCard component for dashboard stats
export function StatCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        <p className="text-xs text-neutral-400 mt-1">{change}</p>
      </CardContent>
    </Card>
  );
}

// ApplicationCard for tracking entries
export function ApplicationCard({ role, company, status, date }: { role: string; company: string; status: string; date: string }) {
  const statusColors: Record<string, "default" | "success" | "warning"> = {
    interview: "success",
    reviewing: "warning",
    applied: "default",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
      <div>
        <p className="font-medium text-neutral-900">{role}</p>
        <p className="text-sm text-neutral-500">{company}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={statusColors[status] || "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <span className="text-xs text-neutral-400">{date}</span>
      </div>
    </div>
  );
}
