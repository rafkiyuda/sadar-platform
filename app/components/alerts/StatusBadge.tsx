import React from 'react';
import { DriverStatus } from "@/app/types";
import { STATUS_COLORS, STATUS_MESSAGES } from "@/app/lib/constants";
import { AlertCircle, CheckCircle, Moon, EyeOff } from "lucide-react";

interface StatusBadgeProps {
    status: DriverStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ status }) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-500';
    const message = STATUS_MESSAGES[status];

    // Icon selection
    const Icon = () => {
        switch (status) {
            case 'ALERT': return <CheckCircle className="w-12 h-12 text-white" />;
            case 'DROWSY': return <Moon className="w-12 h-12 text-white" />;
            case 'CRITICAL': return <EyeOff className="w-12 h-12 text-white animate-bounce" />;
            default: return <AlertCircle className="w-12 h-12 text-white" />;
        }
    };

    return (
        <div className={`flex flex-col items-center justify-start w-80 h-80 pt-10 rounded-3xl shadow-2xl transition-all duration-500 ${colorClass} bg-opacity-90 backdrop-blur-sm border border-white/20`}>
            {/* Icon Slot - Fixed Height */}
            <div className="h-24 flex items-center justify-center">
                <div className="p-4 bg-white/20 rounded-full">
                    <Icon />
                </div>
            </div>

            {/* Title Slot - Fixed Height */}
            <div className="h-16 flex items-center justify-center w-full">
                <h2 className="text-3xl font-black text-white tracking-tight">
                    {status}
                </h2>
            </div>

            {/* Message Slot - Fixed Height */}
            <div className="h-16 flex items-start justify-center w-full px-4">
                <p className="text-white/90 text-sm font-medium tracking-wide text-center leading-relaxed">
                    {message}
                </p>
            </div>
        </div>
    );
});
