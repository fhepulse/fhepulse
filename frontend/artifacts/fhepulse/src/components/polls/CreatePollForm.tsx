import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useCreatePoll } from "@/hooks/use-poll-factory";
import { VotingMode } from "@/lib/types";
import { showTxToast } from "@/components/web3/TxStatusToast";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  optionCount: z.coerce.number().min(2).max(32),
  votingMode: z.nativeEnum(VotingMode),
  creditBudget: z.coerce.number().min(1),
  durationSeconds: z.coerce.number().min(60),
});

type FormValues = z.infer<typeof schema>;

const durationOptions = [
  { label: "1 Hour", value: 3600 },
  { label: "6 Hours", value: 21600 },
  { label: "1 Day", value: 86400 },
  { label: "3 Days", value: 259200 },
  { label: "1 Week", value: 604800 },
];

export function CreatePollForm({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const createPoll = useCreatePoll();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      optionCount: 3,
      votingMode: VotingMode.Linear,
      creditBudget: 100,
      durationSeconds: 86400,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createPoll.mutateAsync(values);
      toast.success("Poll created successfully!");
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Failed to create poll");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Poll
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Poll</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="What should we ask?" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description & Options</Label>
            <Textarea
              id="description"
              placeholder={"Describe your poll and list the options.\nExample:\n1. Option A\n2. Option B\n3. Option C"}
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="optionCount">Number of Options</Label>
              <Input id="optionCount" type="number" min={2} max={32} {...form.register("optionCount")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditBudget">Credit Budget</Label>
              <Input id="creditBudget" type="number" min={1} {...form.register("creditBudget")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <Button type="submit" className="w-full" disabled={createPoll.isPending}>
            {createPoll.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Poll
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
