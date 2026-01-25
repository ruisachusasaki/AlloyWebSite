import { Link, useLocation } from "wouter";
import { useConversations, useCreateConversation, useDeleteConversation } from "@/hooks/use-conversations";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { 
  MessageSquarePlus, 
  Trash2, 
  LogOut, 
  Menu, 
  MessageSquare,
  Loader2,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { data: conversations, isLoading } = useConversations();
  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract ID from /chat/:id
  const currentId = location.startsWith("/chat/") 
    ? parseInt(location.split("/")[2]) 
    : null;

  const handleCreate = async () => {
    try {
      const newConv = await createMutation.mutateAsync();
      setLocation(`/chat/${newConv.id}`);
      setIsMobileOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Delete this conversation?")) {
      await deleteMutation.mutateAsync(id);
      if (currentId === id) {
        setLocation("/");
      }
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-muted/20 border-r">
      <div className="p-4 border-b">
        <Button 
          onClick={handleCreate} 
          disabled={createMutation.isPending}
          className="w-full justify-start gap-2 h-10 shadow-sm"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquarePlus className="h-4 w-4" />
          )}
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-1">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : conversations?.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations?.map((conv) => (
              <Link 
                key={conv.id} 
                href={`/chat/${conv.id}`}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group relative flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/80",
                  currentId === conv.id 
                    ? "bg-muted text-foreground shadow-sm ring-1 ring-border" 
                    : "text-muted-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1 text-left">
                  {conv.title || "New Conversation"}
                </span>
                
                {/* Delete button only visible on hover or active */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2",
                    currentId === conv.id && "opacity-100"
                  )}
                  onClick={(e) => handleDelete(e, conv.id)}
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border bg-muted">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-medium">
                  {user?.firstName?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-medium">
                {user?.firstName || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <ThemeToggle />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            AI Assistant
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full w-[280px] flex-col shrink-0", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 bg-background shadow-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
