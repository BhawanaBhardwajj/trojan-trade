import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileCompletionCardProps {
  profile: {
    full_name: string;
    role: string;
    avatar_url: string;
    bio: string;
  };
}

export const ProfileCompletionCard = ({ profile }: ProfileCompletionCardProps) => {
  const navigate = useNavigate();

  const requirements = [
    {
      field: 'full_name',
      label: 'Add your full name',
      completed: !!profile.full_name,
      required: true
    },
    {
      field: 'avatar_url',
      label: 'Upload a profile photo',
      completed: !!profile.avatar_url,
      required: true
    },
    {
      field: 'role',
      label: 'Select your role (Student/Alumni/Staff)',
      completed: !!profile.role,
      required: true
    },
    {
      field: 'bio',
      label: 'Add a bio to your profile',
      completed: !!profile.bio,
      required: true
    }
  ];

  const missingRequired = requirements.filter(r => r.required && !r.completed);
  const requiredFields = requirements.filter(r => r.required);
  const completedRequired = requiredFields.filter(r => r.completed).length;
  const totalRequired = requiredFields.length;
  const completionPercentage = Math.round((completedRequired / totalRequired) * 100);

  const isProfileComplete = missingRequired.length === 0;

  if (isProfileComplete) {
    return null;
  }

  return (
    <Card className="border-[hsl(var(--usc-cardinal))]/30 bg-gradient-to-br from-[hsl(var(--usc-cardinal))]/5 to-[hsl(var(--usc-gold))]/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[hsl(var(--usc-cardinal))]" />
            Complete Your Profile
          </CardTitle>
          <span className="text-sm font-semibold text-[hsl(var(--usc-cardinal))]">
            {completionPercentage}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercentage} className="h-2" />

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Complete the fields below to list items and earn your verified profile badge:
          </p>

          <ul className="space-y-2 mt-3 list-none">
            {missingRequired.map((req) => (
              <li key={req.field} className="flex items-start gap-2 text-sm">
                <span className="text-[hsl(var(--usc-cardinal))] mt-0.5">•</span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => navigate('/profile/edit')}
          className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
        >
          Complete Profile Now
        </Button>
      </CardContent>
    </Card>
  );
};
