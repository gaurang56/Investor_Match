import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage, } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button'; 
import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/generated/api';
import { useRouter } from 'next/navigation';

export default function Header() {

  const pay = useAction(api.stripe.pay)
  const router = useRouter();
  const user = useQuery(api.users.getUser)

  async function handleUpgradeClick() {
    const url = await pay();
    router.push(url)
  }

  const isSubscribed = user && (user.endsOn ?? 0) > Date.now()

    return (
        <div className="px-8 py-4 border border-b-[1px] flex gap-4 justify-between items-center">
            {/* Logo  */}
            <div className='flex gap-4'>
                <p className="font-bold"> VentureMate</p>
                <div className="flex gap-4">
                    <a href="/home">Current Matches</a>
                    <a href="/saved">Previous Matches</a>
                    <a href="/form">New Search</a>
                </div>
                {
                  !isSubscribed && (<Button onClick={handleUpgradeClick}>Upgrade</Button>)
                }
                

            </div>
            <div className="relative">
        
      <DropdownMenu>
        <DropdownMenuTrigger>
          {/* User Avatar */}
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          
        </DropdownMenuTrigger>
        
        <DropdownMenuContent>
          {/* Dropdown Menu Items */}
          <DropdownMenuItem>
            <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SignOutButton/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
            
        </div>
    )
}