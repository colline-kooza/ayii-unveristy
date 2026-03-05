"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, Check, CheckCheck, Loader2, Plus, X } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useConversations, useMessageThread, useSendMessage } from "@/hooks/useMessages";
import { useMe } from "@/hooks/useAuth";
import { useUserSearch } from "@/hooks/useUserSearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MessagesPage() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserFromSearch, setSelectedUserFromSearch] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: me } = useMe();
  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: messagesData, isLoading: loadingMessages, fetchNextPage, hasNextPage } = useMessageThread(selectedPartnerId || "");
  const sendMessageMutation = useSendMessage();
  const { data: searchResults, isLoading: searchingUsers } = useUserSearch(userSearchQuery);

  const messages = messagesData?.pages.flatMap(page => page.data) || [];

  // Get selected partner info - either from conversations or from search results
  const selectedConversation = conversations?.find((conv: any) => conv.partner.id === selectedPartnerId);
  const selectedPartner = selectedConversation?.partner || selectedUserFromSearch;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations?.filter((conv: any) =>
    conv.partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSend = async () => {
    if (!message.trim() || !selectedPartnerId) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedPartnerId,
        content: message.trim(),
      });
      setMessage("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSelectUser = (userId: string) => {
    const user = searchResults?.users.find((u: any) => u.id === userId);
    setSelectedPartnerId(userId);
    setSelectedUserFromSearch(user);
    setNewMessageOpen(false);
    setUserSearchQuery("");
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loadingConversations) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      <div className="h-full flex bg-white rounded-xl border border-gray-100 shadow-none overflow-hidden">
        <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Messages</h2>
              <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, or ID..."
                        className="pl-9"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-1">
                      {searchingUsers ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      ) : userSearchQuery.length < 2 ? (
                        <p className="text-xs text-gray-500 text-center py-8">
                          Type at least 2 characters to search
                        </p>
                      ) : searchResults?.users.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-8">
                          No users found
                        </p>
                      ) : (
                        searchResults?.users.map((user: any) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleSelectUser(user.id)}
                          >
                            <Avatar className="h-10 w-10 border border-gray-100">
                              <AvatarImage src={user.image} />
                              <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-xs">
                                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-blue-600 font-bold uppercase">
                                  {user.role}
                                </span>
                                {(user.registrationNumber || user.employeeId) && (
                                  <span className="text-[10px] text-gray-400">
                                    {user.registrationNumber || user.employeeId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 font-bold" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9 h-10 bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs text-gray-500 font-medium">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv: any) => (
                <div
                  key={conv.partner.id}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-blue-50/30 transition-colors ${
                    selectedPartnerId === conv.partner.id ? "bg-blue-50/50 border-l-4 border-l-blue-600" : ""
                  }`}
                  onClick={() => setSelectedPartnerId(conv.partner.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={conv.partner.image} />
                      <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-xs">
                        {conv.partner.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {conv.partner.name}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatTime(conv.lastMessage.sentAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-gray-500 truncate flex-1 font-medium">
                          {conv.lastMessage.senderId === me?.id && "You: "}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <div className="bg-blue-600 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ml-2 shadow-sm shadow-blue-500/20">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50/30">
          {!selectedPartnerId ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Send}
                title="Your messages"
                description="Choose an existing conversation or start a new one to begin connecting"
              />
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-50 bg-white shadow-sm shadow-black/5">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9 border border-gray-100 shadow-sm">
                    <AvatarImage src={selectedPartner?.image} />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-xs">
                      {selectedPartner?.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedPartner?.name}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{selectedPartner?.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-gray-400 font-medium">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {hasNextPage && (
                      <div className="text-center pb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          className="text-blue-600 font-bold text-[10px] uppercase hover:bg-blue-50 transition-all"
                        >
                          Load older messages
                        </Button>
                      </div>
                    )}
                    {messages.map((msg: any) => {
                      const isMe = msg.senderId === me?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm border ${
                              isMe
                                ? "bg-blue-600 text-white rounded-br-none border-blue-500 shadow-blue-500/10"
                                : "bg-white text-gray-900 rounded-bl-none border-gray-100"
                            }`}
                          >
                            <p className="text-xs font-medium whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                            <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${
                              isMe ? "text-white/80" : "text-gray-400"
                            }`}>
                              <span className="text-[9px] font-bold">
                                {formatTime(msg.sentAt)}
                              </span>
                              {isMe && (
                                msg.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-50">
                <div className="flex items-center space-x-2 bg-gray-50/50 p-1 rounded-xl border border-gray-100">
                  <Input
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none text-sm h-10"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    onClick={handleSend} 
                    className="bg-blue-600 hover:bg-blue-700 h-9 w-9 p-0 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
