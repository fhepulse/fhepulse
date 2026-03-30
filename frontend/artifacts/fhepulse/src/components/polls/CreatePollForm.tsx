import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, ArrowLeft, ArrowRight, Check, FileText, ListOrdered, Shield } from "lucide-react";
import { useCreatePoll } from "@/hooks/use-poll-factory";
import { VotingMode } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  durationSeconds: z.coerce.number().min(60),
  optionCount: z.coerce.number().min(2, "At least 2 options required").max(32, "Maximum 32 options"),
  optionLabels: z.string().min(1, "Please describe your poll options"),
  votingMode: z.nativeEnum(VotingMode),
  creditBudget: z.coerce.number().min(1, "Budget must be at least 1"),
  rewardEnabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { id: 1, title: "Subject", description: "Define your poll", icon: FileText },
  { id: 2, title: "Options", description: "Add choices", icon: ListOrdered },
  { id: 3, title: "Settings", description: "Privacy & rewards", icon: Shield },
] as const;

const durationOptions = [
  { label: "1 Hour", value: 3600 },
  { label: "6 Hours", value: 21600 },
  { label: "1 Day", value: 86400 },
  { label: "3 Days", value: 259200 },
  { label: "1 Week", value: 604800 },
];

// Fields validated per step
const stepFields: Record<number, (keyof FormValues)[]> = {
  1: ["title", "description", "durationSeconds"],
  2: ["optionCount", "optionLabels"],
  3: ["votingMode", "creditBudget"],
};

export function CreatePollForm({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const createPoll = useCreatePoll();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      durationSeconds: 86400,
      optionCount: 3,
      optionLabels: "",
      votingMode: VotingMode.Linear,
      creditBudget: 100,
      rewardEnabled: false,
    },
    mode: "onTouched",
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setStep(1);
      form.reset();
    }
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (values: FormValues) => {
    try {
      const { rewardEnabled, ...rest } = values;
      const labels = rest.optionLabels
        .split("\n")
        .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter(Boolean);
      await createPoll.mutateAsync({
        title: rest.title,
        description: rest.description,
        durationSeconds: rest.durationSeconds,
        optionCount: rest.optionCount,
        optionLabels: labels,
        votingMode: rest.votingMode,
        creditBudget: rest.creditBudget,
      });
      toast.success("Poll created successfully!");
      handleOpenChange(false);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Failed to create poll");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Poll
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Create a New Poll</DialogTitle>
          <DialogDescription>
            {STEPS[step - 1].description}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => { if (isCompleted) setStep(s.id); }}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors w-full justify-center",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
                      !isActive && !isCompleted && "bg-white/5 text-muted-foreground",
                    )}
                    disabled={!isCompleted}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{s.title}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "h-px w-4 shrink-0 mx-1",
                      step > s.id ? "bg-primary/40" : "bg-white/10",
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 min-h-[260px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepWrapper key="step1">
                  <div className="space-y-2">
                    <Label htmlFor="title">Poll Title</Label>
                    <Input
                      id="title"
                      placeholder="What should we ask?"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide context about your poll and what you'd like to learn..."
                      rows={3}
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select
                      value={String(form.watch("durationSeconds"))}
                      onValueChange={(v) => form.setValue("durationSeconds", Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper key="step2">
                  <div className="space-y-2">
                    <Label htmlFor="optionCount">Number of Options</Label>
                    <Input
                      id="optionCount"
                      type="number"
                      min={2}
                      max={32}
                      {...form.register("optionCount")}
                    />
                    {form.formState.errors.optionCount && (
                      <p className="text-xs text-destructive">{form.formState.errors.optionCount.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Between 2 and 32 options</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optionLabels">Option Labels</Label>
                    <Textarea
                      id="optionLabels"
                      placeholder={"List each option on a new line:\n1. Option A\n2. Option B\n3. Option C"}
                      rows={5}
                      {...form.register("optionLabels")}
                    />
                    {form.formState.errors.optionLabels && (
                      <p className="text-xs text-destructive">{form.formState.errors.optionLabels.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      These labels help participants understand each choice
                    </p>
                  </div>
                </StepWrapper>
              )}

              {step === 3 && (
                <StepWrapper key="step3">
                  <div className="space-y-2">
                    <Label>Voting Mode</Label>
                    <Select
                      value={String(form.watch("votingMode"))}
                      onValueChange={(v) => form.setValue("votingMode", Number(v) as VotingMode)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Linear</SelectItem>
                        <SelectItem value="1">Quadratic</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {form.watch("votingMode") === VotingMode.Linear
                        ? "Linear: voters distribute points across options freely"
                        : "Quadratic: each additional vote on an option costs exponentially more credits"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creditBudget">Credit Budget</Label>
                    <Input
                      id="creditBudget"
                      type="number"
                      min={1}
                      {...form.register("creditBudget")}
                    />
                    {form.formState.errors.creditBudget && (
                      <p className="text-xs text-destructive">{form.formState.errors.creditBudget.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Total credits each voter can spend across all options
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">FHE Privacy</p>
                        <p className="text-xs text-muted-foreground">Individual votes are encrypted on-chain</p>
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Always On</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Participant Rewards</p>
                        <p className="text-xs text-muted-foreground">Fund rewards after poll creation</p>
                      </div>
                      <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">Post-creation</span>
                    </div>
                  </div>
                </StepWrapper>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <DialogFooter className="px-6 py-4 border-t border-white/5 mt-4 flex-row gap-2 sm:gap-2">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={goBack} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <Button type="button" onClick={goNext} className="gap-1.5">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={createPoll.isPending} className="gap-1.5">
                {createPoll.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Poll
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}
