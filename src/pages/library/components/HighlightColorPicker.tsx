const colors = ["#c6d8d4", "#c7cfe7", "#d6cadb", "#e9e59c", "#d1d1d1"];
const names = ["민트", "파랑", "보라", "노랑", "회색"];

export default function HighlightColorPicker({
  selectedColor,
  onSelect,
  disabled = false,
}: {
  selectedColor: string;
  onSelect: (color: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="book-reader__palette" role="group" aria-label="형광펜 색상">
      {colors.map((color, index) => (
        <button
          type="button"
          disabled={disabled}
          key={color}
          style={{ backgroundColor: color }}
          aria-label={`${names[index]} 형광펜으로 문장 수집`}
          aria-pressed={selectedColor === color}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
