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
			<DialogContent className="w-[560px] max-h-[85vh] overflow-y-auto p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				<DialogHeader className="mb-4">
					<DialogTitle className="text-center text-2xl font-candu tracking-wide uppercase text-brand-darkblue">{chrome.i18n.getMessage('share_title')}</DialogTitle>
				</DialogHeader>
				
				<div className="space-y-5">
					{/* Info banner */}
					<div className="bg-brand-yellow text-brand-darkblue border border-brand-darkblue px-4 py-3 flex items-start gap-3">
						<div className="flex-shrink-0 pt-0.5">
							<Heart className="h-5 w-5" />
						</div>
						<div>
							<h4 className="text-sm font-medium">{chrome.i18n.getMessage('share_supportTitle')}</h4>
							<p className="text-sm mt-0.5">{chrome.i18n.getMessage('share_description')}</p>
						</div>
					</div>

					<div className="space-y-3">
						{/* Share task */}
						<div className="bg-brand-grey p-4 border border-brand-darkblue rounded-none">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${helpTasks.shared ? 'bg-green-100' : 'border-2 border-brand-darkblue'}`}>
										{helpTasks.shared && <Check className="h-3.5 w-3.5 text-green-600" />}
									</div>
									<div className="min-w-0">
										<span className="text-sm font-medium text-brand-darkblue block">{chrome.i18n.getMessage('share_shareFriendsTitle')}</span>
										<span className="text-xs text-brand-darkblue/80">{chrome.i18n.getMessage('share_shareFriendsDescription')}</span>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="w-28 h-8 text-sm bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none">
											{chrome.i18n.getMessage('share_copy')}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48 bg-brand-grey border border-brand-darkblue rounded-none">
										<DropdownMenuItem onClick={() => onShare('x')}>
											<div className="flex items-center gap-2">
												<Twitter className="h-3.5 w-3.5" />
												<span>{chrome.i18n.getMessage('share_shareOnX')}</span>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => onShare('bluesky')}>
											<div className="flex items-center gap-2">
												<Share2 className="h-3.5 w-3.5" />
												<span>{chrome.i18n.getMessage('share_shareOnBluesky')}</span>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => onShare('whatsapp')}>
											<div className="flex items-center gap-2">
												<MessageCircle className="h-3.5 w-3.5" />
												<span>{chrome.i18n.getMessage('share_shareOnWhatsapp')}</span>
											</div>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Rate task */}
						<div className="bg-brand-grey p-4 border border-brand-darkblue rounded-none">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${helpTasks.rated ? 'bg-green-100' : 'border-2 border-brand-darkblue'}`}>
										{helpTasks.rated && <Check className="h-3.5 w-3.5 text-green-600" />}
									</div>
									<div className="min-w-0">
										<span className="text-sm font-medium text-brand-darkblue block">{chrome.i18n.getMessage('share_rateUs')}</span>
										<span className="text-xs text-brand-darkblue/80">{chrome.i18n.getMessage('share_rateDescription')}</span>
									</div>
								</div>
								<Button 
									onClick={onRate}
									className="w-28 h-8 text-sm bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none"
								>
									{chrome.i18n.getMessage('share_rateUs')}
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