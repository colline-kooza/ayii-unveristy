"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, Check, CheckCheck, Loader2, Plus, X, Smile, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useConversations, useMessageThread, useSendMessage, Message, Conversation } from "@/hooks/useMessages";
import { useMe } from "@/hooks/useAuth";
import { useUserSearch } from "@/hooks/useUserSearch";
import { getAvatarUrl } from "@/lib/avatarUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MessagesPage() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserFromSearch, setSelectedUserFromSearch] = useState<any>(null); // Search user type is still any for now
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: me } = useMe();
  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: messagesData, isLoading: loadingMessages, fetchNextPage, hasNextPage } = useMessageThread(selectedPartnerId || "");
  const sendMessageMutation = useSendMessage();
  const { data: searchResults, isLoading: searchingUsers } = useUserSearch(userSearchQuery);

  const messages = useMemo(() => messagesData?.pages.flatMap(page => page.data) || [], [messagesData]);

  // Get selected partner info - either from conversations or from search results
  const selectedConversation = conversations?.find((conv) => conv.partner.id === selectedPartnerId);
  const selectedPartner = selectedConversation?.partner || selectedUserFromSearch;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations?.filter((conv) =>
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
    setShowMobileChat(true);
  };

  const handleSelectConversation = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatConversationTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[messageDate.getDay()];
    }
    return messageDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
  };

  const formatDateDivider = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[messageDate.getDay()];
    }
    return messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loadingConversations) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col min-w-0 md:p-4 bg-gray-50/30">
      <div className="h-full flex bg-white md:rounded-xl md:border border-gray-200 md:shadow-sm overflow-hidden">
        {/* Conversations List */}
        <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-200 flex-col bg-white`}>
          {/* Header */}
          <div className="p-4 bg-[#008069] text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chats</h2>
              <div className="flex items-center gap-2">
                <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-white hover:bg-white/10 rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search name or email..."
                        className="pl-9 bg-gray-50 border-gray-200"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-1">
                      {searchingUsers ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
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
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all active:bg-gray-100"
                            onClick={() => handleSelectUser(user.id)}
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={getAvatarUrl(user.image, user.name, 'user')} />
                              <AvatarFallback className="bg-[#00a884] text-white font-medium">
                                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-[#008069] font-semibold uppercase">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-white hover:bg-white/10 rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New group</DropdownMenuItem>
                  <DropdownMenuItem>Starred messages</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>
            
            {/* Search Bar */}
            <div className="px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search or start new chat" 
                  className="pl-10 h-10 bg-white border-none rounded-lg text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start a new chat to begin messaging</p>
              </div>
            ) : (
              filteredConversations.map((conv: any) => (
                <div
                  key={conv.partner.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedPartnerId === conv.partner.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv.partner.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.partner.image} />
                        <AvatarFallback className="bg-[#00a884] text-white font-medium">
                          {conv.partner.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[15px] font-medium text-gray-900 truncate">
                          {conv.partner.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatConversationTime(conv.lastMessage.sentAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] text-gray-600 truncate flex-1 leading-tight">
                          {conv.lastMessage.senderId === me?.id && (
                            <span className="inline-flex mr-1">
                              {conv.lastMessage.isRead ? (
                                <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                              ) : (
                                <Check className="h-3.5 w-3.5 text-gray-500" />
                              )}
                            </span>
                          )}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <div className="bg-[#25d366] text-white text-xs font-semibold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
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

        {/* Chat Area */}
        <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#efeae2]`}>
          {!selectedPartnerId ? (
            <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
              <div className="text-center max-w-md px-8">
                <div className="w-64 h-64 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-[#00a884]/10 to-[#008069]/10 rounded-full"></div>
                  <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                    <Send className="h-24 w-24 text-[#00a884]" />
                  </div>
                </div>
                <h3 className="text-3xl font-light text-gray-800 mb-3">WhatsApp Web</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Send and receive messages without keeping your phone online.<br />
                  Select a chat to start messaging.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-4 py-2.5 bg-[#f0f2f5] border-b border-gray-300 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="md:hidden h-9 w-9 text-gray-600 hover:bg-gray-200 rounded-full"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={selectedPartner?.image} />
                    <AvatarFallback className="bg-[#00a884] text-white font-medium">
                      {selectedPartner?.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-gray-900 truncate">{selectedPartner?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selectedPartner?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-600 hover:bg-gray-200 rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Contact info</DropdownMenuItem>
                      <DropdownMenuItem>Select messages</DropdownMenuItem>
                      <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem>Clear messages</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 whatsapp-bg messages-scroll">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-[#00a884]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
                        <Send className="h-16 w-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">No messages yet</p>
                      <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {hasNextPage && (
                      <div className="text-center pb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          className="text-[#00a884] text-xs hover:bg-white/50 rounded-full"
                        >
                          Load older messages
                        </Button>
                      </div>
                    )}
                    {messages.map((msg: any, index: number) => {
                      const isMe = msg.senderId === me?.id;
                      const prevMsg = messages[index - 1];
                      const showDateDivider = !prevMsg || 
                        new Date(msg.sentAt).toDateString() !== new Date(prevMsg.sentAt).toDateString();
                      
                      return (
                        <div key={msg.id}>
                          {showDateDivider && (
                            <div className="flex justify-center my-3">
                              <div className="bg-white/90 text-gray-700 text-xs px-3 py-1.5 rounded-md shadow-sm">
                                {formatDateDivider(msg.sentAt)}
                              </div>
                            </div>
                          )}
                          <div
                            className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
                          >
                            <div
                              className={`message-bubble max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${
                                isMe
                                  ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                                  : "bg-white text-gray-900 rounded-tl-none"
                              }`}
                            >
                              <p className="text-[14.2px] whitespace-pre-wrap wrap-break-word leading-[1.4]">{msg.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${
                                isMe ? "text-gray-600" : "text-gray-500"
                              }`}>
                                <span className="text-[11px]">
                                  {formatTime(msg.sentAt)}
                                </span>
                                {isMe && (
                                  msg.isRead ? (
                                    <CheckCheck className="h-4 w-4 text-[#53bdeb]" />
                                  ) : (
                                    <Check className="h-4 w-4 text-gray-500" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="px-4 py-3 bg-[#f0f2f5]">
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-gray-600 hover:bg-gray-200 rounded-full">
                      <Smile className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-gray-600 hover:bg-gray-200 rounded-full">
                      <Paperclip className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="flex-1 bg-white rounded-lg flex items-end">
                    <Input
                      ref={inputRef}
                      placeholder="Type a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none text-[15px] h-10 px-3"
                      disabled={sendMessageMutation.isPending}
                    />
                  </div>
                  <Button 
                    onClick={handleSend} 
                    size="icon"
                    className="bg-[#00a884] hover:bg-[#008069] h-10 w-10 rounded-full transition-all"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
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
