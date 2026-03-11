import { BriefFramingSequence } from "@/components/design/brief-framing-sequence";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SessionBriefInputsProps {
  goal: string;
  problem: string;
  audience: string;
  constraints: string;
  onGoalChange: (value: string) => void;
  onProblemChange: (value: string) => void;
  onAudienceChange: (value: string) => void;
  onConstraintsChange: (value: string) => void;
  fieldClassName?: string;
  useTextarea?: boolean;
}

const fields = [
  {
    key: "goal",
    label: "Goal",
    placeholder: "What outcome are we trying to move?",
  },
  {
    key: "problem",
    label: "Problem / Opportunity",
    placeholder: "What friction, gap, or signal makes this worth solving?",
  },
  {
    key: "audience",
    label: "Audience",
    placeholder: "Who is this for?",
  },
  {
    key: "constraints",
    label: "Constraints",
    placeholder: "What constraints should shape the solution?",
  },
] as const;

export function SessionBriefInputs({
  goal,
  problem,
  audience,
  constraints,
  onGoalChange,
  onProblemChange,
  onAudienceChange,
  onConstraintsChange,
  fieldClassName = "text-sm",
  useTextarea = false,
}: SessionBriefInputsProps) {
  const values = {
    goal,
    problem,
    audience,
    constraints,
  };

  const setters = {
    goal: onGoalChange,
    problem: onProblemChange,
    audience: onAudienceChange,
    constraints: onConstraintsChange,
  };

  return (
    <div className="space-y-5">
      <BriefFramingSequence compact />
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 w-full">
        {fields.map((field) => {
          const value = values[field.key];
          const setValue = setters[field.key];

          return (
            <div key={field.key} className="space-y-1.5">
              <Label
                htmlFor={`brief-${field.key}`}
                className={useTextarea ? "text-xs" : "text-sm text-muted-foreground"}
              >
                {field.label}
              </Label>
              {useTextarea ? (
                <Textarea
                  id={`brief-${field.key}`}
                  placeholder={field.placeholder}
                  rows={2}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className={fieldClassName}
                />
              ) : (
                <Input
                  id={`brief-${field.key}`}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className={fieldClassName}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
