import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  FileText,
  Loader2,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimeSlot {
  time: string;
  displayTime: string;
  available: boolean;
}

interface FormData {
  name: string;
  email: string;
  businessDescription: string;
}

type Step = "form" | "calendar" | "success";

export function SchedulingModal({ open, onOpenChange }: SchedulingModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessDescription: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const { data: availableSlots, isLoading: slotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ["/api/calendar/availability", selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await fetch(`/api/calendar/availability?date=${selectedDate.toISOString()}`);
      if (!res.ok) throw new Error("Failed to fetch availability");
      return res.json();
    },
    enabled: !!selectedDate && step === "calendar",
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });

  const [bookingError, setBookingError] = useState<string | null>(null);

  const bookingMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      businessDescription: string;
      meetingTime: string;
    }) => {
      const res = await apiRequest("POST", "/api/calendar/book", data);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to book meeting");
      }
      return result;
    },
    onSuccess: () => {
      setBookingError(null);
      setStep("success");
      // Invalidate all availability caches so reopening shows updated slots
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/availability"] });
    },
    onError: (error: Error) => {
      setBookingError(error.message);
      setSelectedSlot(null);
    },
  });

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.businessDescription.trim()) {
      errors.businessDescription = "Please describe your business goals";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      setStep("calendar");
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    
    const [hours, minutes] = selectedSlot.split(":").map(Number);
    const meetingTime = new Date(selectedDate);
    meetingTime.setHours(hours, minutes, 0, 0);
    
    bookingMutation.mutate({
      ...formData,
      meetingTime: meetingTime.toISOString(),
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setFormData({ name: "", email: "", businessDescription: "" });
      setSelectedDate(undefined);
      setSelectedSlot(null);
      setFormErrors({});
    }, 300);
  };

  const disabledDays = [
    { before: startOfDay(new Date()) },
    { after: addDays(new Date(), 30) },
    { dayOfWeek: [0, 6] },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <DialogHeader className="relative p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {step === "success" ? (
                <Check className="w-5 h-5 text-primary" />
              ) : step === "calendar" ? (
                <CalendarIcon className="w-5 h-5 text-primary" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {step === "success" 
                  ? "Meeting Scheduled!" 
                  : step === "calendar" 
                    ? "Pick a Time" 
                    : "Schedule a Meeting"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {step === "success"
                  ? "Check your email for details"
                  : step === "calendar"
                    ? "Select an available 30-minute slot"
                    : "Tell us about your project"}
              </p>
            </div>
          </div>
          
          {step !== "success" && (
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1 flex-1 rounded-full transition-colors ${step === "form" || step === "calendar" ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-1 flex-1 rounded-full transition-colors ${step === "calendar" ? "bg-primary" : "bg-muted"}`} />
            </div>
          )}
        </DialogHeader>
        
        <div className="relative p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`bg-card/50 border-border/50 ${formErrors.name ? "border-destructive" : ""}`}
                    data-testid="input-schedule-name"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`bg-card/50 border-border/50 ${formErrors.email ? "border-destructive" : ""}`}
                    data-testid="input-schedule-email"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-destructive">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Business Description & Goals
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your current tech stack, pain points, and what you'd like to achieve..."
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    className={`bg-card/50 border-border/50 min-h-[120px] resize-none ${formErrors.businessDescription ? "border-destructive" : ""}`}
                    data-testid="input-schedule-description"
                  />
                  {formErrors.businessDescription && (
                    <p className="text-xs text-destructive">{formErrors.businessDescription}</p>
                  )}
                </div>
                
                <Button 
                  onClick={handleFormSubmit}
                  className="w-full font-semibold"
                  size="lg"
                  data-testid="button-schedule-continue"
                >
                  Continue to Scheduling
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
            
            {step === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-xl p-3 border border-border/50">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      disabled={disabledDays}
                      className="mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {selectedDate 
                        ? `Available on ${format(selectedDate, "MMM d, yyyy")}`
                        : "Select a date first"}
                    </div>
                    
                    <div className="h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {!selectedDate ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          Pick a date to see available times
                        </div>
                      ) : slotsLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full rounded-lg" />
                        ))
                      ) : availableSlots && availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedSlot(slot.time)}
                            disabled={!slot.available}
                            className={`w-full p-3 rounded-lg text-sm font-medium transition-all
                              ${selectedSlot === slot.time 
                                ? "bg-primary text-primary-foreground" 
                                : slot.available 
                                  ? "bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5" 
                                  : "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
                              }`}
                            data-testid={`button-slot-${slot.time}`}
                          >
                            {slot.displayTime}
                          </button>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No available slots for this date
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {bookingError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {bookingError}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1"
                    data-testid="button-schedule-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleBooking}
                    disabled={!selectedSlot || bookingMutation.isPending}
                    className="flex-1 font-semibold"
                    data-testid="button-schedule-confirm"
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Meeting
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
            
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Check className="w-10 h-10 text-primary" strokeWidth={3} />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  You're All Set!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6 max-w-sm"
                >
                  Your meeting request has been received. We'll confirm the details at{" "}
                  <span className="text-foreground font-medium">{formData.email}</span>
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card/50 rounded-xl p-4 border border-border/50 w-full max-w-xs"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">
                        {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-muted-foreground">
                        {selectedSlot && `${selectedSlot} (30 min)`}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={handleClose}
                    className="mt-6"
                    data-testid="button-schedule-done"
                  >
                    Done
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
