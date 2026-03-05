import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  // Get all conversations with last message and unread count
  const conversations = await prisma.$queryRaw<any[]>`
    WITH RankedMessages AS (
      SELECT 
        m.*,
        CASE 
          WHEN m."senderId" = ${user.id} THEN m."receiverId"
          ELSE m."senderId"
        END as "partnerId",
        ROW_NUMBER() OVER (
          PARTITION BY 
            CASE 
              WHEN m."senderId" = ${user.id} THEN m."receiverId"
              ELSE m."senderId"
            END
          ORDER BY m."sentAt" DESC
        ) as rn
      FROM "message" m
      WHERE m."senderId" = ${user.id} OR m."receiverId" = ${user.id}
    ),
    UnreadCounts AS (
      SELECT 
        "senderId" as "partnerId",
        COUNT(*) as "unreadCount"
      FROM "message"
      WHERE "receiverId" = ${user.id} AND "isRead" = false
      GROUP BY "senderId"
    )
    SELECT 
      rm."partnerId",
      rm.id as "lastMessageId",
      rm."senderId" as "lastMessageSenderId",
      rm.content as "lastMessageContent",
      rm."sentAt" as "lastMessageSentAt",
      COALESCE(uc."unreadCount", 0)::int as "unreadCount",
      u.id as "userId",
      u.name as "userName",
      u.email as "userEmail",
      u.image as "userImage",
      u.role as "userRole"
    FROM RankedMessages rm
    LEFT JOIN UnreadCounts uc ON uc."partnerId" = rm."partnerId"
    INNER JOIN "user" u ON u.id = rm."partnerId"
    WHERE rm.rn = 1
    ORDER BY rm."sentAt" DESC
  `;

  const formatted = conversations.map((conv) => ({
    partner: {
      id: conv.partnerId,
      name: conv.userName,
      email: conv.userEmail,
      image: conv.userImage,
      role: conv.userRole,
    },
    lastMessage: {
      id: conv.lastMessageId,
      senderId: conv.lastMessageSenderId,
      content: conv.lastMessageContent,
      sentAt: conv.lastMessageSentAt,
    },
    unreadCount: conv.unreadCount,
  }));

  return NextResponse.json(formatted);
}
