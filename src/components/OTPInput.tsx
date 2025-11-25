import { Input } from "./ui/input";

export const OTPInput = ({ value, onChange }: { value: string[], onChange: (v: string[]) => void }) => {
  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, idx) => (
        <Input
          key={idx}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => {
            const newValue = [...value];
            newValue[idx] = e.target.value;
            onChange(newValue);
          }}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
};
