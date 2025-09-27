import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface RatePromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRate: () => void
}

const RatePromptModal: React.FC<RatePromptModalProps> = ({ open, onOpenChange, onRate }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[560px] max-h-[85vh] overflow-y-auto p-6 bg-brand-grey border border-brand-darkblue rounded-none">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-candu tracking-wide uppercase text-brand-darkblue">
            {chrome.i18n.getMessage('rateModal_title') || 'Enjoying Idle Forest?'}
          </DialogTitle>
          <DialogDescription className="text-brand-darkblue/80 text-center">
            {chrome.i18n.getMessage('rateModal_description') || "You've been planting seeds with us for a while. Would you mind rating the extension?"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6"
            onClick={onRate}
          >
            {chrome.i18n.getMessage('rateModal_rateNow') || 'Rate Now'}
          </Button>
          <Button
            variant="ghost"
            className="text-brand-darkblue"
            onClick={() => onOpenChange(false)}
          >
            {chrome.i18n.getMessage('rateModal_noThanks') || 'No thanks'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RatePromptModal
