import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
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
  prefillData?: {
    name?: string;
    email?: string;
    businessDescription?: string;
  };
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

export function SchedulingModal({ open, onOpenChange, prefillData }: SchedulingModalProps) {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    name: prefillData?.name || "",
    email: prefillData?.email || "",
    businessDescription: prefillData?.businessDescription || "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        name: prefillData.name || prev.name,
        email: prefillData.email || prev.email,
        businessDescription: prefillData.businessDescription || prev.businessDescription,
      }));
    }
  }, [prefillData]);

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
      errors.name = t("modal.form.nameRequired");
    }

    if (!formData.email.trim()) {
      errors.email = t("modal.form.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("modal.form.emailInvalid");
    }

    if (!formData.businessDescription.trim()) {
      errors.businessDescription = t("modal.form.descriptionRequired");
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
    // Create meeting time in UTC to match server's slot generation
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const meetingTime = new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));

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
      <DialogContent className={`w-[95vw] sm:w-full max-h-[85vh] p-0 gap-0 flex flex-col bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl transition-all duration-300 ${step === 'calendar' ? 'sm:max-w-[750px] rounded-2xl' : 'sm:max-w-[540px] rounded-2xl'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        <DialogHeader className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/50 flex-shrink-0">
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
                  ? t("modal.title.success")
                  : step === "calendar"
                    ? t("modal.title.calendar")
                    : t("modal.title.form")}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {step === "success"
                  ? t("modal.subtitle.success")
                  : step === "calendar"
                    ? t("modal.subtitle.calendar")
                    : t("modal.subtitle.form")}
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

        <div className="relative p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col min-h-0">
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
                    {t("modal.form.name")}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t("modal.form.namePlaceholder")}
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
                    {t("modal.form.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("modal.form.emailPlaceholder")}
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
                    {t("modal.form.description")}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t("modal.form.descriptionPlaceholder")}
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
                  {t("modal.form.continue")}
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
                className="flex flex-col flex-1 min-h-0"
              >
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-card/50 rounded-xl p-2 sm:p-3 border border-border/50 overflow-x-auto">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        disabled={disabledDays}
                        className="mx-auto min-w-[260px] text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {selectedDate
                          ? `${t("modal.calendar.availableOn")} ${format(selectedDate, "MMM d, yyyy")}`
                          : t("modal.calendar.selectDate")}
                      </div>

                      <div className="max-h-[120px] sm:max-h-[200px] md:max-h-[250px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        {!selectedDate ? (
                          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                            {t("modal.calendar.pickDate")}
                          </div>
                        ) : slotsLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full rounded-lg" />
                          ))
                        ) : availableSlots && availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedSlot(slot.time)}
                              disabled={!slot.available}
                              className={`w-full p-2.5 rounded-lg text-sm font-medium transition-all
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
                          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                            {t("modal.calendar.noSlots")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="p-2 mt-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {bookingError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-3 mt-3 border-t border-border/50 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1"
                    size="sm"
                    data-testid="button-schedule-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {t("modal.calendar.back")}
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedSlot || bookingMutation.isPending}
                    className="flex-1 font-semibold"
                    size="sm"
                    data-testid="button-schedule-confirm"
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        {t("modal.calendar.booking")}
                      </>
                    ) : (
                      <>
                        {t("modal.calendar.confirm")}
                        <Check className="w-4 h-4 ml-1" />
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
                  {t("modal.success.title")}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6 max-w-sm"
                >
                  {t("modal.success.subtitle")}{" "}
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
                        {selectedSlot && `${selectedSlot} (${t("modal.success.duration")})`}
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
                    {t("modal.success.done")}
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
