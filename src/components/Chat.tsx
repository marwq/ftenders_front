import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../hooks/useChat';
import { SatuProductSearch } from './SatuProductSearch';
import { CompanySearch } from './CompanySearch';
import { CompanyCheck } from './CompanyCheck';
import { AddKeyboard } from './AddKeyboard';
import { FetchDocument } from './FetchDocument';
import { Report } from './Report';
import styles from './Chat.module.css';

interface ChatProps {
  chatState: {
    messages: Message[];
    isConnected: boolean;
    isLoading: boolean;
    sendMessage: (text: string, mentionedIdsOverride?: string[]) => void;
  };
}

export const Chat = ({ chatState }: ChatProps) => {
  const { messages, isConnected, isLoading, sendMessage } = chatState;
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isConnected) return;

    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.messagesContainer} ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💬</span>
            <p className={styles.emptyText}>
              Начните диалог с AI агентом
            </p>
            <p className={styles.emptyHint}>
              Выделите тендеры и задайте вопрос
            </p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {messages.map((message, _) => (
              <div key={message.id} className={styles.messageBlock}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineLine} />
                <div className={styles.messageContent}>
                  {message.role === 'user' ? (
                    <div className={styles.userMessage}>
                      {message.text}
                    </div>
                  ) : message.type === 'tool_use' ? (
                    message.tool_name === 'search_satu_products' ? (
                      <SatuProductSearch toolInput={message.tool_input} />
                    ) : message.tool_name === 'fetch_satu_product_details' ? (
                      <div className={styles.toolMessage} style={{
                        borderColor: 'var(--accent-primary)',
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <img src="/satu.svg" alt="Satu.kz" style={{ width: '20px', height: '20px' }} />
                        <span className={styles.toolName} style={{ color: 'var(--accent-primary)' }}>Детально изучаю товар</span>
                      </div>
                    ) : message.tool_name === 'search_companies' ? (
                      <CompanySearch toolInput={message.tool_input} />
                  ) : message.tool_name === 'check_company' ? (
                    <CompanyCheck toolInput={message.tool_input} />
                  ) : message.tool_name === 'add_keyboard' ? (
                    <AddKeyboard toolInput={message.tool_input} onSelect={setInputValue} />
                  ) : message.tool_name === 'fetch_document' ? (
                    <FetchDocument toolInput={message.tool_input} />
                  ) : message.tool_name === 'report' ? (
                    <Report toolInput={message.tool_input} />
                  ) : (
                    <div className={styles.toolMessage}>
                      <span className={styles.toolIcon}>🛠️</span>
                        <span className={styles.toolName}>{message.tool_name}</span>
                      </div>
                    )
                  ) : (
                    <div className={styles.assistantMessage}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text || ''}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.messageBlock}>
                <div className={`${styles.timelineDot} ${styles.pulsating}`} />
                <div className={styles.timelineLine} />
                <div className={styles.messageContent}>
                  <div className={styles.loadingMessage}>
                    <span className={styles.loadingDots}>Думаю...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !isConnected
                ? 'Подключение...'
                : 'Задайте вопрос...'
            }
            className={styles.input}
            disabled={isLoading || !isConnected}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !isConnected}
            className={styles.sendButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
