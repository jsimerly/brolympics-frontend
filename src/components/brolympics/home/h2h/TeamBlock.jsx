import React from 'react'

const TeamsBlock = ({name, team_1_name, team_1_record, team_1_img, team_2_name, team_2_record, team_2_img, team_1_seed, team_2_seed, is_bracket}) => {

    const TeamBlock = ({name, record, img, seed ,reverse=false}) => {
        let fontSize;
        if (name) {
          if (name.length <= 10) {
            fontSize = '16px';
          } else if (name.length <= 16) {
            fontSize = '14px';
          } else if (name.length <= 20) {
            fontSize = '12px';
          } else {
            fontSize = '10px'
          }
        }
        
        return (
          <div className=''>
            <div className={`flex ${reverse ? 'flex-row-reverse justify-start' : 'flex-row justify-start'} gap-2`}>
              <img src={img} className='h-[60px] w-[60px] min-w-[60px] rounded-md'/>              
              <div className={`flex flex-col justify-center items-${reverse ? 'end' : 'start'}`}>
                <div 
                  className={`flex font-bold items-center ${reverse ? 'justify-end text-end' : 'justify-start text-start'}`}
                  style={{ fontSize }}
                >
                    {name}
                </div>
                  {seed ? 
                    <div>#{seed}</div>
                    :  
                    <div className='text-[12px]'>{record}</div>
                  }
          
              </div>
            </div>
        </div>
        );
      };
      
  return (
    <>
        <h2 className='pb-2 font-bold'>{name}</h2>
        <div className='flex'>
            <div className='w-1/2'>
            <TeamBlock name={team_1_name} record={team_1_record} img={team_1_img} seed={team_1_seed}/>
            </div>
            {is_bracket ?
              <div className='flex items-end'>
                <div className='flex flex-col h-[20px] justify-between'>
                  <div className='h-[2px] w-[20px] bg-primary'/>
                  <div className='h-[2px] w-[20px] bg-primary'/>
                </div>
                <div className='h-[20px] w-[2px] bg-primary'/>
                <div className='h-[20px] flex items-center'>
                  <div className='h-[2px] w-[20px] bg-primary'/>
                </div>
              </div>
            :
            <div className='flex items-center px-3'>
              <div className='text-center rounded-full w-[28px] flex items-center justify-center'>vs</div>
            </div>
            }

            <div className='w-1/2'>
            <TeamBlock name={team_2_name} record={team_2_record} img={team_2_img} seed={team_2_seed} reverse={true}/>
            </div>
        </div>
    </>
  )
}

export default TeamsBlock