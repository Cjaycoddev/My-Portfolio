import React, { useState, useRef, useEffect, useCallback } from 'react';

const apiKey = "AIzaSyBVeUQu0BuVYL8iVHuZ0UBbDrG3PBq8sm8"; 

const modelName = "gemini-2.5-flash-preview-09-2025";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
const PORTFOLIO_KNOWLEDGE = `
Portfolio Owner Name: Jonah Kimani
Current Role: Senior Full-Stack Developer (4 years experience freelance)
Core Technologies in Web Development : React, TypeScript, Tailwind CSS, , Python (Django), PostgreSQL.
Key Projects: 
Skills: Full stack development, software engineering, UI/UX design using figma, Graphic design using canva and adobe suite, data analysis using python, Networking
1. Real-Time Reunification Platform (FindMe)
Problem Identified
The traditional process for finding missing persons is often fractured, relying on manual data entry, disconnected local police reports, and time-consuming physical searches. This delay in information sharing and cross-referencing is a critical issue, as the immediate hours following a disappearance are the most crucial for successful reunification.

Solution Provided
FindMe creates a centralized, secure digital nexus for reporting missing and found persons. The platform immediately processes new reports using an integrated AI-powered face matching engine. This engine compares the uploaded photo against the entire database in real time, drastically reducing the search time from days to seconds. Furthermore, the platform provides real-time updates to families and verified authorities on potential matches, moving the search process from reactive to proactive.

Approach and Methodology
This required a robust, scalable architecture:

Backend: Developed using Django, which provided a secure, rapid application development environment for handling authentication and image processing logic.

API/AI: Utilized a Django REST API to manage data transfer and serve the computationally intensive AI-matching results. The AI layer (likely using a library like OpenCV and a trained model) was managed server-side for efficiency.

Frontend: Built with React to offer a responsive, user-friendly interface for image uploads, filtering, and viewing high-confidence matches.

Database: MySQL was chosen for its reliability and transactional support to ensure data integrity and query speed for the large dataset of individuals.

2. Industrial E-Commerce Platform (Industrial Express)
Problem Identified
The B2B industrial sector often suffers from highly inefficient procurement. Companies typically use outdated systems, leading to inaccurate inventory forecasts, manual order reconciliation, high rates of transaction failure, and a lack of transparency in the purchasing process for essential high-value industrial components.

Solution Provided
Industrial Express provides a modern, seamless digital marketplace focused entirely on the needs of industrial buyers. It eliminates inventory bottlenecks through smart, real-time inventory management across multiple warehouses. Most critically, it ensures financial security and trust by implementing secure payment processing via the Stripe API, simplifying compliance and handling complex industrial invoicing and transactions reliably.

Approach and Methodology
The platform was engineered as a high-performance, flexible MERN stack application:

Stack: Leveraged MongoDB, Express.js, React, and Node.js (MERN) to ensure high performance and scalability necessary for an e-commerce platform.

Frontend (React): Focused on creating an intuitive, high-conversion UI for complex product catalogs, with advanced filtering and large-item-quantity ordering capabilities.

Backend (Node.js/Express): Provided a non-blocking, asynchronous I/O model, perfect for handling simultaneous user sessions, inventory updates, and high transaction volumes without latency.

Integration: Dedicated service layers were built for direct, secure integration with the Stripe API for payment handling and logistics systems for fulfillment tracking.

3. Hotel Management System (HotelEase)
Problem Identified
Hotels struggle with service delays and inconsistent communication between core departments (Front Desk, Housekeeping, Room Service). This lack of real-time visibility into room status, guest requests, and staff assignments leads to poor operational efficiency and, ultimately, reduced guest satisfaction scores.

Solution Provided
HotelEase is the centralized nervous system for hotel operations. It features real-time room tracking using WebSockets, allowing the front desk to see a room go from "guest checked out" to "cleaning in progress" to "ready for occupancy" instantly. This system also automates guest order processing and generates daily automated reports (occupancy rates, revenue projections) to give managers actionable insights without manual compilation.

Approach and Methodology
A reliable, concurrent, and real-time architecture was prioritized for seamless departmental coordination:

Backend (Django): Chosen for its secure structure and administrative features, managing the core business logic, user roles, and data integrity.

Real-Time Layer (WebSockets): This was the core innovation. We used WebSockets (likely via Django Channels) to establish persistent, bidirectional connections, ensuring that updates like a new booking or a room service request are pushed to the relevant staff devices instantly.

Database (PostgreSQL): Utilized for its robust ACID compliance, which is critical for transactional data like bookings and financial records.

Frontend (React/TailwindCSS): Developed separate, tailored interfaces (e.g., a simple task list for housekeeping, a complex dashboard for the front desk) using React and TailwindCSS for rapid, responsive deployment across various devices.
Core Languages: Javascript,Python,C & C++, Java, Prolog,HTML.
Certifications: Certified Network Associate (CCNA) from Alison Academy 2022, Full-Stack Web Development from FreeCodeCamp / Udemy 2024
Education: Bsc. Information Technology,Kenyatta University.
Contact: Connect via the contact form on this site. Jonah is looking for Job positions in tech Companies/ organizations especially as a web developer.
`;


