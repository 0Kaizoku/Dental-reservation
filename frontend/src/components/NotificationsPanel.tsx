import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToastNotifications } from "@/hooks/use-toast";

const NotificationsPanel = () => {
  const { notifications, clear } = useToastNotifications();

  return (
    <Card className="border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="outline">{notifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 && (
            <div className="text-sm text-muted-foreground">No notifications yet</div>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-md border border-border/20">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-foreground text-sm">{n.title || "Notification"}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {n.description && (
                <div className="text-xs text-muted-foreground mt-1">{n.description}</div>
              )}
            </div>
          ))}
        </div>
        {notifications.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={clear}>Clear all</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
