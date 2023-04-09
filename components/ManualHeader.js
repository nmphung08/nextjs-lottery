import { useEffect } from "react"
import { useMoralis } from "react-moralis"

function ManualHeader() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        let temp = window.localStorage.getItem("connected")
        if (temp == "true") {
            enableWeb3()
            // return (<div>Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}</div>)
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account) {
                console.log(`Connected to ${account}`)
            }
            else {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])

    return (<div>
        {account ? (
            <div>Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}</div>
        ) :
            (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (window) {
                            window.localStorage.setItem("connected", "true")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >Connect</button>
            )}
    </div>
    )
    // return (<div>hello</div>)
}


export default ManualHeader