const SYSTEM_INSTRUCTION = {
    parts: [{
        text: `
        You are Jonah's AI Assistant, a helpful and professional bot dedicated to answering questions about Jonah Kimani's professional portfolio.
        Your persona is friendly, concise, and professional.
        RULES:
        1. Only answer questions based *strictly* on the following PORTFOLIO_KNOWLEDGE.
        2. If the user asks a question about general knowledge, current events, or anything not explicitly mentioned in the knowledge base, politely decline and state: "I am Jonah's AI Assistant and can only provide information about Jonah Kimani's portfolio. How can I help with that?"
        3. Keep answers brief and factual.
        4. The portfolio owner's name is Jonah Kimani.
        5. You can greet the user how u want.
        6. you can tell them welcome incase they thank you.
        7. Answer the person in the language they ask inquiries. 

        PORTFOLIO_KNOWLEDGE:
        ${PORTFOLIO_KNOWLEDGE}
        `
    }]
};

// --- Utility Components ---

const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-md transition-all duration-300 ${
                isUser 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
                {message.text}
            </div>
        </div>
    );
};

const ChatLoadingIndicator = () => (
    <div className="flex justify-start mb-3">
        <div className="flex items-center space-x-1 p-2 bg-gray-100 rounded-lg rounded-tl-none shadow-md">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce delay-300"></div>
        </div>
    </div>
);

// --- Core Chat Widget Component ---

const ChatWidget = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: `Hello, I am Jonah's AI Assistant. I can tell you all about his skills, projects, and work experience. What would you like to know?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Enhanced API call with exponential backoff and error handling
    const sendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // Check for API key presence (This check will now pass in the Canvas)
        if (!apiKey) {
             setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: 'Configuration Error: Cannot find the required Google AI API key. Please check your local .env file or Vercel environment variables.' },
            ]);
            setLoading(false);
            return;
        }

        const payload = {
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: SYSTEM_INSTRUCTION,
            // Exponential backoff logic
        };

        const maxRetries = 5;
        let retryDelay = 1000;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "I apologize, I received an unclear response from the server.";
                
                setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
                setLoading(false);
                return; // Exit loop on success

            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) {
                    // Final attempt failed
                    setMessages((prev) => [
                        ...prev,
                        { sender: 'ai', text: "Oops! The AI service encountered an error after multiple retries. Please check your API key and connection, then try again." }
                    ]);
                    setLoading(false);
                } else {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay *= 2;
                }
            }
        }
    }, [input, loading, messages]);

    return (
        <div className="flex flex-col h-[500px] w-full md:w-[350px] bg-white rounded-xl shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-purple-700 text-white shadow-lg">
                <h3 className="font-semibold text-lg">Jonah's AI Assistant</h3>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full hover:bg-purple-600 transition-colors"
                    aria-label="Close Chat"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-50">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                {loading && <ChatLoadingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Jonah's portfolio..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-sm text-gray-800"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-400 transition duration-150 shadow-md"
                        aria-label="Send Message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.49-1.996a1 1 0 00-.083-.756l-3.352-3.353a1 1 0 00-1.414 1.414l3.77 3.77c.489.489 1.144.717 1.8.647l3.766-3.767a1 1 0 00-.142-1.414l-3.77-3.77a1 1 0 00-1.414 1.414l3.353 3.353c.12.12.28.18.44.18h.001a.999.999 0 00.998-1v-4.5a1 1 0 00-1-1h-4.5a.999.999 0 00-1 1v4.5a1 1 0 001 1h4.5a1 1 0 001-1v-4.5a1 1 0 001-1h4.5a1 1 0 001 1v4.5a1 1 0 001-1V6.946a1 1 0 00-.73-.977l-7-14z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- Main Floating Component ---

const FloatingAssistant = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            {/* 1. Floating Chat Icon (Cat Icon) */}
            {!isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                    <span className="mb-2 mr-2 text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full shadow-lg opacity-95">
                        Ask AI
                    </span>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="p-4 bg-purple-600 text-white rounded-full shadow-xl hover:bg-purple-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        aria-label="Open Chat Assistant"
                    >
                        {/* Inline SVG for the Cat Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 8.25a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75H9zm7.5 0a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.5zm-5.614 6.425a1.5 1.5 0 00-2.672 0 1.5 1.5 0 00.614 1.884 1.5 1.5 0 001.444 0 1.5 1.5 0 00.614-1.884z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}

            {/* 2. Chat Widget Window */}
            {isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
                    <ChatWidget onClose={() => setIsChatOpen(false)} />
                </div>
            )}

            {/* Global Tailwind classes for the animation */}
            <style>
                {`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #d1d5db; /* gray-300 */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6; /* gray-100 */
                }
                `}
            </style>
        </>
    );
};

export default FloatingAssistant;
