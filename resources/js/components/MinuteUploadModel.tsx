import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { Event } from "@/types/Admin/Event";

interface Props {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MinuteUploadModal({ event, isOpen, onClose }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    minute_pdf: null as File | null,
  });

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(`/admin/events/${event.id}/upload-minute`, {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Upload Minute PDF
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="minute_pdf">Select PDF File</Label>
            <Input
              id="minute_pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setData("minute_pdf", e.target.files?.[0] || null)}
            />
            {errors.minute_pdf && (
              <p className="text-xs font-medium text-red-500">{errors.minute_pdf}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing || !data.minute_pdf}>
              <Upload className="mr-2 h-4 w-4" />
              {processing ? "Uploading..." : "Upload Minute"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}