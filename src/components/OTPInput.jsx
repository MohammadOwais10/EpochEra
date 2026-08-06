import { useState, useRef, useEffect } from 'react'

export default function OTPInput({ value, onChange, length = 6, disabled = false }) {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputRefs = useRef([])

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length)
      while (otpArray.length < length) {
        otpArray.push('')
      }
      setOtp(otpArray)
    }
  }, [value, length])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Call parent onChange
    onChange(newOtp.join(''))

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      if (isNaN(pastedData[i])) continue
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    onChange(newOtp.join(''))
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex].focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-14 h-14 text-center text-xl font-bold bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 rounded-xl text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 hover:border-slate-500"
          autoComplete="off"
        />
      ))}
    </div>
  )
}