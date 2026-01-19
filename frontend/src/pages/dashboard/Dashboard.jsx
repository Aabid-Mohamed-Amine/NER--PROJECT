import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { nerService, chatService } from '../../services/api';
import { LogOut, Search, Loader2, History, Bot, Calendar, Send, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analyze'); 
  
  // Analyze State
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // History State
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', content: 'Hello! Click on any colored entity in the Analysis tab to learn more about it, or ask me directly here.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- 1. ANALYZE ---
  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await nerService.predict(text);
      setResults(response.data.entities);
    } catch (err) {
      setError('Failed to analyze text.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HISTORY ---
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await nerService.getHistory();
      setHistoryItems(response.data);
    } catch (err) {
      console.error("History error", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') loadHistory();
  }, [activeTab]);

  // --- 3. CHATBOT (The New Feature) ---
  const handleSendMessage = async (queryText) => {
    if (!queryText.trim()) return;

    // Add User Message
    const newMessage = { role: 'user', content: queryText };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setChatLoading(true);

    // Switch to Chat Tab if not already there
    setActiveTab('chatbot');

    try {
      // Call Backend API
      const response = await chatService.explain(queryText);
      const botReply = { 
        role: 'bot', 
        content: response.data.answer,
        source: response.data.source,
        url: response.data.url
      };
      setChatMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'bot', content: "Sorry, I couldn't find information on that." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeTab]);

  // --- CLICK TO EXPLAIN ---
  const handleEntityClick = (entityText) => {
    handleSendMessage(entityText);
  };

  // --- RENDER TEXT WITH CLICKABLE ENTITIES ---
  const renderHighlightedText = (inputText, entities) => {
    if (!entities || !entities.length || !inputText) return <p className="text-brand-gray text-lg text-right" dir="rtl">{inputText}</p>;

    let lastIndex = 0;
    const elements = [];
    const sortedResults = [...entities].sort((a, b) => a.start - b.start);

    sortedResults.forEach((entity, index) => {
      if (entity.start < lastIndex) return; // Skip overlaps

      if (entity.start > lastIndex) {
        elements.push(<span key={`text-${index}`}>{inputText.slice(lastIndex, entity.start)}</span>);
      }

      let colorClass = 'bg-gray-700 text-gray-200';
      const group = entity.entity_group;
      if (['PER', 'PERS', 'PERSON'].includes(group)) colorClass = 'entity-per';
      if (['ORG', 'ORGANIZATION'].includes(group)) colorClass = 'entity-org';
      if (['LOC', 'LOCATION'].includes(group)) colorClass = 'entity-loc';

      // Capture the exact text of the entity
      const entityText = inputText.slice(entity.start, entity.end);

      elements.push(
        <button 
          key={`entity-${index}`} 
          className={`${colorClass} relative group hover:ring-2 hover:ring-white transition-all`} 
          title="Click to ask Chatbot"
          onClick={() => handleEntityClick(entityText)} // <--- CLICK ACTION
        >
          {entityText}
        </button>
      );

      lastIndex = entity.end;
    });

    if (lastIndex < inputText.length) elements.push(<span key="end">{inputText.slice(lastIndex)}</span>);

    return (
      <div className="space-y-4">
        <div className="text-lg leading-relaxed text-right font-arabic" dir="rtl">{elements}</div>
        
        {/* Simple Legend */}
        <div className="flex flex-wrap justify-end gap-4 border-t border-white/10 pt-4 mt-4 text-xs text-brand-gray">
          <span>🟣 Person</span><span>🔵 Organization</span><span>🟢 Location</span>
          <span className="text-white ml-2">(Click any entity to chat)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-black p-6 flex flex-col hidden md:flex border-r border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-8">
          <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black text-sm">AI</span> Arabic NER
        </h1>
        <nav className="space-y-2 flex-1">
          {['analyze', 'history', 'chatbot'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white/10 text-white font-medium' : 'text-brand-gray hover:text-white hover:bg-white/5'}`}
            >
              {tab === 'analyze' && <Search className="w-5 h-5" />}
              {tab === 'history' && <History className="w-5 h-5" />}
              {tab === 'chatbot' && <Bot className="w-5 h-5" />}
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-brand-gray hover:text-white mt-auto pt-6 border-t border-white/10">
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-brand-dark to-brand-black p-8">
        
        {/* 1. ANALYZE VIEW */}
        {activeTab === 'analyze' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">New Analysis</h2>
            <div className="bg-brand-dark/50 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-xl">
              <textarea
                className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-4 text-white text-right font-arabic focus:outline-none focus:border-green-500 resize-none text-lg"
                placeholder="أدخل النص العربي هنا..."
                value={text} onChange={(e) => setText(e.target.value)} dir="rtl"
              />
              <div className="flex justify-end mt-4">
                <button onClick={handleAnalyze} disabled={loading || !text} className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-8 rounded-full flex items-center gap-2">
                  {loading && <Loader2 className="animate-spin w-4 h-4" />} Analyze
                </button>
              </div>
            </div>
            {(results.length > 0 || error) && (
              <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/10">
                <div className="bg-black/30 p-6 rounded-lg border border-white/5">
                  {renderHighlightedText(text, results)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. HISTORY VIEW */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Analysis History</h2>
            {historyLoading ? <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-green-500" /></div> : 
             historyItems.length === 0 ? <div className="text-center text-brand-gray p-12">No history found.</div> : (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="bg-brand-dark/40 p-6 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-2">
                       <span className="text-xs text-brand-gray flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    {renderHighlightedText(item.input_text, item.ner_result)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. CHATBOT VIEW */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-brand-dark/50 rounded-xl border border-white/10 overflow-hidden animate-fade-in">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white/10 text-brand-gray'}`}>
                    <p>{msg.content}</p>
                    {msg.source && (
                      <a href={msg.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-400 mt-2 hover:underline">
                        Source: {msg.source} <ExternalLink className="w-3 h-3"/>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="flex justify-start"><div className="bg-white/10 p-4 rounded-xl"><Loader2 className="animate-spin w-5 h-5 text-white" /></div></div>}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-black/30 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-brand-black border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-green-500"
                placeholder="Ask about an entity..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
              />
              <button onClick={() => handleSendMessage(chatInput)} disabled={!chatInput.trim()} className="bg-green-500 p-3 rounded-lg text-black hover:bg-green-400">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;