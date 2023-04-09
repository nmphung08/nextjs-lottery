import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { Bell, useNotification } from "web3uikit"

export default function LotteryEntrace() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    let chainId = parseInt(chainIdHex)
    let blockConfirmations
    if (chainId == 1337 || chainId == 31337) {
        blockConfirmations = 1
    } else {
        // 6 for best finality
        // blockConfirmations = 6
        blockConfirmations = 1

    }
    let raffleAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()


    const [entranceFee, setEntranceFee] = useState("")
    const [nPlayer, setNPlayer] = useState("")
    const [recentWinner, setRecentWinner] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSuccess(tx) {
        setIsLoading(true)
        await tx.wait(blockConfirmations)
        handleNotification(tx)
        updateUI()
        setIsLoading(false)
    }

    function handleNotification(tx) {
        dispatch({
            title: "Transaction Notification",
            message: "Transaction Complete!",
            type: "info",
            position: "topR",
            icon: <Bell />,
        })
    }

    const {
        runContractFunction: enterRaffle,
        data,
        error,
        // isLoading: enterIsLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getPlayersNumber",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        if (raffleAddress) {
            let fee = (await getEntranceFee()).toString()
            let n = parseInt(await getPlayersNumber())
            let winner = await getRecentWinner()
            setEntranceFee(fee)
            setNPlayer(n)
            setRecentWinner(winner)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId])

    return (
        <>
            <div className="p-5 text-lg font-medium">
                Hi from Lottery Entrance!
                {raffleAddress ? (
                    <div>
                        Entrance fee: {entranceFee / 1e18} ETH
                        <br />
                        Player joined: {nPlayer}
                        <br />
                        Prize pool: {(nPlayer * entranceFee) / 1e18} ETH
                        <br />
                        Recent Winner: {recentWinner}
                        <div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 font-bold text-white py-2 px-4 ml-auto rounded mt-4"
                                onClick={async () => {
                                    await enterRaffle({
                                        onSuccess: handleSuccess,
                                        onError: async (e) => {
                                            console.log(e)
                                        },
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                {(isLoading || isFetching) ? (
                                    <div className="animate-spin h-8 w-6 border-b-2 rounded-full"></div>
                                ) : (
                                    "Enter Raffle"
                                )}
                            </button>
                        </div>
                    </div>
                ) : account ? (
                    <div>No contract deployed on this network yet.</div>
                ) : (
                    <div>Please connect your wallet.</div>
                )}
            </div>
        </>
    )
}
