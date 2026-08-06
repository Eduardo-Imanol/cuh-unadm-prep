import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export interface AuthErrorAlertProps {
  message: string;
}

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden="true" />
      <span>{message}</span>
    </motion.div>
  );
}
