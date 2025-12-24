import React, { useEffect, useState } from 'react';
import styles from './ConfirmDialog.module.css';
import { Button } from '../Button';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    variant?: 'destructive' | 'primary';
    confirmLabel?: string;
    cancelLabel?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    variant = 'destructive',
    confirmLabel,
    cancelLabel,
}) => {
    const t = useTranslations('Common');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.backdrop}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={styles.dialog}
                    >
                        <div className={styles.content}>
                            <h2 className={styles.title}>{title}</h2>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.footer}>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className={styles.cancelButton}
                            >
                                {cancelLabel || t('cancel')}
                            </Button>
                            <Button
                                variant={variant === 'destructive' ? 'primary' : 'primary'}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={cn(
                                    styles.confirmButton,
                                    variant === 'destructive' && styles.destructive
                                )}
                            >
                                {confirmLabel || t('confirm')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
