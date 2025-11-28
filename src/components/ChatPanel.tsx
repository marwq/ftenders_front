import { useState, useEffect } from 'react';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { Chat } from './Chat';
import type { ChatState } from '../hooks/useChat';
import styles from './ChatPanel.module.css';

interface ChatPanelProps {
  selectedCount: number;
  onClearSelection: () => void;
  chatState: ChatState;
}

export const ChatPanel = ({ selectedCount, onClearSelection, chatState }: ChatPanelProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const dragControls = useDragControls();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 100;

    if (shouldClose) {
      setIsOpen(false);
      controls.start({ y: '85%' });
    } else {
      setIsOpen(true);
      controls.start({ y: 0 });
    }
  };

  const toggleDrawer = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    controls.start({ y: newState ? 0 : '85%' });
  };

  if (!isMobile) {
    // Desktop sidebar
    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.chatContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>AI Агент</h2>
              {selectedCount > 0 && (
                <div className={styles.selectedBadge}>
                  <span className={styles.selectedText}>Выделено {selectedCount} тендеров</span>
                  <button onClick={onClearSelection} className={styles.clearButton}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className={styles.chatContent}>
              <Chat chatState={chatState} />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Mobile drawer
  return (
    <>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleDrawer}
        />
      )}

      <motion.div
        className={styles.drawer}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ y: '85%' }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
        }}
      >
        <div
          className={styles.drawerHandle}
          onPointerDown={(e) => dragControls.start(e)}
          onClick={toggleDrawer}
        >
          <div className={styles.handleBar} />
        </div>

        <div className={styles.drawerContent}>
          <div className={styles.chatContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>AI Агент</h2>
              {selectedCount > 0 && (
                <div className={styles.selectedBadge}>
                  <span className={styles.selectedText}>Выделено {selectedCount} тендеров</span>
                  <button onClick={onClearSelection} className={styles.clearButton}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className={styles.chatContent}>
              <Chat chatState={chatState} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
