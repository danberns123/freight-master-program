import { Check, Lock, Circle } from "lucide-react";
import { type WorkflowStep } from "@/data/mockData";

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  orientation?: "horizontal" | "vertical";
}

export function WorkflowTimeline({ steps, orientation = "horizontal" }: WorkflowTimelineProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={`flex ${isHorizontal ? "items-start gap-0" : "flex-col gap-0"}`}>
      {steps.map((step, index) => {
        const isCompleted = !!step.completedAt;
        const isCurrent = !isCompleted && (index === 0 || !!steps[index - 1]?.completedAt);
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.state}
            className={`flex ${isHorizontal ? "flex-col items-center flex-1" : "items-start gap-3"}`}
          >
            {/* Connector + Node */}
            <div className={`flex ${isHorizontal ? "items-center w-full" : "flex-col items-center"}`}>
              {/* Left connector */}
              {index > 0 && (
                <div
                  className={`${isHorizontal ? "flex-1 h-0.5" : "w-0.5 h-6"} ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              {index === 0 && isHorizontal && <div className="flex-1" />}

              {/* Node */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  step.locked ? <Lock className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>

              {/* Right connector */}
              {!isLast && isHorizontal && (
                <div
                  className={`flex-1 h-0.5 ${
                    steps[index + 1]?.completedAt ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              {isLast && isHorizontal && <div className="flex-1" />}
            </div>

            {/* Label */}
            <div className={`${isHorizontal ? "mt-2 text-center" : "flex-1 pb-6"}`}>
              <p className={`text-xs font-medium ${isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                {step.state}
              </p>
              {isCompleted && step.completedBy && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{step.completedBy}</p>
              )}
              {isCompleted && step.completedAt && (
                <p className="text-[10px] text-muted-foreground font-mono">
                  {new Date(step.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
