import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

// Generate notification sound using Web Audio API (no external file needed)
const playNotificationSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        // First tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.value = 830;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.3);

        // Second tone (higher pitch, slight delay)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.5);

        // Third tone (even higher, pleasant chime)
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.value = 1320;
        osc3.type = 'sine';
        gain3.gain.setValueAtTime(0.2, ctx.currentTime + 0.3);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc3.start(ctx.currentTime + 0.3);
        osc3.stop(ctx.currentTime + 0.7);
    } catch (e) {
        console.log('Sound not supported');
    }
};

export function useTicketNotifications(token) {
    const [pendingCount, setPendingCount] = useState(0);
    const [newTicketAlert, setNewTicketAlert] = useState(null); // { ticketNumber, name, topic }
    const lastKnownCountRef = useRef(null);
    const hasPlayedInitialRef = useRef(false);

    const fetchPendingCount = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                const newCount = data.pendingCount || 0;

                // If count increased AND we've already loaded once (not the first load)
                if (lastKnownCountRef.current !== null && newCount > lastKnownCountRef.current) {
                    playNotificationSound();
                    setNewTicketAlert({
                        message: `New ticket received! (${newCount} pending)`,
                        timestamp: Date.now()
                    });

                    // Auto-dismiss after 5 seconds
                    setTimeout(() => setNewTicketAlert(null), 5000);
                }

                // On first load, play sound if there are pending tickets
                if (lastKnownCountRef.current === null && newCount > 0 && !hasPlayedInitialRef.current) {
                    hasPlayedInitialRef.current = true;
                    playNotificationSound();
                }

                lastKnownCountRef.current = newCount;
                setPendingCount(newCount);
            }
        } catch (e) {
            // silently fail
        }
    };

    useEffect(() => {
        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, [token]);

    return { pendingCount, newTicketAlert, dismissAlert: () => setNewTicketAlert(null) };
}

export default useTicketNotifications;
