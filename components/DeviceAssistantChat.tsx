import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { TextContentBlock } from 'openai/resources/beta/threads/messages.mjs';

export default function DeviceAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant',
    content: string,
    timestamp: string
  }>>([]);
  
  const sendMessage = useAction(api.devices.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setMessage('');
    setIsLoading(true);

    // Add user message to chat history
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }]);

    try {
      const response = await sendMessage({ message });
      
      // Add assistant response to chat history
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: Array.isArray(response?.content) && 'text' in response.content[0] 
          ? (response.content[0] as TextContentBlock).text.value 
          : 'No response from assistant',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-0 right-0 p-4 bg-primary text-primary-foreground border rounded-full shadow-2xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-96 h-[600px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Device Assistant</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.length === 0 && (
              <div className="text-center text-foreground text-sm py-8">
                <p>👋 Hi! I'm your device assistant.</p>
                <p>Ask me anything about devices, maintenance, or repairs.</p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-200 text-slate-900 dark:text-slate-900'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose-invert dark:prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: marked.parse(msg.content) 
                        }}
                        className="text-sm leading-relaxed"
                      />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <span className="text-xs mt-2 block opacity-90">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                placeholder="Ask about devices..."
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !message.trim()}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}