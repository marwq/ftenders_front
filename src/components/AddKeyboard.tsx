import styles from './AddKeyboard.module.css';

interface AddKeyboardProps {
  toolInput: {
    buttons: string[];
  };
  onSelect: (text: string) => void;
}

export const AddKeyboard = ({ toolInput, onSelect }: AddKeyboardProps) => {
  const buttons = toolInput?.buttons || [];

  return (
    <div className={styles.buttons}>
      {buttons.map((text, idx) => (
        <button
          key={idx}
          className={styles.button}
          type="button"
          onClick={() => onSelect(text)}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
