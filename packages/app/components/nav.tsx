import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

const Nav = () => {
  return (
    <nav className='flex flex-1 justify-between items-center my-2'>
      <div><Link href="/">0xAppName</Link></div>
      <div className="flex flex-row">
        <NavigationMenu className="mr-4">
          <NavigationMenuList>
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <ConnectButton />
      </div>
    </nav>
  )
}

export default Nav
