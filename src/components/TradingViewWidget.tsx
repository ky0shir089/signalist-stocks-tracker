"use client"

import {memo} from 'react';
import useTradingViewWIdget from "@/app/hooks/useTradingViewWIdget";
import {cn} from "@/lib/utils";

interface TradingViewWidgetProps {
    title?: string
    scriptUrl: string
    config: Record<string, unknown>
    height?: number
    className?: string
}

function TradingViewWidget({title, scriptUrl, config, height = 600, className}: TradingViewWidgetProps) {
    const container = useTradingViewWIdget(scriptUrl, config, height)

    return (
        <div className="w-full">
            {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}
            <div className={cn("tradingview-widget-container", className)} ref={container}>
                <div className="tradingview-widget-container__widget"
                     style={{height: "calc(100% - 32px)", width: "100%"}}/>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
