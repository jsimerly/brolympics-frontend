import { useState, useRef, useEffect } from 'react';
import StepManager from './StepManager';

const StartLeague = () => {
    
    const [step, setStep] = useState(1)
    const totalSteps = 4
    const progress = (step/totalSteps) * 100

    const nextStep = () => {
        if (step !== totalSteps){
            setStep(step => step+1)
        }
    }

    const prevStep = () => {
        if (step !== 1){
            setStep(step => step-1)
        }
    }

    const containerRef = useRef()
  
    const scrollToTop = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo(0, 0);
      }
    }
  
    useEffect(() => {
      scrollToTop();
    }, [step]);
    


  return (
    <div 
        ref={containerRef}
        className='flex flex-col items-center justify-start w-full h-[calc(100vh-60px)] overflow-x-hidden bg-offWhite text-neutralDark'
    >
        <div className='fixed z-20 w-full'>
            <div className='flex items-center justify-center w-full px-6 py-3 bg-offWhite'>
                <div className={`${step === 1 ? 'font-bold' : ''} w-1/4 text-center`}>
                    League
                </div>
                |
                <div className={`${step === 2 ? 'font-bold' : ''} w-1/4 text-center text-[14px]`}>
                    Brolympics
                </div>
                |
                <div className={`${step === 3 ? 'font-bold' : ''} w-1/4 text-center`}>
                    Events
                </div>
                |
                <div className={`${step === 4 ? 'font-bold' : ''} w-1/4 text-center`}>
                    Players
                </div>
            </div>
            <div className='px-6 mr-6'>
                <div className='relative h-[4px] w-full bg-gray-200 mx-3 rounded-full '>
                    <div className='absolute top-0 left-0 h-full duration-200 ease-out rounded-full transition-width bg-primary' style={{width: `${progress}%`}}/>
                </div>
            </div>

        </div>
        <div className='h-[40px] '/>
        <div className='flex w-full h-full'>
            <StepManager
                step={step}
                nextStep={nextStep} 
                prevStep={prevStep}      
            />
        </div>
    </div>
  )
}

export default StartLeague