import {useState} from 'react';
import CreateWrapper from "./CreateWrapper";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageCropper, {readImageFile} from '../Util/ImageCropper';
import { useNotification } from '../Util/Notification';

const CreateLeaguePage = ({step, nextStep, setLeague}) => {
    const [league, setLeagueData] = useState({name: "", img: null, imgSrc: null});
    const [cropping, setCropping] = useState(false)
    const {showNotification} = useNotification()

    const handleCreateClicked = () => {
        if (league.name) {
            nextStep();
            setLeague(league);
        } else {
            showNotification("You must enter a league name.")
        }
    };

    const handleImageUpload = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readImageFile(file);
            
            setLeagueData(prevLeague => ({...prevLeague, img: file, imgSrc: imageDataUrl }));
            setCropping(true);
        }
    };

    const setCroppedImage = (croppedImage) => {
        setLeagueData(prevLeague => ({...prevLeague, img: croppedImage}))
        setCropping(false)
    }



    const handleNameChange = (e) => {
        setLeagueData(prevLeague => ({
            ...prevLeague,
            name: e.target.value
        }));
    };

    return (
        <CreateWrapper
            button_text={'Create League'}
            step={step}
            submit={handleCreateClicked}
            title={'Create Your League'}
            description={'A league is a collection of brolympics where you can keep track of historical brolympics winners, events, teams, and even player performances.'}
        >
            <div className='flex flex-col w-full gap-3'>
                <div>
                    <h3 className='ml-1'>Name *</h3>
                    <input
                        type='text'
                        value={league.name}
                        onChange={handleNameChange}
                        placeholder='Ex: BSU Boys'
                        className='w-full p-2 border border-gray-200 rounded-md outline-none'
                    />
                </div>
                <div>
                    <h3 className='ml-1'>Upload a Logo <span className='text-[12px]'> (Optional)</span></h3>    
                    <input 
                            type='file' 
                            accept="image/*"
                            id='file_league' 
                            onChange={handleImageUpload}
                            hidden      
                        />
                    <label 
                        htmlFor='file_league'  
                        className='inline-flex bg-white border border-gray-200 rounded-md cursor-pointer'
                    >
                        { league.img ?
                            <img src={league.img} className='max-w-[100px] rounded-md'/>
                            :
                            <div className='w-[100px] h-[100px] rounded-md flex items-center justify-center'>
                                <CameraAltIcon className='bg-white w-[100px] text-neutral' sx={{fontSize:60}}/>
                            </div>
                        }
                    </label>
                    {cropping &&
                        <ImageCropper 
                            img={league.imgSrc} 
                            setCroppedImage={setCroppedImage}
                        />
                    }
                </div>
            </div>
        </CreateWrapper>
    );
}

export default CreateLeaguePage;
