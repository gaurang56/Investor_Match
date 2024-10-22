
import { Button } from '@/components/ui/button'; 
import { useAction} from 'convex/react';
import { api } from '../../convex/generated/api';
import { useRouter } from 'next/navigation';
import { userIsSubscribed } from '@/hooks/userIsSubscribed';
import { Settings } from 'lucide-react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useDarkMode } from '@/app/DarkModeContext';


export default function Header() {

  const pay = useAction(api.stripe.pay)
  const router = useRouter();
  const { isDarkMode, setIsDarkMode } = useDarkMode(); 

  console.log(isDarkMode)

  

    return (
        <div className={`px-8 py-4 border border-b-[1px] flex gap-4 justify-between items-center w-full ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700 border-none"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`} >
            {/* Logo  */}
            <div className='flex gap-4'>
                <p className="font-bold"> VentureMate</p>
                <div className="flex gap-4">
                    <a href="/home">Current Matches</a>
                    <a href="/saved">Previous Matches</a>
                    <a href="/form">New Search</a>
                </div>
                

            </div>

            <div className='flex items-center gap-4'>

            <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)
            }
            className={`rounded-full ${
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
              

              <a href="settings">
                <Settings />
              </a>

            </div>
           

            
            
        
              {/*<SignOutButton/> */}
    </div>
            
    
    )
}
