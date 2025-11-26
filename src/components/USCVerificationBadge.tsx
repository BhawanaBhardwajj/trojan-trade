import { BadgeCheck } from "lucide-react";

interface USCVerificationBadgeProps {
  verified?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const USCVerificationBadge = ({
  verified = false,
  size = "sm",
  showText = true
}: USCVerificationBadgeProps) => {
  if (!verified) return null;

  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="inline-flex items-center gap-1 text-green-600">
      <BadgeCheck className={sizeClasses[size]} />
      {showText && (
        <span className={`${textSizeClasses[size]} font-medium`}>
          Verified USC
        </span>
      )}
    </div>
  );
};
