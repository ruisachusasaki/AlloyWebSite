import { z } from "zod";
import { insertConversationSchema, insertMessageSchema, conversations, messages } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    getUser: {
      method: "GET" as const,
      path: "/api/auth/user",
      responses: {
        200: z.object({
          id: z.string(),
          email: z.string().nullable(),
          firstName: z.string().nullable(),
          lastName: z.string().nullable(),
          profileImageUrl: z.string().nullable(),
        }).nullable(),
      },
    },
  },
  conversations: {
    list: {
      method: "GET" as const,
      path: "/api/conversations",
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/conversations/:id",
      responses: {
        200: z.object({
          id: z.number(),
          title: z.string(),
          createdAt: z.string(), // timestamp comes as string in JSON
          messages: z.array(z.custom<typeof messages.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/conversations",
      input: z.object({
        title: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof conversations.$inferSelect>(),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/conversations/:id",
      responses: {
        204: z.void(),
      },
    },
    sendMessage: {
      method: "POST" as const,
      path: "/api/conversations/:id/messages",
      input: z.object({
        content: z.string(),
      }),
      responses: {
        // This endpoint streams SSE, so standard JSON response types apply only to errors
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
