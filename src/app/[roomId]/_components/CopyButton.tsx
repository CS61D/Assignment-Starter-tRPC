"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ copyText }: { copyText: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(copyText);
        setCopied(true);
    };
    return (
        <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center space-x-2"
        >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            <span>{copied ? "Copied" : "Copy Room Id"}</span>
        </Button>
    );
}
