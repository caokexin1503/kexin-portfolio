import { prisma } from "@/lib/db";
import { MessageList } from "@/components/admin/MessageList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted">Submissions from the public contact form.</p>
      <div className="mt-8">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
