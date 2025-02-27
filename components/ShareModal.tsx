import React from 'react';
import { Twitter, Share2, MessageCircle, Info, Check, Heart } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ShareModalProps } from "~api/types";

const ShareModal: React.FC<ShareModalProps> = ({
    open, 
    onOpenChange, 
    onShare, 
    onRate,
    helpTasks 
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[480px] rounded-lg p-6">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-semibold text-gray-900">Help Grow the Forest</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-5">
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50/50 to-white rounded-lg border border-gray-100">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0 border border-gray-100">
                            <Heart className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Support Our Forest</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Help us grow by completing these tasks. Every share and rating makes a difference!</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        helpTasks.shared ? 'bg-green-100' : 'border-2 border-gray-200'
                                    }`}>
                                        {helpTasks.shared && <Check className="h-3.5 w-3.5 text-green-600" />}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-gray-900 block">Share with friends</span>
                                        <span className="text-xs text-gray-500">Share your forest journey</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="w-28 h-8 text-sm bg-white border-gray-200"
                                        >
                                            Share
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-28">
                                        <DropdownMenuItem onClick={() => onShare('x')}>
                                            <div className="flex items-center gap-2">
                                                <Twitter className="h-3.5 w-3.5" />
                                                <span>X (Twitter)</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onShare('bluesky')}>
                                            <div className="flex items-center gap-2">
                                                <Share2 className="h-3.5 w-3.5" />
                                                <span>Bluesky</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onShare('whatsapp')}>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                <span>WhatsApp</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        helpTasks.rated ? 'bg-green-100' : 'border-2 border-gray-200'
                                    }`}>
                                        {helpTasks.rated && <Check className="h-3.5 w-3.5 text-green-600" />}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-gray-900 block">Rate extension</span>
                                        <span className="text-xs text-gray-500">Help others find us</span>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline"
                                    onClick={onRate}
                                    className="w-28 h-8 text-sm bg-white border-gray-200 hover:bg-gray-50"
                                >
                                    Rate
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;