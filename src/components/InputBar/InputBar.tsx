import { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './InputBar.module.css';

interface InputBarProps {
  /** 预填充文本（Demo 中用于预设用户发言） */
  prefilledText?: string;
  placeholder?: string;
  disabled?: boolean;
  onSend?: (text: string) => void;
}

export default function InputBar({
  prefilledText,
  placeholder = '输入消息...',
  disabled = false,
  onSend,
}: InputBarProps) {
  const [value, setValue] = useState('');

  // Demo 模式：有预填充文本时，点击整个输入框即触发发送
  const displayText = prefilledText || value;
  const canSend = displayText.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    const text = prefilledText || value.trim();
    onSend?.(text);
    setValue('');
  };

  const handleInputClick = () => {
    if (prefilledText) {
      handleSend();
    }
  };

  return (
    <div className={styles.inputBar}>
      <div className={styles.inputWrapper}>
        {prefilledText ? (
          <div
            className={`${styles.input} ${styles.inputPrefilled}`}
            onClick={handleInputClick}
          >
            {prefilledText}
          </div>
        ) : (
          <input
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        )}
        <button
          className={`${styles.sendButton} ${!canSend ? styles.sendButtonHidden : ''}`}
          onClick={handleSend}
          disabled={!canSend}
        >
          <Send size={18} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}
