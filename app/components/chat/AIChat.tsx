import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatProps {
    apiKey: string;
}

export const AIChat: React.FC<AIChatProps> = ({ apiKey }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Halo! Saya asisten AI SADAR Anda. Ada yang bisa saya bantu terkait perjalanan Anda hari ini?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: "Anda adalah asisten AI yang ahli, ramah, dan ringkas di dalam platform sistem monitoring keselamatan berkendara (SADAR). Tugas Anda adalah membantu pengemudi, memberikan informasi, atau menjawab pertanyaan terkait perjalanan. Jawablah menggunakan bahasa Indonesia."
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to state
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            // Format previous messages for context
            const history = messages.filter(m => m.id !== 'welcome').map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const chat = model.startChat({
                history: history
            });

            const result = await chat.sendMessage(userMessage);
            const responseText = result.response.text();

            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMsg]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6 md:p-8 overflow-hidden h-full flex flex-col bg-[#fafaf9] dark:bg-slate-950 font-sans transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#325a6c] dark:text-orange-400 transition-colors">
                        Asisten AI SADAR
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Chat Interaktif Real-time</p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-colors duration-300">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className="shrink-0 pt-1">
                                {message.role === 'assistant' ? (
                                    <div className="w-10 h-10 rounded-2xl bg-[#325a6c]/10 dark:bg-orange-500/20 flex items-center justify-center text-[#325a6c] dark:text-orange-400">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`px-5 py-3.5 rounded-2xl relative group ${message.role === 'user'
                                        ? 'bg-[#325a6c] dark:bg-orange-600 text-white rounded-tr-sm'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 max-w-none">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1.5 font-medium px-1">
                                    {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-4 max-w-[85%] animate-in fade-in duration-300">
                            <div className="shrink-0 pt-1">
                                <div className="w-10 h-10 rounded-2xl bg-[#325a6c]/10 dark:bg-orange-500/20 flex items-center justify-center text-[#325a6c] dark:text-orange-400">
                                    <Bot className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-[#325a6c] dark:text-orange-400 animate-spin" />
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">AI sedang mengetik...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan Anda di sini..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-[#325a6c]/20 dark:focus:ring-orange-500/20 border border-slate-200 dark:border-slate-700 transition-all font-medium"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`absolute right-2 p-2.5 rounded-xl transition-all flex items-center justify-center ${input.trim() && !isLoading
                                ? 'bg-[#325a6c] dark:bg-orange-600 text-white hover:scale-105 active:scale-95 shadow-md shadow-[#325a6c]/20 dark:shadow-orange-600/20'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                            AI SADAR dapat membuat kesalahan. Harap periksa kembali informasi penting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
