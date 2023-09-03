import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

// your code

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum != "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("connected")
        connectButton.innerHTML = "Connected"
    } else {
        document.getElementById("connectButton").innerHTML =
            "Please connect to metamask"
    }
}
async function fund() {
    console.log(`Funding with ${ethAmount}...`)
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTransactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
async function getBalance() {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function withdraw() {
    if (typeof window.ethereum != undefined) {
        console.log(`Withdraw funds...`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with${transactionReceipt.confirmations}`)
        })
        resolve()
    })
}
