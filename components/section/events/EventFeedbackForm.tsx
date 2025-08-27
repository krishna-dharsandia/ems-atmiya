"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFeedbackSchema, EventFeedbackSchema } from "@/schemas/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { submitEventFeedback } from "./submitEventFeedbackAction";

interface EventFeedbackFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function EventFeedbackForm({ eventId, onSuccess }: EventFeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFeedbackSchema>({
    resolver: zodResolver(eventFeedbackSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = async (data: EventFeedbackSchema) => {
    setIsSubmitting(true);
    try {
      const response = await submitEventFeedback(eventId, data);
      if (response.success) {
        toast.success("Thank you for your feedback!");
        reset();
        onSuccess?.();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setValue("rating", value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Share Your Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoveredRating ?? rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {rating === 0 ? "Select a rating" : `You rated: ${rating} star${rating > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-base font-medium">
              Comment (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about this event..."
              className="min-h-[100px] resize-none"
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
