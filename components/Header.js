import { ConnectButton } from "web3uikit"
export default function Header() {
    return (
        <div className="border-b-2 p-5 flex flex-row">
            <h1 className="py-4 px-4 text-3xl font-semibold">
                Decentralized Lottery
            </h1>
            <div className="py-2 px-4 ml-auto">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
