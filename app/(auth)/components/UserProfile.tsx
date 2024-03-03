import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Session } from "next-auth"
import Image from "next/image"
import { signOut } from "next-auth/react"

export const UserAccount = ({ session }: { session: Session }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    src={session.user.image as string}
                    alt="User Setting button"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex">
                    <div className="flex">
                        <Image
                            src={session.user.image as string}
                            alt="User Setting button"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <SheetTitle className="ml-2">{session.user.name}</SheetTitle>
                    </div>
                </SheetHeader>
                <div className="flex-1" />
                <div className="grid">
                    <Button
                        onClick={() => signOut()}
                        variant="destructive"
                    >
                        Log out
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
