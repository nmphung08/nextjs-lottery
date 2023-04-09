import Head from "next/head"
import { Inter } from "next/font/google"
// import styles from '@/styles/Home.module.css'
// import ManualHeader from '@/components/ManualHeader'
import Header from "@/components/Header"
import LotteryEntrace from "@/components/LotteryEntrace"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrace />
        </>
    )
}
