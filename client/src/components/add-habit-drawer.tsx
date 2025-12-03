import { Drawer } from "vaul";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHabits, Frequency } from "@/lib/habits";
import { cn } from "@/lib/utils";
import { Clock, Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Habit title is required"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  color: z.string(),
  reminderTime: z.string().optional(),
});

interface AddHabitDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  "hsl(160, 50%, 45%)", // Green
  "hsl(200, 60%, 60%)", // Blue
  "hsl(260, 60%, 65%)", // Purple
  "hsl(340, 70%, 60%)", // Pink
  "hsl(40, 70%, 60%)",  // Orange
  "hsl(0, 60%, 70%)",   // Red
];

export function AddHabitDrawer({ open, onOpenChange }: AddHabitDrawerProps) {
  const { addHabit, editHabit, editingHabit, deleteHabit } = useHabits();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const isEditing = !!editingHabit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      frequency: "daily",
      color: COLORS[0],
      reminderTime: "",
    },
  });

  // Reset form when opening/closing or switching habits
  useEffect(() => {
    if (open) {
      if (editingHabit) {
        form.reset({
          title: editingHabit.title,
          frequency: editingHabit.frequency,
          color: editingHabit.color,
          reminderTime: editingHabit.reminderTime || "",
        });
        setSelectedColor(editingHabit.color);
      } else {
        form.reset({
          title: "",
          frequency: "daily",
          color: COLORS[0],
          reminderTime: "",
        });
        setSelectedColor(COLORS[0]);
      }
    }
  }, [open, editingHabit, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEditing && editingHabit) {
      editHabit(editingHabit.id, {
        title: data.title,
        frequency: data.frequency as Frequency,
        color: selectedColor,
        reminderTime: data.reminderTime || undefined,
      });
    } else {
      addHabit({
        title: data.title,
        frequency: data.frequency as Frequency,
        color: selectedColor,
        reminderTime: data.reminderTime || undefined,
      });
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editingHabit) {
      deleteHabit(editingHabit.id);
      onOpenChange(false);
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-card flex flex-col rounded-t-[2rem] mt-24 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 outline-none border-t border-white/20 max-h-[90vh]">
          <div className="p-6 bg-card rounded-t-[2rem] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-md mx-auto pb-10">
              <div className="flex items-center justify-between mb-6">
                <Drawer.Title className="font-display text-2xl font-bold">
                  {isEditing ? "Edit Habit" : "New Habit"}
                </Drawer.Title>
                {isEditing && (
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-muted-foreground font-medium">What do you want to do?</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="e.g., Read for 15 mins"
                    className="h-14 text-lg bg-muted/30 border-transparent focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                  />
                  {form.formState.errors.title && (
                    <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-muted-foreground font-medium">How often?</Label>
                  <RadioGroup 
                    value={form.watch("frequency")}
                    onValueChange={(val) => form.setValue("frequency", val as Frequency)}
                    className="flex gap-2"
                  >
                    {["daily", "weekly", "monthly"].map((freq) => (
                      <div key={freq} className="flex-1">
                        <RadioGroupItem value={freq} id={freq} className="peer sr-only" />
                        <Label
                          htmlFor={freq}
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-transparent p-3 hover:bg-muted/20 hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer transition-all capitalize font-medium"
                        >
                          {freq}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-muted-foreground font-medium">Reminder (Optional)</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Clock size={20} />
                    </div>
                    <Input
                      type="time"
                      {...form.register("reminderTime")}
                      className="h-14 pl-10 text-lg bg-muted/30 border-transparent focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-muted-foreground font-medium">Pick a color</Label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full transition-all shrink-0",
                          selectedColor === color ? "ring-4 ring-offset-2 ring-offset-card scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : 'none' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    {isEditing ? "Save Changes" : "Create Habit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
