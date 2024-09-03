import { useState } from "react";
import MaskedInput from "react-text-mask";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import USFlag from '../../assets/svgs/UsaFlag.svg'

export const PhoneNumberInput = ({value, onChange, error}) => (
    <div className="flex flex-row">
        <div className="flex w-[100px] bg-white border border-gray-200 rounded-md mr-2 text-center items-center justify-center">
            <img src={USFlag} className="h-[13px] w-[24px] mr-2 rounded-sm"/> +1 
        </div>
        <MaskedInput
            mask={[/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
            guide={false}
            value={value}
            onChange={onChange}
            className={`w-full border border-gray-200 rounded-md pl-2 outline-neutral p-2 ${error? 'border-errorRed' : null}`}
            placeholder="Phone Number"
            type="text"
        />
    </div>
)

export const DateInput = ({value, onChange, error}) =>(
    <MaskedInput
        mask={[/\d/, /\d/, "-", /\d/, /\d/,  "-", /\d/, /\d/, /\d/, /\d/,]}
        guide={false}
        value={value}
        onChange={onChange}
        className={`w-full border border-primary rounded-md pl-2 outline-primary p-2 ${error ? 'border-errorRed' : null}`}
        placeholder="Date"
        type="date"
    />
)

export const PasswordInput = ({value, onChange, error}) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => setShowPassword((showPassword) => !showPassword);

    return(
        <div className="relative">
            <input
                className={`border border-gray-200 rounded-md pl-2 outline-neutral p-2 w-full ${error ? 'border-errorRed' : null}`}
                placeholder="Password" 
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
            />
            <button 
                className="absolute transform -translate-y-1/2 top-1/2 right-2"
                onClick={togglePasswordVisibility}
            >
                <div>
                {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                </div>
            </button>
        </div>
    )
}