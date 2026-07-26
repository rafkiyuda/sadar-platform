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
        model: 'gemini-2.0-flash-exp',
        systemInstruction: `Anda adalah asisten AI yang ahli, ramah, dan ringkas di dalam platform sistem monitoring keselamatan berkendara (SADAR). 
        Tugas Anda adalah membantu pengemudi, memberikan informasi, serta menjawab pertanyaan terkait lokasi & perjalanan.

        LOKASI PENGEMUDI SAAT INI:
        - Lokasi: Menara Astra Jakarta (Jl. Jend. Sudirman Kav. 5-6, Karet Tengsin, Tanah Abang, Jakarta Pusat)
        - Koordinat GPS: -6.209140, 106.821680

        DATA LOKASI & POIs TERDEKAT SEKITAR MENARA ASTRA:
        1. TEMPAT KOPI & KAFE:
           - Crematology Coffee Roasters (Menara Astra Ground/Mezzanine) - Specialty coffee & tempat bersantai.
           - Atmè Coffee (Menara Astra Lantai 3) - Kopi nikmat favorit tenant kantor.
           - Expat. Roasters Jakarta (Mori Building / Tokio Tower) - Persis di sebelah Menara Astra, kopi bergaya Australia.
           - % Arabica Jakarta (Citywalk Sudirman / MidPlaza) - Hanya 3 menit jalan kaki.
           - Starbucks Reserve (Plaza Marein / MidPlaza Sudirman).
           - Djournal Coffee (WTC Sudirman / Citywalk Sudirman).
        2. TEMPAT SHOLAT & MASJID:
           - Musholla Utama Menara Astra (Lantai 5 & Basement) - Luas, bersih, ber-AC, perlengkapan sholat lengkap.
           - Masjid Hidayatullah (Jl. Karet Depan, Karet Tengsin) - Masjid bersejarah & besar persis di belakang Menara Astra.
           - Masjid As-Sudirman (Kawasan MidPlaza / Sudirman).
        3. TEMPAT ISTIRAHAT & AMENITAS:
           - Lobby & Lounge Toyota Showroom Menara Astra (Lantai Ground).
           - Refuge Floors Menara Astra - Lantai khusus evakuasi & istirahat tahan gempa.
           - Ayana Midplaza Jakarta - Hotel bintang 5 persis di sebelah Menara Astra (Lounge & Garden).
           - Taman Hutan Kota GBK - Hanya 5 menit naik MRT dari Stasiun Setiabudi Astra.
        4. KESEHATAN & KLINIK MEDIS:
           - DYM Medical Clinic Indonesia (Menara Astra Lantai 3) - Klinik medis & check-up standar Jepang.
           - MRCCC Siloam Hospitals Semanggi - Rumah sakit umum & spesialis kanker lengkap (~5 menit drive / 1 stasiun MRT).
           - RS Jakarta (Jl. Jend. Sudirman Kav. 49).
           - Apotek Century / Guardian / Kimia Farma (Menara Astra & Citywalk Sudirman).
        5. KEAMANAN & POS DARURAT:
           - Pos Keamanan Main Gate & Command Center Menara Astra - Monitoring security 24 jam.
           - Polsek Metropolitan Setiabudi (Jl. Raya Setiabudi No. 1) - Polsek terdekat untuk bantuan darurat/hukum.
           - Pos Polisi Lalu Lintas Sudirman / Semanggi.
           - Pos Pemadam Kebakaran Sektor Tanah Abang & Setiabudi.
        6. TRANSPORTASI & TRANSIT:
           - Stasiun MRT Setiabudi Astra (Tepat di depan gedung, 1 menit jalan kaki / 44 m).
           - Halte TransJakarta Setiabudi / Chase Plaza / Karet (Koridor 1 Blok M - Kota).
           - Stasiun KRL Sudirman & Stasiun BNI City / KA Bandara (1 stasiun MRT ke Dukuh Atas).
        7. KULINER, FOOD COURT & BANK/ATM:
           - Food Court & Retail Area Menara Astra (Lantai LG & Lantai 3).
           - Citywalk Sudirman (Pusat kuliner & mal gaya hidup di belakang Menara Astra).
           - Galeri ATM Menara Astra (BCA, Mandiri, BNI, BRI, Permata, CIMB Niaga).
           - FamilyMart / Lawson / Indomaret Point.

        Aturan Menjawab:
        1. Jawablah menggunakan bahasa Indonesia yang santun, ramah, dan informatif.
        2. Utamakan informasi POIs di atas saat pengemudi bertanya tentang rekomendasi tempat kopi, tempat sholat, tempat istirahat, kesehatan, keamanan/polisi, transit, atau tempat makan di sekitar Menara Astra.
        3. Berikan saran dengan menyebutkan nama tempat dan lokasinya dengan jelas.`
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
