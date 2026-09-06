"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon, MailOpenIcon, MailIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { markMessageRead, deleteMessage } from "@/lib/actions/messages";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@prisma/client";

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();

  async function toggleRead(id: string, read: boolean) {
    const result = await markMessageRead(id, read);
    if (!result.success) toast.error(result.error);
    else router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteMessage(id);
    if (!result.success) toast.error(result.error);
    else {
      toast.success("Message deleted.");
      router.refresh();
    }
  }

  if (messages.length === 0) {
    return <EmptyState icon={MailIcon} title="No messages yet" description="Submissions from the contact form will appear here." />;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <Card key={message.id} className={message.read ? undefined : "border-accent/40"}>
          <CardBody>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{message.name}</p>
                  {!message.read && <Badge variant="accent">New</Badge>}
                </div>
                <a href={`mailto:${message.email}`} className="text-sm text-accent hover:underline">
                  {message.email}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <span className="mr-2 text-xs text-muted">{formatDateTime(message.createdAt)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRead(message.id, !message.read)}
                  title={message.read ? "Mark unread" : "Mark read"}
                >
                  <MailOpenIcon className="h-4 w-4" />
                </Button>
                <ConfirmDialog
                  title="Delete this message?"
                  description="This cannot be undone."
                  onConfirm={() => handleDelete(message.id)}
                  trigger={
                    <Button variant="ghost" size="sm" title="Delete">
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                  }
                />
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap text-muted">{message.message}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
