import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Groq from 'groq-sdk';
import { Income, Expense, Investment } from '@/pages/Index';
import { Avatar, AvatarFallback } from './ui/avatar';

interface FinPalProps {
  income: Income[];
  expenses: Expense[];
  investments: Investment[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FinPal: React.FC<FinPalProps> = ({ income, expenses, investments }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm FinPal, your financial assistant. How can I help you analyze your finances today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    if (!groqApiKey) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Groq API key is not configured. Please set it in your .env file." }]);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const financialData = { income, expenses, investments };
    const systemPrompt = `You are a friendly and helpful financial assistant called 'FinPal'. Your goal is to analyze the user's financial data and provide clear, concise, and actionable insights. The user's complete financial data for all time is provided below in JSON format. Use this data exclusively to answer the user's questions. Do not make up any information. When presenting data, use formatting like lists or tables to make it easy to read. Always be polite and encouraging. Today's date is ${new Date().toDateString()}.

Here is the user's financial data:
${JSON.stringify(financialData, null, 2)}`;

    try {
      const groq = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(1), // Exclude initial greeting from context
          userMessage
        ],
        model: 'llama3-8b-8192',
      });

      const assistantMessage = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while trying to connect to the assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg border-4 border-background" size="icon">
          <MessageSquare className="h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-[350px] md:w-[400px] h-[500px] mr-2 flex flex-col p-0">
        <header className="flex items-center justify-between p-3 border-b bg-muted/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">FP</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-base">FinPal</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </header>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                  <Avatar className="h-7 w-7 text-xs">
                    <AvatarFallback className="bg-primary text-primary-foreground">FP</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                 <Avatar className="h-7 w-7 text-xs">
                    <AvatarFallback className="bg-primary text-primary-foreground">FP</AvatarFallback>
                  </Avatar>
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <footer className="p-3 border-t">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FinPal..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </footer>
      </PopoverContent>
    </Popover>
  );
};

export default FinPal;
