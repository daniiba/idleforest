import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface AlertPromoProps {
  message: string
}

const AlertPromo: React.FC<AlertPromoProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-800 border-0 rounded-none p-4 my-4 flex items-start gap-3">
      <div className="flex-shrink-0 pt-0.5">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div>
        <p className="font-bold text-sm">Performance warning</p>
        <p className="text-xs">{message}</p>
      </div>
    </div>
  )
}

export default AlertPromo
