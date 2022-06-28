import { ConnectButton } from "web3uikit";
import Image from "next/image";

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row ">
            <Image src="/logo.ico" height="65" width="65" />
            <div className="items-center">
                <h1 className="font-bold absolute left-24 top-8 text-3xl pl-15">
                    Polygon Name Service
                </h1>
                <div className="absolute right-4 top-10">
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </div>
    );
}
