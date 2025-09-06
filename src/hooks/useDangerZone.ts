import { useCallback, useMemo, useState } from "react";
import { UMSService } from "../services/UMSService";

type UMSKey = { id: string; name: string };

export interface UseDangerZoneDeleteOptions {
  ums: UMSKey;           
  onDeleted?: () => void;
}

export function useDangerZone({ ums, onDeleted }: UseDangerZoneDeleteOptions) {
  const [isOpen, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = useMemo(
    () => acknowledge && confirmText.trim() === ums.name.trim(),
    [acknowledge, confirmText, ums.name]
  );

  const open = useCallback(() => {
    setOpen(true);
    setConfirmText("");
    setAcknowledge(false);
    setError(null);
  }, []);

  const close = useCallback(() => {
    if (!isDeleting) setOpen(false);
  }, [isDeleting]);

  const resetError = useCallback(() => setError(null), []);

  const deleteNow = useCallback(async () => {
    if (!canDelete || isDeleting) return;
    setDeleting(true);
    setError(null);
    try {
      await UMSService.deleteUMS(ums.id);
      setDeleting(false);
      setOpen(false);
      onDeleted?.();
    } catch (e) {
      setDeleting(false);
      setError((e as Error).message);
    }
  }, [canDelete, isDeleting, onDeleted, ums.id]);

  return {
    isOpen, open, close,
    confirmText, setConfirmText,
    acknowledge, setAcknowledge,
    canDelete, isDeleting, error,
    deleteNow, resetError,
  };
}
